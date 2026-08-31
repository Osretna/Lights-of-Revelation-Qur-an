import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  X,
  Play,
  Pause,
  Award,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import { useQuran } from '../context/QuranContext';
import { SURAH_LIST } from '../data/surahList';
import { Ayah, SurahDetail } from '../types/quran';
import { getSurahDetail } from '../data/quranSampleData';
import {
  normalizeArabicText,
  isWordMatch,
  isLafzAlJalalah,
  calculateSimilarity,
  splitQuranTextIntoWords
} from '../utils/arabicNormalizer';
import { soundManager } from '../utils/soundManager';

interface VoiceCorrectionModalProps {
  initialSurahNum?: number;
  initialAyahNum?: number;
  onClose: () => void;
}

export const VoiceCorrectionModal: React.FC<VoiceCorrectionModalProps> = ({
  initialSurahNum = 1,
  initialAyahNum = 1,
  onClose
}) => {
  const { showToast, audioState, playAyahAudio, pauseAudio, recordCorrectionAttempt } = useQuran();

  const [surahNum, setSurahNum] = useState<number>(initialSurahNum);
  const [ayahNum, setAyahNum] = useState<number>(initialAyahNum);
  const [surahData, setSurahData] = useState<SurahDetail | null>(null);
  const [isLoadingSurah, setIsLoadingSurah] = useState<boolean>(true);

  // Recitation & Speech State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimText, setInterimText] = useState<string>('');
  const [wordsStatus, setWordsStatus] = useState<('pending' | 'correct' | 'current' | 'error')[]>([]);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorDetails, setErrorDetails] = useState<{ expected: string; spoken: string; index: number } | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [accuracyScore, setAccuracyScore] = useState<number>(100);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [teacherPlaying, setTeacherPlaying] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const currentAyah = surahData?.ayahs?.find(a => a.numberInSurah === ayahNum) || null;
  
  // Extract clean structured words from Ayah text
  const targetWordsData = currentAyah ? splitQuranTextIntoWords(currentAyah.text) : [];
  const targetWords = targetWordsData.map(w => w.original);
  const normalizedTargetWords = targetWordsData.map(w => w.clean);

  // Load Surah Details
  useEffect(() => {
    let mounted = true;
    setIsLoadingSurah(true);
    getSurahDetail(surahNum)
      .then(res => {
        if (mounted) {
          setSurahData(res);
          setIsLoadingSurah(false);
        }
      })
      .catch(() => {
        if (mounted) setIsLoadingSurah(false);
      });
    return () => {
      mounted = false;
    };
  }, [surahNum]);

  // Reset words state on Ayah change
  useEffect(() => {
    if (targetWords.length > 0) {
      setWordsStatus(new Array(targetWords.length).fill('pending'));
      setTranscript('');
      setInterimText('');
      setHasError(false);
      setErrorDetails(null);
      setIsCompleted(false);
      setAccuracyScore(100);
    }
  }, [ayahNum, surahNum, targetWords.length]);

  // Synchronize teacherPlaying state with global audioState
  useEffect(() => {
    if (audioState.isPlaying && audioState.surahNumber === surahNum && audioState.ayahNumber === ayahNum) {
      setTeacherPlaying(true);
    } else {
      setTeacherPlaying(false);
    }
  }, [audioState.isPlaying, audioState.surahNumber, audioState.ayahNumber, surahNum, ayahNum]);

  // Initialize Speech Recognition
  useEffect(() => {
    const win = typeof window !== 'undefined' ? (window as any) : null;
    const SpeechRecognitionClass = win?.SpeechRecognition || win?.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ar-SA';
    recognition.maxAlternatives = 5;

    recognition.onresult = (event: any) => {
      let finalStr = '';
      let interimStr = '';

      for (let i = 0; i < event.results.length; i++) {
        const item = event.results[i];
        if (item.isFinal) {
          finalStr += item[0].transcript + ' ';
        } else {
          interimStr += item[0].transcript + ' ';
        }
      }

      const combinedText = (finalStr + ' ' + interimStr).trim();
      setTranscript(finalStr);
      setInterimText(interimStr);

      evaluateRecitation(combinedText, event.results[event.results.length - 1]?.isFinal || false);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition event error:', event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        showToast('يرجى السماح بالوصول للميكروفون لبدء الاستماع لتلاوتك 🎙️');
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      if (isListening && !hasError && !isCompleted) {
        try {
          recognition.start();
        } catch {
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // ignore
      }
    };
  }, [isListening, hasError, isCompleted, normalizedTargetWords.length]);

  // Evaluate user speech against Ayah words with robust phonetic & continuous matching
  const evaluateRecitation = (spokenFullText: string, isFinalChunk: boolean = false) => {
    if (!spokenFullText || normalizedTargetWords.length === 0) return;

    const spokenTokens = normalizeArabicText(spokenFullText)
      .split(/\s+/)
      .filter(Boolean);

    if (spokenTokens.length === 0) return;

    const newStatuses: ('pending' | 'correct' | 'current' | 'error')[] = new Array(
      normalizedTargetWords.length
    ).fill('pending');

    let currentTargetIdx = 0;
    let mismatchFound = false;

    for (let sIdx = 0; sIdx < spokenTokens.length && currentTargetIdx < normalizedTargetWords.length; sIdx++) {
      const spokenWord = spokenTokens[sIdx];
      const targetWord = normalizedTargetWords[currentTargetIdx];

      // 1. Direct or Phonetic Match (includes all variations of لفظ الجلالة)
      if (isWordMatch(targetWord, spokenWord)) {
        newStatuses[currentTargetIdx] = 'correct';
        currentTargetIdx++;
        continue;
      }

      // 2. Compound Multi-Word Match in Speech (e.g., spoken: "بسم" + "الله" or target: "بسمالله")
      if (sIdx + 1 < spokenTokens.length) {
        const combinedSpoken = spokenWord + spokenTokens[sIdx + 1];
        if (isWordMatch(targetWord, combinedSpoken)) {
          newStatuses[currentTargetIdx] = 'correct';
          currentTargetIdx++;
          sIdx++; // skip next spoken token since it was part of this target word
          continue;
        }
      }

      // 3. Combined Target Match (e.g., spoken: "بسمالله" for target: ["بسم", "الله"])
      if (currentTargetIdx + 1 < normalizedTargetWords.length) {
        const combinedTarget = targetWord + normalizedTargetWords[currentTargetIdx + 1];
        if (isWordMatch(combinedTarget, spokenWord)) {
          newStatuses[currentTargetIdx] = 'correct';
          newStatuses[currentTargetIdx + 1] = 'correct';
          currentTargetIdx += 2;
          continue;
        }
      }

      // 4. Lookahead 1 word: check if user skipped or omitted a minor particle
      if (currentTargetIdx + 1 < normalizedTargetWords.length) {
        const nextTargetWord = normalizedTargetWords[currentTargetIdx + 1];
        if (isWordMatch(nextTargetWord, spokenWord)) {
          // User moved to the next word
          newStatuses[currentTargetIdx] = 'error';
          newStatuses[currentTargetIdx + 1] = 'correct';
          
          if (isFinalChunk) {
            mismatchFound = true;
            setHasError(true);
            setErrorDetails({
              expected: targetWords[currentTargetIdx],
              spoken: spokenWord,
              index: currentTargetIdx
            });
            soundManager.playErrorChime();
            stopListening();
            showToast(`تنبيه: يرجى نطق كلمة ﴿${targetWords[currentTargetIdx]}﴾`);
            break;
          }
          currentTargetIdx += 2;
          continue;
        }
      }

      // 5. If word doesn't match and it's the last word in the spoken stream
      if (sIdx === spokenTokens.length - 1 && !isFinalChunk) {
        // Still speaking interim syllables, do NOT interrupt user
        break;
      }

      // 6. Definite Mismatch on final or completed chunk
      if (isFinalChunk && sIdx >= spokenTokens.length - 1) {
        const sim = calculateSimilarity(spokenWord, targetWord);
        if (sim < 0.65 && !isLafzAlJalalah(targetWord)) {
          mismatchFound = true;
          newStatuses[currentTargetIdx] = 'error';
          setHasError(true);
          setErrorDetails({
            expected: targetWords[currentTargetIdx],
            spoken: spokenWord,
            index: currentTargetIdx
          });
          soundManager.playErrorChime();
          stopListening();
          break;
        }
      }
    }

    if (!mismatchFound) {
      if (currentTargetIdx < normalizedTargetWords.length) {
        newStatuses[currentTargetIdx] = 'current';
      } else {
        // Recited all words correctly!
        for (let i = 0; i < normalizedTargetWords.length; i++) {
          newStatuses[i] = 'correct';
        }
        setIsCompleted(true);
        setHasError(false);
        setErrorDetails(null);
        soundManager.playSuccessChime();
        soundManager.triggerVibration([100, 50, 100]);
        stopListening();
        recordCorrectionAttempt(true);
        showToast('ما شاء الله! تلاوة صحيحة ومتقنة 🌟');
      }
    }

    setWordsStatus(newStatuses);
  };

  const startListening = () => {
    soundManager.unlockAudio();
    setHasError(false);
    setErrorDetails(null);
    setIsCompleted(false);
    setTranscript('');
    setInterimText('');
    setWordsStatus(new Array(targetWords.length).fill('pending'));
    recordCorrectionAttempt(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        showToast('جاري الاستماع... ابدأ بالتلاوة بصوت واضح 🎙️');
      } catch (err) {
        try {
          recognitionRef.current.stop();
          setTimeout(() => {
            recognitionRef.current.start();
            setIsListening(true);
          }, 200);
        } catch {
          // ignore
        }
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  };

  const handlePlayTeacherAyah = () => {
    if (teacherPlaying) {
      pauseAudio();
      setTeacherPlaying(false);
    } else {
      // Play current Ayah strictly with user's selected reciter in single-ayah mode
      playAyahAudio(surahNum, ayahNum, audioState.reciter.id, true);
      setTeacherPlaying(true);
      showToast(`استمع للتلاوة الصحيحة للآية بصوت ${audioState.reciter.name} 🎧`);
    }
  };

  const handleNextAyah = () => {
    if (!surahData) return;
    if (ayahNum < surahData.numberOfAyahs) {
      setAyahNum(prev => prev + 1);
    } else if (surahNum < 114) {
      setSurahNum(prev => prev + 1);
      setAyahNum(1);
    }
  };

  const handlePrevAyah = () => {
    if (ayahNum > 1) {
      setAyahNum(prev => prev - 1);
    } else if (surahNum > 1) {
      setSurahNum(prev => prev - 1);
      setAyahNum(1);
    }
  };

  const surahMeta = SURAH_LIST.find(s => s.number === surahNum) || SURAH_LIST[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-[#042118] border-2 border-[#d4af37]/50 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto"
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#d4af37]/25 flex justify-between items-center bg-gradient-to-r from-[#063321] via-[#042118] to-[#063321] text-[#f5f2ed]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#d4af37] flex items-center gap-2">
                <span>المساعد الصوتي ومصحح التلاوة الذكي</span>
                <span className="text-[10px] bg-[#d4af37] text-[#042118] font-bold px-2 py-0.5 rounded-full">AI Live</span>
              </h3>
              <p className="text-xs text-[#f5f2ed]/70">
                اقرأ بصوتك، وسيقوم التطبيق بالاستماع لك وتصحيح التلاوة والكلمات فورياً
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#084d32] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#042118] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Surah & Ayah Selector Bar */}
        <div className="bg-[#063321]/60 border-b border-[#d4af37]/20 p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <label className="text-[#f5f2ed]/80 font-bold">السورة:</label>
            <select
              value={surahNum}
              onChange={e => {
                setSurahNum(Number(e.target.value));
                setAyahNum(1);
              }}
              className="bg-[#042118] border border-[#d4af37]/40 rounded-xl px-3 py-1.5 text-[#f5f2ed] font-bold focus:outline-none focus:border-[#d4af37]"
            >
              {SURAH_LIST.map(s => (
                <option key={s.number} value={s.number}>
                  {s.number}. سورة {s.name} ({s.numberOfAyahs} آية)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-[#f5f2ed]/80 font-bold">الآية:</label>
            <select
              value={ayahNum}
              onChange={e => setAyahNum(Number(e.target.value))}
              className="bg-[#042118] border border-[#d4af37]/40 rounded-xl px-3 py-1.5 text-[#f5f2ed] font-bold focus:outline-none focus:border-[#d4af37]"
            >
              {Array.from({ length: surahMeta.numberOfAyahs }, (_, i) => i + 1).map(n => (
                <option key={n} value={n}>
                  الآية {n}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevAyah}
              disabled={surahNum === 1 && ayahNum === 1}
              className="p-1.5 rounded-lg bg-[#042118] border border-[#d4af37]/30 text-[#d4af37] disabled:opacity-30 hover:bg-[#084d32]"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="font-mono font-bold text-[#d4af37]">
              {ayahNum} / {surahMeta.numberOfAyahs}
            </span>
            <button
              onClick={handleNextAyah}
              disabled={surahNum === 114 && ayahNum === surahMeta.numberOfAyahs}
              className="p-1.5 rounded-lg bg-[#042118] border border-[#d4af37]/30 text-[#d4af37] disabled:opacity-30 hover:bg-[#084d32]"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
          {!speechSupported ? (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 flex-shrink-0 text-rose-400" />
              <span>
                متصفحك الحالي لا يدعم التعرف الصوتي المباشر. يُرجى فتح التطبيق في Google Chrome أو متصفح يدعم Web Speech API.
              </span>
            </div>
          ) : null}

          {/* Ayah Card with Word-by-Word Highlight */}
          <div className="bg-[#063321] border-2 border-[#d4af37]/30 rounded-3xl p-6 sm:p-8 text-center shadow-lg relative overflow-hidden">
            <div className="text-xs text-[#d4af37] font-bold mb-4 flex justify-between items-center border-b border-[#d4af37]/15 pb-2.5">
              <span>سورة {surahMeta.name}</span>
              <span>الآية {ayahNum} • الجزء {surahMeta.startJuz}</span>
            </div>

            {/* Ayah Words Display */}
            {isLoadingSurah ? (
              <div className="py-12 flex justify-center items-center">
                <div className="w-8 h-8 border-3 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="py-4 font-quran text-2xl sm:text-3xl lg:text-4xl text-[#f5f2ed] leading-loose flex flex-wrap justify-center gap-x-2.5 gap-y-3 select-none">
                {targetWords.map((word, idx) => {
                  const status = wordsStatus[idx] || 'pending';
                  let statusClass = 'text-[#f5f2ed] bg-transparent';
                  if (status === 'correct') {
                    statusClass = 'text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 rounded-xl px-2.5 py-1 font-bold shadow-sm';
                  } else if (status === 'current') {
                    statusClass = 'text-[#d4af37] bg-[#d4af37]/20 border border-[#d4af37] rounded-xl px-2.5 py-1 animate-pulse';
                  } else if (status === 'error') {
                    statusClass = 'text-rose-300 bg-rose-950/80 border-2 border-rose-500 rounded-xl px-2.5 py-1 font-bold shadow-md';
                  }

                  return (
                    <span
                      key={idx}
                      className={`transition-all duration-300 inline-block ${statusClass}`}
                      title={status === 'correct' ? 'تلاوة صحيحة' : status === 'error' ? 'خطأ في النطق' : ''}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Correction Error Alert Banner */}
            <AnimatePresence>
              {hasError && errorDetails && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-6 p-4 rounded-2xl bg-rose-950/90 border-2 border-rose-500 text-rose-100 text-xs sm:text-sm text-right space-y-2 shadow-xl"
                >
                  <div className="flex items-center gap-2 text-rose-400 font-bold">
                    <AlertTriangle className="w-5 h-5" />
                    <span>تنبيه: تم رصد اختلاف في التلاوة</span>
                  </div>
                  <p className="leading-relaxed">
                    النطق الصحيح في موضع الخطأ هو: <span className="font-quran text-lg text-emerald-300 font-bold bg-black/40 px-2.5 py-1 rounded-lg border border-emerald-500/30">﴿{errorDetails.expected}﴾</span>
                  </p>
                  {errorDetails.spoken && (
                    <p className="text-[11px] text-rose-300/80">
                      ما تم سماعه: "{errorDetails.spoken}"
                    </p>
                  )}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <button
                      onClick={handlePlayTeacherAyah}
                      className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all ${
                        teacherPlaying
                          ? 'bg-amber-400 text-[#042118] ring-2 ring-amber-300 animate-pulse'
                          : 'bg-amber-500 hover:bg-amber-400 text-[#042118]'
                      }`}
                    >
                      {teacherPlaying ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      <span>{teacherPlaying ? 'إيقاف التلاوة' : `استمع للنطق الصحيح (${audioState.reciter.name})`}</span>
                    </button>
                    <button
                      onClick={startListening}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-800 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>أعد التلاوة الآن</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Celebration Banner */}
            <AnimatePresence>
              {isCompleted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 p-4 rounded-2xl bg-emerald-950 border-2 border-emerald-400 text-emerald-100 text-center space-y-3 shadow-xl"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-[#042118] flex items-center justify-center mx-auto shadow-md">
                    <Award className="w-7 h-7" />
                  </div>
                  <h4 className="font-serif font-bold text-lg text-emerald-300">
                    أحسنت! تلاوة صحيحة ومتقنة 100% 🌟
                  </h4>
                  <p className="text-xs text-emerald-200/80">
                    بارك الله في تلاوتك لكتاب الله، يمكنك الانتقال للآية التالية للمتابعة.
                  </p>
                  <button
                    onClick={handleNextAyah}
                    className="px-6 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#c19b2e] text-[#042118] font-bold text-xs shadow-md transition-transform hover:scale-105 inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>الآية التالية</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Real-time Spoken Text Preview */}
          <div className="p-4 rounded-2xl bg-[#063321]/40 border border-[#d4af37]/20 text-xs space-y-1">
            <div className="flex justify-between items-center text-[#d4af37]">
              <span className="font-bold flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5" />
                <span>ما تم التقاطه من صوتك:</span>
              </span>
              {isListening && (
                <span className="text-emerald-400 font-semibold animate-pulse flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  جاري الاستماع المباشر
                </span>
              )}
            </div>
            <p className="text-[#f5f2ed] font-medium min-h-[24px]">
              {transcript || interimText || (isListening ? 'تفضل بالقراءة الآن...' : 'انقر على زر الميكروفون بالأسفل لبدء التلاوة')}
            </p>
          </div>
        </div>

        {/* Modal Bottom Controls Bar */}
        <div className="p-4 sm:p-5 border-t border-[#d4af37]/25 bg-gradient-to-r from-[#063321] to-[#042118] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayTeacherAyah}
              className={`p-3 rounded-2xl border transition-colors flex items-center gap-2 font-bold text-xs cursor-pointer shadow-md ${
                teacherPlaying
                  ? 'bg-amber-400 text-[#042118] border-amber-300 ring-2 ring-amber-300 animate-pulse'
                  : 'bg-[#084d32] border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37] hover:text-[#042118]'
              }`}
            >
              {teacherPlaying ? <Pause className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              <span>{teacherPlaying ? 'إيقاف التلاوة' : `استماع للآية بصوت ${audioState.reciter.name}`}</span>
            </button>
          </div>

          {/* Primary Big Mic Button */}
          <div className="flex items-center gap-3">
            {isListening ? (
              <button
                onClick={stopListening}
                className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg animate-pulse cursor-pointer"
              >
                <MicOff className="w-5 h-5" />
                <span>إيقاف الاستماع</span>
              </button>
            ) : (
              <button
                onClick={startListening}
                className="px-8 py-3.5 rounded-2xl bg-[#d4af37] hover:bg-[#c19b2e] text-[#042118] font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Mic className="w-5 h-5" />
                <span>ابدأ تلاوة الآية</span>
              </button>
            )}

            <button
              onClick={() => {
                setWordsStatus(new Array(targetWords.length).fill('pending'));
                setTranscript('');
                setInterimText('');
                setHasError(false);
                setErrorDetails(null);
                setIsCompleted(false);
              }}
              title="إعادة ضبط"
              className="p-3 rounded-2xl bg-[#042118] border border-[#d4af37]/30 text-[#f5f2ed] hover:text-[#d4af37] cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

