/**
 * Quranic Speech Recognition Engine for Mobile & Desktop
 * Robust Arabic Voice Recognition with Auto-Restart, Interim Buffering,
 * and Audio Level Visualization.
 */

import { normalizeArabicText } from './arabicNormalizer';

export interface SpeechEngineCallbacks {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (error: string) => void;
  onStatusChange: (status: 'idle' | 'listening' | 'processing' | 'permission_denied' | 'unsupported') => void;
  onAudioLevel?: (level: number) => void; // 0 to 100
}

interface IWindowSpeechRecognition extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export class QuranSpeechEngine {
  private recognition: any = null;
  private isListeningActive: boolean = false;
  private callbacks: SpeechEngineCallbacks;
  private restartTimeout: number | null = null;
  private audioStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private animFrameId: number | null = null;
  private lastSpokenText: string = '';

  constructor(callbacks: SpeechEngineCallbacks) {
    this.callbacks = callbacks;
    this.initRecognition();
  }

  private initRecognition(): boolean {
    const win = typeof window !== 'undefined' ? (window as IWindowSpeechRecognition) : null;
    if (!win) return false;

    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      this.callbacks.onStatusChange('unsupported');
      return false;
    }

    try {
      this.recognition = new SpeechRecognitionClass();
      this.recognition.lang = 'ar-SA'; // Arabic Saudi Arabia standard
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 5; // Get multiple candidates to catch "الله" and Quranic words accurately

      this.recognition.onstart = () => {
        this.callbacks.onStatusChange('listening');
      };

      this.recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          const transcriptChunk = result[0].transcript;

          if (result.isFinal) {
            finalTranscript += transcriptChunk + ' ';
          } else {
            interimTranscript += transcriptChunk + ' ';
          }
        }

        const combined = (finalTranscript + interimTranscript).trim();
        if (combined) {
          this.lastSpokenText = combined;
          this.callbacks.onResult(combined, finalTranscript.length > 0);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition event error:', event.error);
        if (event.error === 'not-allowed') {
          this.isListeningActive = false;
          this.callbacks.onStatusChange('permission_denied');
          this.callbacks.onError('تم رفض إذن استخدام الميكروفون. يرجى تفعيل إذن الميكروفون في إعدادات المتصفح.');
        } else if (event.error === 'no-speech') {
          // Mobile timeout on silence - perfectly normal, will auto-restart
        } else {
          this.callbacks.onError(`تنبيه الصوت: ${event.error}`);
        }
      };

      this.recognition.onend = () => {
        // Mobile browsers frequently terminate recognition after short silence.
        // Auto-restart seamlessly if user hasn't explicitly clicked stop!
        if (this.isListeningActive) {
          if (this.restartTimeout) clearTimeout(this.restartTimeout);
          this.restartTimeout = window.setTimeout(() => {
            if (this.isListeningActive) {
              try {
                this.recognition.start();
              } catch (e) {
                console.log('Restarting recognition attempt:', e);
              }
            }
          }, 150);
        } else {
          this.callbacks.onStatusChange('idle');
          this.stopAudioVisualizer();
        }
      };

      return true;
    } catch (err) {
      console.error('Failed to instantiate SpeechRecognition:', err);
      this.callbacks.onStatusChange('unsupported');
      return false;
    }
  }

  /**
   * Start listening to voice recitation
   */
  public async start(): Promise<boolean> {
    if (!this.recognition) {
      const initialized = this.initRecognition();
      if (!initialized) return false;
    }

    this.isListeningActive = true;
    this.lastSpokenText = '';

    try {
      this.recognition.start();
      this.startAudioVisualizer();
      return true;
    } catch (e: any) {
      // If already started, ignore error
      if (e.name !== 'InvalidStateError') {
        console.warn('Speech start error:', e);
      }
      this.startAudioVisualizer();
      return true;
    }
  }

  /**
   * Stop listening
   */
  public stop(): void {
    this.isListeningActive = false;
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }

    this.stopAudioVisualizer();
    this.callbacks.onStatusChange('idle');
  }

  public isListening(): boolean {
    return this.isListeningActive;
  }

  /**
   * Start Mic visualizer wave using Web Audio API
   */
  private async startAudioVisualizer(): Promise<void> {
    if (!this.callbacks.onAudioLevel) return;

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.audioContext = new AudioContextClass();
        const source = this.audioContext.createMediaStreamSource(this.audioStream);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 64;
        source.connect(this.analyser);

        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

        const checkVolume = () => {
          if (!this.isListeningActive || !this.analyser) return;

          this.analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length;
          const normalizedLevel = Math.min(100, Math.round((average / 128) * 100));

          if (this.callbacks.onAudioLevel) {
            this.callbacks.onAudioLevel(normalizedLevel);
          }

          this.animFrameId = requestAnimationFrame(checkVolume);
        };

        checkVolume();
      }
    } catch {
      // Audio visualization is optional enhancement; continue without failing speech
    }
  }

  private stopAudioVisualizer(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.audioStream) {
      this.audioStream.getTracks().forEach(t => t.stop());
      this.audioStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch {
        // ignore
      }
      this.audioContext = null;
    }
    if (this.callbacks.onAudioLevel) {
      this.callbacks.onAudioLevel(0);
    }
  }
}
