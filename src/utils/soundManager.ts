/**
 * Sound and Notification Manager
 * Handles Mobile AudioContext unlocking, Adhan sounds, Quran Reciter streams,
 * Vibration API, and System/In-App Notifications.
 */

export interface AdhanVoice {
  id: string;
  name: string;
  muezzin: string;
  url: string;
  isFajrOnly?: boolean;
}

export const ADHAN_VOICES: AdhanVoice[] = [
  {
    id: 'makkah',
    name: 'أذان الحرم المكي الشريف',
    muezzin: 'الشيخ علي ملا - مكة المكرمة',
    url: 'https://cdn.islamic.network/audio/adhan/makkah.mp3'
  },
  {
    id: 'madinah',
    name: 'أذان المسجد النبوي الشريف',
    muezzin: 'المدينة المنورة',
    url: 'https://cdn.islamic.network/audio/adhan/madina.mp3'
  },
  {
    id: 'alaqsa',
    name: 'أذان المسجد الأقصى المبارك',
    muezzin: 'القدس الشريف',
    url: 'https://cdn.islamic.network/audio/adhan/alaqsa.mp3'
  },
  {
    id: 'alafasy',
    name: 'أذان مشاري راشد العفاسي',
    muezzin: 'مشاري العفاسي',
    url: 'https://cdn.islamic.network/audio/adhan/alafasy.mp3'
  },
  {
    id: 'cairo',
    name: 'أذان القاهرة - صوت مصري أصيل',
    muezzin: 'الشيخ محمد رفعت / إذاعة القرآن الكريم',
    url: 'https://cdn.islamic.network/audio/adhan/cairo.mp3'
  },
  {
    id: 'fajr',
    name: 'أذان الفجر (الصلاة خير من النوم)',
    muezzin: 'الحرم المكي - لصلاة الفجر',
    url: 'https://cdn.islamic.network/audio/adhan/fajr.mp3',
    isFajrOnly: true
  }
];

class SoundManager {
  private audioCtx: AudioContext | null = null;
  private isUnlocked: boolean = false;
  private currentAdhanAudio: HTMLAudioElement | null = null;
  private currentRecitationAudio: HTMLAudioElement | null = null;

  /**
   * Unlock AudioContext on mobile user tap/interaction
   */
  public unlockAudio(): void {
    if (this.isUnlocked) return;

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        if (!this.audioCtx) {
          this.audioCtx = new AudioContextClass();
        }
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }
        // Play silent buffer
        const buffer = this.audioCtx.createBuffer(1, 1, 22050);
        const source = this.audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioCtx.destination);
        source.start(0);
        this.isUnlocked = true;
      }
    } catch (e) {
      console.warn('AudioContext unlock failed:', e);
    }
  }

  public isAudioUnlocked(): boolean {
    return this.isUnlocked;
  }

  /**
   * Play high-pitched gentle chime on successful word recitation
   */
  public playSuccessChime(): void {
    try {
      this.unlockAudio();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, this.audioCtx.currentTime); // E5
      osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.12); // A5

      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.25);
    } catch {
      // ignore
    }
  }

  /**
   * Play gentle soft low note on mistake or skipped word
   */
  public playErrorChime(): void {
    try {
      this.unlockAudio();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(329.63, this.audioCtx.currentTime); // E4
      osc.frequency.exponentialRampToValueAtTime(261.63, this.audioCtx.currentTime + 0.15); // C4

      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.25);
    } catch {
      // ignore
    }
  }

  /**
   * Haptic vibration on mobile
   */
  public triggerVibration(pattern: number[] = [100, 50, 100]): void {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // ignore
      }
    }
  }

  /**
   * Play Adhan audio
   */
  public playAdhan(adhanId: string = 'makkah', volume: number = 1.0, onEnded?: () => void): HTMLAudioElement | null {
    this.stopAdhan();
    this.unlockAudio();

    const voice = ADHAN_VOICES.find(v => v.id === adhanId) || ADHAN_VOICES[0];
    const audio = new Audio(voice.url);
    audio.volume = Math.max(0, Math.min(1, volume));

    audio.onended = () => {
      this.currentAdhanAudio = null;
      if (onEnded) onEnded();
    };

    audio.onerror = (e) => {
      console.warn('Adhan audio failed to load online URL, using fallback synthesized takbeer:', e);
      this.playSynthesizedTakbeer(onEnded);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy prevented playback, attempt fallback synthesis
        this.playSynthesizedTakbeer(onEnded);
      });
    }

    this.currentAdhanAudio = audio;
    return audio;
  }

  /**
   * Fallback Takbeer Tone Synthesis if audio URL is blocked or offline
   */
  public playSynthesizedTakbeer(onEnded?: () => void): void {
    try {
      this.unlockAudio();
      if (!this.audioCtx) return;

      const notes = [
        { freq: 440, dur: 0.6 }, // Allahu
        { freq: 523.25, dur: 0.8 }, // Akbar
        { freq: 440, dur: 0.6 },
        { freq: 523.25, dur: 1.0 }
      ];

      let startTime = this.audioCtx.currentTime + 0.1;
      notes.forEach(n => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, startTime);
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + n.dur);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(startTime);
        osc.stop(startTime + n.dur);
        startTime += n.dur + 0.2;
      });

      setTimeout(() => {
        if (onEnded) onEnded();
      }, (startTime - this.audioCtx.currentTime) * 1000);
    } catch {
      if (onEnded) onEnded();
    }
  }

  /**
   * Stop playing Adhan
   */
  public stopAdhan(): void {
    if (this.currentAdhanAudio) {
      this.currentAdhanAudio.pause();
      this.currentAdhanAudio.currentTime = 0;
      this.currentAdhanAudio = null;
    }
  }

  public isAdhanPlaying(): boolean {
    return !!(this.currentAdhanAudio && !this.currentAdhanAudio.paused);
  }

  /**
   * Play Ayah recitation from Qari
   */
  public playAyahAudio(
    ayahGlobalNumber: number,
    reciterServerUrl: string = 'https://cdn.islamic.network/quran/audio/128/ar.alafasy',
    onEnded?: () => void
  ): HTMLAudioElement {
    this.stopRecitation();
    this.unlockAudio();

    const url = `${reciterServerUrl}/${ayahGlobalNumber}.mp3`;
    const audio = new Audio(url);

    audio.onended = () => {
      this.currentRecitationAudio = null;
      if (onEnded) onEnded();
    };

    audio.play().catch(e => {
      console.warn('Could not auto-play Ayah audio:', e);
    });

    this.currentRecitationAudio = audio;
    return audio;
  }

  public stopRecitation(): void {
    if (this.currentRecitationAudio) {
      this.currentRecitationAudio.pause();
      this.currentRecitationAudio.currentTime = 0;
      this.currentRecitationAudio = null;
    }
  }

  /**
   * Request Notification Permission with mobile compatibility
   */
  public async requestNotificationPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (e) {
      console.warn('Notification permission error:', e);
      return false;
    }
  }

  /**
   * Show Notification for Adhan
   */
  public showPrayerNotification(prayerArabicName: string, cityName: string): void {
    this.triggerVibration([500, 250, 500, 250, 1000]);

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`حان الآن موعد أذان ${prayerArabicName}`, {
          body: `بتوقيت مدينة ${cityName} - حي على الصلاة، حي على الفلاح`,
          icon: '/favicon.ico',
          tag: `prayer-${prayerArabicName}`,
          requireInteraction: true
        });
      } catch (e) {
        console.warn('Notification display failed:', e);
      }
    }
  }
}

export const soundManager = new SoundManager();
