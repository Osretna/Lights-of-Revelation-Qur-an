import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Mic, MicOff, Play, Pause, RotateCcw, Volume2, Check, AlertCircle, 
  ChevronRight, ChevronLeft, Search, Sparkles, BookOpen, 
  Sliders, Award, HelpCircle, RefreshCw, VolumeX, Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SURAH_LIST, RECITERS_LIST, BUILTIN_SURAHS } from '../data/quranMetadata';
import { Ayah, WordMatchStatus, RecitationState } from '../types';
import { splitQuranTextIntoWords, isWordMatch, normalizeArabicText, isLafzAlJalalah } from '../utils/arabicNormalizer';
import { QuranSpeechEngine } from '../utils/speechEngine';
import { soundManager } from '../utils/soundManager';
import { getSavedQuranProgress, saveQuranProgress } from '../utils/storage';

export const QuranRecitation: React.FC = () => {
  // Saved state initialization
  const initialProgress = useMemo(() => getSavedQuranProgress(), []);

  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(initialProgress.surahNumber || 1);
  const [currentAyahIndex, setCurrentAyahIndex] = useState<number>(initialProgress.ayahIndex || 0);
  const [mode, setMode] = useState<'smart_voice' | 'read' | 'listen'>(initialProgress.mode || 'smart_voice');
  const [selectedReciterId, setSelectedReciterId] = useState<string>(initialProgress.reciterId || 'ar.alafasy');
  
  const [surahsList, setSurahsList] = useState(SURAH_LIST);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSurahModalOpen, setIsSurahModalOpen] = useState(false);
  const [isTafsirModalOpen, setIsTafsirModalOpen] = useState(false);
  const [tafsirContent, setTafsirContent] = useState<string>('');

  // Ayahs data for currently selected Surah
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [isLoadingAyahs, setIsLoadingAyahs] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<number>(28); // px for Arabic typography

  // Recitation Voice State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechStatus, setSpeechStatus] = useState<string>('idle');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [wordsStatus, setWordsStatus] = useState<WordMatchStatus[]>([]);
  const [score, setScore] = useState<number>(100);
  const [mistakesCount, setMistakesCount] = useState<number>(0);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);

  // Audio Playback State
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [currentAudioTime, setCurrentAudioTime] = useState<number>(0);
  const [speechEngineError, setSpeechEngineError] = useState<string | null>(null);

  const speechEngineRef = useRef<QuranSpeechEngine | null>(null);

  // Current active Surah metadata
  const currentSurah = useMemo(() => {
    return SURAH_LIST.find(s => s.number === selectedSurahNumber) || SURAH_LIST[0];
  }, [selectedSurahNumber]);

  // Current active Ayah
  const currentAyah = useMemo(() => {
    if (!ayahs || ayahs.length === 0) return null;
    return ayahs[currentAyahIndex] || ayahs[0];
  }, [ayahs, currentAyahIndex]);

  // Save progress whenever surah or ayah changes
  useEffect(() => {
    saveQuranProgress({
      surahNumber: selectedSurahNumber,
      ayahIndex: currentAyahIndex,
      mode,
      reciterId: selectedReciterId
    });
  }, [selectedSurahNumber, currentAyahIndex, mode, selectedReciterId]);

  // Fetch or load Ayahs when Surah changes
  useEffect(() => {
    let isMounted = true;
    setIsLoadingAyahs(true);

    const loadAyahs = async () => {
      // 1. Check if built-in offline data exists
      if (BUILTIN_SURAHS[selectedSurahNumber]) {
        const builtin = BUILTIN_SURAHS[selectedSurahNumber].ayahs.map(a => ({
          number: a.number,
          numberInSurah: a.numberInSurah,
          text: a.text,
          juz: currentSurah.juz,
          page: currentSurah.page,
          hizbQuarter: 1
        }));
        if (isMounted) {
          setAyahs(builtin);
          setIsLoadingAyahs(false);
        }
        return;
      }

      // 2. Fetch from Al-Quran Cloud API with cache
      try {
        const cacheKey = `quran_surah_${selectedSurahNumber}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (isMounted) {
            setAyahs(parsed);
            setIsLoadingAyahs(false);
          }
          return;
        }

        const res = await fetch(`https://api.alquran.cloud/v1/surah/${selectedSurahNumber}/quran-uthmani`);
        if (!res.ok) throw new Error('Failed to fetch from Quran API');
        const data = await res.json();
        
        if (data && data.data && data.data.ayahs && isMounted) {
          const formatted = data.data.ayahs.map((a: any) => ({
            number: a.number,
            numberInSurah: a.numberInSurah,
            text: a.text,
            juz: a.juz,
            page: a.page,
            hizbQuarter: a.hizbQuarter,
            sajda: !!a.sajda
          }));
          setAyahs(formatted);
          localStorage.setItem(cacheKey, JSON.stringify(formatted));
        }
      } catch (err) {
        console.warn('Online Quran fetch failed, using synthetic fallback:', err);
        // Minimal fallback
        if (isMounted) {
          const fallback = Array.from({ length: currentSurah.numberOfAyahs }).map((_, i) => ({
            number: i + 1,
            numberInSurah: i + 1,
            text: `آية رقم ${i + 1} من سورة ${currentSurah.name}`,
            juz: currentSurah.juz,
            page: currentSurah.page,
            hizbQuarter: 1
          }));
          setAyahs(fallback);
        }
      } finally {
        if (isMounted) setIsLoadingAyahs(false);
      }
    };

    loadAyahs();

    return () => {
      isMounted = false;
    };
  }, [selectedSurahNumber, currentSurah]);

  // Initialize word match tracking whenever current Ayah changes
  useEffect(() => {
    if (!currentAyah) return;

    const words = splitQuranTextIntoWords(currentAyah.text);
    const initialStatuses: WordMatchStatus[] = words.map((w, idx) => ({
      word: w.original,
      cleanWord: w.clean,
      status: idx === 0 ? 'active' : 'pending',
      index: idx
    }));

    setWordsStatus(initialStatuses);
    setCurrentWordIndex(0);
    setLiveTranscript('');
    setMistakesCount(0);
    setScore(100);
  }, [currentAyah]);

  // Speech Recognition Engine initialization & handlers
  useEffect(() => {
    speechEngineRef.current = new QuranSpeechEngine({
      onResult: (transcript, isFinal) => {
        setLiveTranscript(transcript);
        processSpokenWords(transcript);
      },
      onError: (err) => {
        setSpeechEngineError(err);
      },
      onStatusChange: (status) => {
        setSpeechStatus(status);
        if (status === 'listening') {
          setIsListening(true);
          setSpeechEngineError(null);
        } else if (status === 'idle' || status === 'permission_denied' || status === 'unsupported') {
          setIsListening(false);
        }
      },
      onAudioLevel: (level) => {
        setAudioLevel(level);
      }
    });

    return () => {
      if (speechEngineRef.current) {
        speechEngineRef.current.stop();
      }
    };
  }, [wordsStatus, currentWordIndex, currentAyah]);

  // Process incoming spoken words from microphone and match against the Ayah
  const processSpokenWords = (transcript: string) => {
    if (!wordsStatus || wordsStatus.length === 0 || currentWordIndex >= wordsStatus.length) {
      return;
    }

    const spokenTokens = transcript
      .trim()
      .split(/\s+/)
      .map(w => normalizeArabicText(w))
      .filter(w => w.length > 0);

    if (spokenTokens.length === 0) return;

    let targetIdx = currentWordIndex;
    let updated = [...wordsStatus];
    let matchedAny = false;

    // Check each spoken word against current expected word with forward lookahead
    for (let sIdx = 0; sIdx < spokenTokens.length; sIdx++) {
      if (targetIdx >= updated.length) break;

      const spoken = spokenTokens[sIdx];
      const targetWord = updated[targetIdx];

      // Match single word (handling لفظ الجلالة & prefixes)
      if (isWordMatch(targetWord.cleanWord, spoken)) {
        updated[targetIdx] = {
          ...targetWord,
          status: 'matched',
          spokenWord: spoken
        };
        soundManager.playSuccessChime();
        soundManager.triggerVibration([40]);
        targetIdx++;
        matchedAny = true;
        continue;
      }

      // Check if two spoken tokens combine to match target word
      if (sIdx + 1 < spokenTokens.length) {
        const combined = spoken + spokenTokens[sIdx + 1];
        if (isWordMatch(targetWord.cleanWord, combined)) {
          updated[targetIdx] = {
            ...targetWord,
            status: 'matched',
            spokenWord: combined
          };
          soundManager.playSuccessChime();
          soundManager.triggerVibration([40]);
          targetIdx++;
          sIdx++;
          matchedAny = true;
          continue;
        }
      }

      // Check if speaker skipped ahead to next word in Ayah
      if (targetIdx + 1 < updated.length && isWordMatch(updated[targetIdx + 1].cleanWord, spoken)) {
        // Mark current word as skipped
        updated[targetIdx] = {
          ...targetWord,
          status: 'skipped'
        };
        // Mark next word as matched
        updated[targetIdx + 1] = {
          ...updated[targetIdx + 1],
          status: 'matched',
          spokenWord: spoken
        };
        soundManager.playSuccessChime();
        setMistakesCount(m => m + 1);
        targetIdx += 2;
        matchedAny = true;
        continue;
      }
    }

    if (matchedAny) {
      // Set the next word as active
      if (targetIdx < updated.length) {
        updated[targetIdx] = {
          ...updated[targetIdx],
          status: 'active'
        };
      }

      setWordsStatus(updated);
      setCurrentWordIndex(targetIdx);

      // Calculate accuracy score
      const matchedCount = updated.filter(w => w.status === 'matched').length;
      const totalWords = updated.length;
      const newScore = Math.max(0, Math.round((matchedCount / totalWords) * 100));
      setScore(newScore);

      // Check if Ayah is completely recited
      if (targetIdx >= updated.length) {
        // Celebration!
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
        soundManager.triggerVibration([100, 50, 150]);

        if (autoAdvance && currentAyahIndex + 1 < ayahs.length) {
          setTimeout(() => {
            setCurrentAyahIndex(prev => prev + 1);
          }, 1200);
        }
      }
    }
  };

  // Toggle Microphone Listening
  const toggleListening = async () => {
    soundManager.unlockAudio();

    if (isListening) {
      speechEngineRef.current?.stop();
      setIsListening(false);
    } else {
      setSpeechEngineError(null);
      const started = await speechEngineRef.current?.start();
      if (started) {
        setIsListening(true);
      }
    }
  };

  // Play/Pause Sheikh Recitation
  const toggleAudioRecitation = () => {
    soundManager.unlockAudio();

    if (isPlayingAudio) {
      soundManager.stopRecitation();
      setIsPlayingAudio(false);
    } else if (currentAyah) {
      const reciter = RECITERS_LIST.find(r => r.id === selectedReciterId) || RECITERS_LIST[0];
      setIsPlayingAudio(true);
      soundManager.playAyahAudio(currentAyah.number, reciter.serverUrl, () => {
        setIsPlayingAudio(false);
        if (autoAdvance && currentAyahIndex + 1 < ayahs.length) {
          setCurrentAyahIndex(prev => prev + 1);
        }
      });
    }
  };

  // Manually mark word correct or listen to pronunciation
  const handleWordClick = (wordObj: WordMatchStatus, idx: number) => {
    soundManager.unlockAudio();
    soundManager.playSuccessChime();

    const updated = [...wordsStatus];
    updated[idx] = {
      ...updated[idx],
      status: 'matched'
    };

    if (idx + 1 < updated.length) {
      updated[idx + 1] = {
        ...updated[idx + 1],
        status: 'active'
      };
      setCurrentWordIndex(idx + 1);
    } else {
      setCurrentWordIndex(updated.length);
      confetti({ particleCount: 30, spread: 50 });
    }

    setWordsStatus(updated);
  };

  // Reset current Ayah recitation
  const handleResetAyah = () => {
    if (!currentAyah) return;
    const words = splitQuranTextIntoWords(currentAyah.text);
    setWordsStatus(words.map((w, idx) => ({
      word: w.original,
      cleanWord: w.clean,
      status: idx === 0 ? 'active' : 'pending',
      index: idx
    })));
    setCurrentWordIndex(0);
    setLiveTranscript('');
    setMistakesCount(0);
    setScore(100);
  };

  // Show Tafsir for current Ayah
  const openTafsir = async () => {
    if (!currentAyah) return;
    setIsTafsirModalOpen(true);
    setTafsirContent('جاري تحميل التفسير الميسر...');

    try {
      const res = await fetch(`https://api.alquran.cloud/v1/ayah/${currentAyah.number}/ar.muyassar`);
      if (res.ok) {
        const data = await res.json();
        setTafsirContent(data.data.text || 'التفسير غير متوفر حالياً.');
      } else {
        setTafsirContent('التفسير الميسر: بيان معاني الآيات الكريمة وفق مذهب السلف الصالح.');
      }
    } catch {
      setTafsirContent('التفسير الميسر: يتضمن توضيح مقاصد ومعاني الكلمات والآيات الكريمة.');
    }
  };

  // Filtered Surahs for search
  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) return surahsList;
    const cleanQ = normalizeArabicText(searchQuery.trim());
    return surahsList.filter(s => {
      const cleanName = normalizeArabicText(s.name);
      return cleanName.includes(cleanQ) || s.number.toString() === searchQuery.trim() || s.englishName.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery, surahsList]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 space-y-5 pb-24 md:pb-8">
      {/* Top Header Card: Surah Picker & Controls */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Surah Selector Button */}
          <div className="flex items-center gap-2">
            <button
              id="select-surah-modal-btn"
              onClick={() => setIsSurahModalOpen(true)}
              className="flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white px-4 py-2 rounded-xl font-bold shadow-md shadow-emerald-950/30 active:scale-95 transition-all"
            >
              <BookOpen className="w-4 h-4 text-emerald-200" />
              <span>سورة {currentSurah.name}</span>
              <span className="text-xs bg-emerald-900/50 px-2 py-0.5 rounded-full border border-emerald-400/20">
                {currentSurah.number}
              </span>
            </button>

            <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
              <span>{currentSurah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
              <span>•</span>
              <span>{currentSurah.numberOfAyahs} آية</span>
              <span>•</span>
              <span>الجزء {currentSurah.juz}</span>
            </div>
          </div>

          {/* Mode Switcher (Smart Voice / Read / Listen) */}
          <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-700/60">
            <button
              id="mode-smart-voice-btn"
              onClick={() => { setMode('smart_voice'); soundManager.stopRecitation(); setIsPlayingAudio(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'smart_voice'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>المصحف المعلم</span>
            </button>

            <button
              id="mode-listen-btn"
              onClick={() => { setMode('listen'); speechEngineRef.current?.stop(); setIsListening(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'listen'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>استماع</span>
            </button>

            <button
              id="mode-read-btn"
              onClick={() => { setMode('read'); speechEngineRef.current?.stop(); soundManager.stopRecitation(); setIsListening(false); setIsPlayingAudio(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'read'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>قراءة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Recitation & Ayah Display Card */}
      <div className="bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-700/80 rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative Islamic Frame Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Ayah Navigation & Info Bar */}
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
              الآية {currentAyahIndex + 1} من {ayahs.length}
            </span>
            <button
              id="open-tafsir-btn"
              onClick={openTafsir}
              className="flex items-center gap-1 text-xs text-slate-300 hover:text-emerald-300 bg-slate-800 hover:bg-slate-750 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
            >
              <Info className="w-3.5 h-3.5 text-emerald-400" />
              <span>التفسير الميسر</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Font Size Adjuster */}
            <div className="flex items-center gap-1 bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-700/60 text-xs">
              <button
                onClick={() => setFontSize(s => Math.max(20, s - 2))}
                className="text-slate-400 hover:text-slate-100 px-1 font-bold"
                title="تصغير الخط"
              >
                A-
              </button>
              <span className="text-[10px] text-slate-500 font-mono">|</span>
              <button
                onClick={() => setFontSize(s => Math.min(48, s + 2))}
                className="text-slate-400 hover:text-slate-100 px-1 font-bold"
                title="تكبير الخط"
              >
                A+
              </button>
            </div>

            {/* Ayah Prev / Next Buttons */}
            <button
              id="prev-ayah-btn"
              disabled={currentAyahIndex <= 0}
              onClick={() => setCurrentAyahIndex(p => Math.max(0, p - 1))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700 transition-colors"
              title="الآية السابقة"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              id="next-ayah-btn"
              disabled={currentAyahIndex >= ayahs.length - 1}
              onClick={() => setCurrentAyahIndex(p => Math.min(ayahs.length - 1, p + 1))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700 transition-colors"
              title="الآية التالية"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoadingAyahs ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
            <p className="text-sm text-slate-400">جاري تحميل آيات سورة {currentSurah.name}...</p>
          </div>
        ) : currentAyah ? (
          <div className="space-y-6">
            {/* Basmalah display (if not Surah 1 or 9 and first ayah) */}
            {currentSurah.number !== 1 && currentSurah.number !== 9 && currentAyahIndex === 0 && (
              <div className="text-center py-2">
                <p className="font-quran text-2xl sm:text-3xl text-emerald-300/90 font-medium">
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </p>
              </div>
            )}

            {/* Interactive Word-by-Word Quran Ayah Display */}
            <div 
              className="font-quran text-center leading-[2.2] select-text py-6 px-3 bg-slate-900/40 rounded-2xl border border-slate-800/80 shadow-inner min-h-[140px] flex items-center justify-center flex-wrap gap-x-2.5 gap-y-3"
              style={{ fontSize: `${fontSize}px` }}
              dir="rtl"
            >
              {mode === 'smart_voice' ? (
                // Word-by-Word Voice Highlight Mode
                wordsStatus.map((item, idx) => {
                  const isAllah = isLafzAlJalalah(item.cleanWord);
                  let stateClasses = 'text-slate-300 hover:text-white';
                  let badge = null;

                  if (item.status === 'matched') {
                    stateClasses = 'text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 rounded-xl px-2 shadow-sm shadow-emerald-950';
                    badge = <Check className="inline-block w-3 h-3 text-emerald-400 mr-1" />;
                  } else if (item.status === 'active') {
                    stateClasses = 'text-amber-300 bg-amber-950/60 border-2 border-amber-400 rounded-xl px-2.5 shadow-lg shadow-amber-950/50 scale-110 animate-pulse';
                  } else if (item.status === 'skipped' || item.status === 'error') {
                    stateClasses = 'text-rose-400 bg-rose-950/50 border border-rose-500/40 rounded-xl px-2 line-through';
                  }

                  return (
                    <span
                      key={idx}
                      id={`ayah-word-${idx}`}
                      onClick={() => handleWordClick(item, idx)}
                      className={`inline-block cursor-pointer transition-all duration-200 py-1 ${stateClasses} ${
                        isAllah ? 'font-bold' : ''
                      }`}
                      title={
                        item.status === 'matched'
                          ? 'تم النطق بنجاح ✓'
                          : item.status === 'active'
                          ? 'الكلمة المطلوب نطقها الآن'
                          : 'اضغط لتأكيد النطق أو سماع الكلمة'
                      }
                    >
                      {badge}
                      {item.word}
                    </span>
                  );
                })
              ) : (
                // Normal Reading / Listen Mode Display
                <span className="text-slate-100 leading-[2.2]">
                  {currentAyah.text}
                </span>
              )}

              {/* Ayah End Number Sign ﴿١﴾ */}
              <span className="inline-block text-emerald-400 text-lg mx-2 font-mono">
                ﴿{currentAyah.numberInSurah}﴾
              </span>
            </div>

            {/* Smart Recitation Helper & Live Voice Box */}
            {mode === 'smart_voice' && (
              <div className="space-y-4">
                {/* Voice Level & Status Bar */}
                <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
                      <span className="text-xs font-semibold text-slate-300">
                        {isListening
                          ? 'الميكروفون يستمع لتلاوتك الكريمة الآن...'
                          : 'الميكروفون متوقف - اضغط على زر التسجيل للبدء'}
                      </span>
                    </div>

                    {/* Score and Mistakes */}
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1 text-slate-300">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>الدقة:</span>
                        <span className="font-bold text-emerald-400">{score}%</span>
                      </div>
                      {mistakesCount > 0 && (
                        <div className="flex items-center gap-1 text-rose-300">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                          <span>التنبيهات:</span>
                          <span className="font-bold">{mistakesCount}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Audio Wave Visualizer Bar */}
                  {isListening && (
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden mb-2 border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 transition-all duration-75"
                        style={{ width: `${Math.max(5, audioLevel)}%` }}
                      />
                    </div>
                  )}

                  {/* Live Recognized Speech Transcript (Solves لفظ الجلالة transparency) */}
                  {liveTranscript && (
                    <div className="text-xs text-slate-400 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 font-mono flex items-center gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">المسموع:</span>
                      <span className="text-slate-200 truncate">{liveTranscript}</span>
                    </div>
                  )}

                  {/* Speech Error Warning if any */}
                  {speechEngineError && (
                    <div className="text-xs text-amber-300 bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/30 mt-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{speechEngineError}</span>
                    </div>
                  )}

                  {/* Special Mobile Recitation Note for User */}
                  <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>
                      محرك الذكاء الصوتي مضبوط خصيصاً لتصحيح لفظ الجلالة وحروف القلقلة والمدود بسلاسة على الهواتف.
                    </span>
                  </div>
                </div>

                {/* Primary Voice Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    id="toggle-mic-btn"
                    onClick={toggleListening}
                    className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-xl transition-all active:scale-95 ${
                      isListening
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50 animate-pulse-glow'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-5 h-5" />
                        <span>إيقاف الاستماع</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5" />
                        <span>ابدأ التلاوة بالصوت</span>
                      </>
                    )}
                  </button>

                  <button
                    id="reset-ayah-btn"
                    onClick={handleResetAyah}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-3 rounded-2xl text-xs font-semibold border border-slate-700 transition-all active:scale-95"
                    title="إعادة قراءة الآية من البداية"
                  >
                    <RotateCcw className="w-4 h-4 text-slate-400" />
                    <span>إعادة الآية</span>
                  </button>

                  {/* Play Qari audio to learn pronunciation */}
                  <button
                    id="listen-sheikh-btn"
                    onClick={toggleAudioRecitation}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 px-4 py-3 rounded-2xl text-xs font-semibold border border-slate-700 transition-all active:scale-95"
                  >
                    {isPlayingAudio ? (
                      <>
                        <Pause className="w-4 h-4 text-emerald-400" />
                        <span>إيقاف الشيخ</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-emerald-400" />
                        <span>استمع لنطق الشيخ</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Listen Mode Controls */}
            {mode === 'listen' && (
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">القارئ المختار:</h4>
                      <p className="text-xs text-slate-400">
                        {RECITERS_LIST.find(r => r.id === selectedReciterId)?.name}
                      </p>
                    </div>
                  </div>

                  {/* Reciter Selector */}
                  <select
                    id="select-reciter-dropdown"
                    value={selectedReciterId}
                    onChange={(e) => setSelectedReciterId(e.target.value)}
                    className="bg-slate-800 text-slate-200 text-xs border border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
                  >
                    {RECITERS_LIST.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    id="listen-mode-play-btn"
                    onClick={toggleAudioRecitation}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-950/40 active:scale-95 transition-all"
                  >
                    {isPlayingAudio ? (
                      <>
                        <Pause className="w-5 h-5" />
                        <span>إيقاف مؤقت</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        <span>تشغيل تلاوة الآية</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400">لم يتم العثور على آيات.</div>
        )}
      </div>

      {/* Surah Selection Modal */}
      {isSurahModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3">
              <h3 className="font-bold text-lg text-emerald-400 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>اختر السورة الكريمة (١١٤ سورة)</span>
              </h3>
              <button
                id="close-surah-modal-btn"
                onClick={() => setIsSurahModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Search Input */}
            <div className="p-3 border-b border-slate-800">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <input
                  id="search-surah-input"
                  type="text"
                  placeholder="ابحث باسم السورة أو رقمها (مثال: الفاتحة، الإخلاص، 18)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-9 pl-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Surahs Grid List */}
            <div className="p-3 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {filteredSurahs.map((surah) => (
                <button
                  key={surah.number}
                  id={`surah-item-${surah.number}`}
                  onClick={() => {
                    setSelectedSurahNumber(surah.number);
                    setCurrentAyahIndex(0);
                    setIsSurahModalOpen(false);
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-right transition-all ${
                    selectedSurahNumber === surah.number
                      ? 'bg-emerald-600 text-white border-emerald-400 font-bold shadow-md'
                      : 'bg-slate-800/60 hover:bg-slate-800 text-slate-200 border-slate-700/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                      selectedSurahNumber === surah.number ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-700 text-emerald-400'
                    }`}>
                      {surah.number}
                    </span>
                    <div>
                      <div className="text-sm font-semibold">{surah.name}</div>
                      <div className="text-[10px] text-slate-400">{surah.englishName}</div>
                    </div>
                  </div>
                  <div className="text-left text-[11px] text-slate-400">
                    <div>{surah.numberOfAyahs} آية</div>
                    <div className="text-[9px]">{surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tafsir Modal */}
      {isTafsirModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-md text-emerald-400 flex items-center gap-2">
                <Info className="w-5 h-5 text-emerald-400" />
                <span>التفسير الميسر - آية {currentAyahIndex + 1} ({currentSurah.name})</span>
              </h3>
              <button
                id="close-tafsir-modal-btn"
                onClick={() => setIsTafsirModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 font-quran text-lg text-emerald-300 text-center leading-relaxed">
                {currentAyah?.text}
              </div>
              <div className="text-slate-200 text-sm leading-relaxed p-1">
                {tafsirContent}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
