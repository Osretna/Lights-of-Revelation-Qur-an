import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import {
  SurahMeta,
  Ayah,
  Reciter,
  Bookmark,
  KhatmahPlan,
  ReadingProgress,
  AppSettings,
  PrayerTimeData
} from '../types/quran';
import { SURAH_LIST } from '../data/surahList';
import { RECITERS_LIST } from '../data/recitersData';
import { calculatePrayerTimes, getNextPrayer, NextPrayerInfo, POPULAR_CITIES } from '../utils/prayerCalculator';
import { getSurahDetail } from '../data/quranSampleData';

export type AppTab =
  | 'home'
  | 'quran'
  | 'audio'
  | 'tafsir'
  | 'search'
  | 'azkar'
  | 'prayer'
  | 'qibla'
  | 'khatmah'
  | 'downloads'
  | 'profile'
  | 'admin'
  | 'settings';

interface AudioState {
  isPlaying: boolean;
  surahNumber: number;
  ayahNumber: number;
  reciter: Reciter;
  currentTime: number;
  duration: number;
  playbackSpeed: number;
  repeatMode: 'none' | 'ayah' | 'surah';
  audioElement: HTMLAudioElement | null;
}

interface QuranContextType {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  showSplash: boolean;
  setShowSplash: (show: boolean) => void;
  
  // Quran reader state
  selectedSurahNum: number;
  setSelectedSurahNum: (num: number) => void;
  selectedAyahNum: number;
  setSelectedAyahNum: (num: number) => void;
  readingProgress: ReadingProgress;
  saveReadingProgress: (surahNum: number, ayahNum: number, page: number, juz: number) => void;

  // Bookmarks
  bookmarks: Bookmark[];
  addBookmark: (b: Omit<Bookmark, 'id' | 'timestamp'>) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (surahNum: number, ayahNum: number) => boolean;

  // Khatmahs
  khatmahs: KhatmahPlan[];
  activeKhatmah: KhatmahPlan | null;
  createKhatmah: (plan: Omit<KhatmahPlan, 'id' | 'createdAt' | 'completedPages' | 'completedJuz' | 'status'>) => void;
  togglePageCompleted: (khatmahId: string, pageNum: number) => void;
  toggleJuzCompleted: (khatmahId: string, juzNum: number) => void;
  deleteKhatmah: (id: string) => void;

  // Audio Player
  audioState: AudioState;
  playSurahAudio: (surahNum: number, reciterId?: string) => void;
  playAyahAudio: (surahNum: number, ayahNum: number, reciterId?: string) => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
  togglePlayPause: () => void;
  setAudioSpeed: (speed: number) => void;
  setAudioRepeatMode: (mode: 'none' | 'ayah' | 'surah') => void;
  setAudioReciter: (reciter: Reciter) => void;
  seekAudioTo: (seconds: number) => void;
  skipNextAyah: () => void;
  skipPrevAyah: () => void;

  // Prayer & Qibla
  prayerTimes: PrayerTimeData;
  nextPrayer: NextPrayerInfo;
  refreshLocation: () => void;

  // Settings
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;

  // Ayah Action / Tafsir Modal
  selectedAyahDetail: { surahNum: number; ayah: Ayah; surahMeta: SurahMeta } | null;
  setSelectedAyahDetail: (detail: { surahNum: number; ayah: Ayah; surahMeta: SurahMeta } | null) => void;

  // Toast notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'emerald',
  fontFamily: 'Amiri Quran',
  fontSize: 26,
  showTashkeel: true,
  autoScrollAyah: true,
  selectedReciterId: 'abdul_basit_murattal',
  playbackSpeed: 1,
  repeatMode: 'none',
  prayerCalcMethod: 'Makkah',
  juristicMethod: 'shafii',
  adhanNotification: true,
  adhanMuadhin: 'makkah',
  locationCity: 'مكة المكرمة',
  lat: 21.4225,
  lng: 39.8262,
  autoDetectLocation: false,
  showSponsorship: true
};

const QuranContext = createContext<QuranContextType | undefined>(undefined);

export const QuranProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    // Show splash once per session
    const seen = sessionStorage.getItem('anwar_splash_seen');
    return !seen;
  });

  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [selectedSurahNum, setSelectedSurahNum] = useState<number>(1);
  const [selectedAyahNum, setSelectedAyahNum] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedAyahDetail, setSelectedAyahDetail] = useState<{ surahNum: number; ayah: Ayah; surahMeta: SurahMeta } | null>(null);

  // Load Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('anwar_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('anwar_settings', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Load Reading Progress
  const [readingProgress, setReadingProgress] = useState<ReadingProgress>(() => {
    try {
      const saved = localStorage.getItem('anwar_reading_progress');
      return saved
        ? JSON.parse(saved)
        : {
            lastSurahNumber: 1,
            lastSurahName: 'الفاتحة',
            lastAyahNumber: 1,
            lastPageNumber: 1,
            lastJuzNumber: 1,
            lastUpdated: Date.now()
          };
    } catch {
      return {
        lastSurahNumber: 1,
        lastSurahName: 'الفاتحة',
        lastAyahNumber: 1,
        lastPageNumber: 1,
        lastJuzNumber: 1,
        lastUpdated: Date.now()
      };
    }
  });

  const saveReadingProgress = (surahNum: number, ayahNum: number, page: number, juz: number) => {
    const sMeta = SURAH_LIST.find(s => s.number === surahNum);
    const updated: ReadingProgress = {
      lastSurahNumber: surahNum,
      lastSurahName: sMeta ? sMeta.name : 'الفاتحة',
      lastAyahNumber: ayahNum,
      lastPageNumber: page,
      lastJuzNumber: juz,
      lastUpdated: Date.now()
    };
    setReadingProgress(updated);
    try {
      localStorage.setItem('anwar_reading_progress', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Load Bookmarks
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const saved = localStorage.getItem('anwar_bookmarks');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'bm_1',
              surahNumber: 1,
              surahName: 'الفاتحة',
              ayahNumberInSurah: 1,
              ayahGlobalNumber: 1,
              page: 1,
              juz: 1,
              textPreview: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
              timestamp: Date.now()
            },
            {
              id: 'bm_2',
              surahNumber: 67,
              surahName: 'الملك',
              ayahNumberInSurah: 1,
              ayahGlobalNumber: 5242,
              page: 562,
              juz: 29,
              textPreview: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
              timestamp: Date.now() - 86400000
            }
          ];
    } catch {
      return [];
    }
  });

  const addBookmark = (b: Omit<Bookmark, 'id' | 'timestamp'>) => {
    const newBm: Bookmark = {
      ...b,
      id: 'bm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: Date.now()
    };
    setBookmarks(prev => {
      const updated = [newBm, ...prev.filter(item => !(item.surahNumber === b.surahNumber && item.ayahNumberInSurah === b.ayahNumberInSurah))];
      try {
        localStorage.setItem('anwar_bookmarks', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    showToast(`تمت إضافة الآية ${b.ayahNumberInSurah} من سورة ${b.surahName} إلى الإشارات المرجعية ⭐`);
  };

  const removeBookmark = (id: string) => {
    setBookmarks(prev => {
      const updated = prev.filter(b => b.id !== id);
      try {
        localStorage.setItem('anwar_bookmarks', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    showToast('تمت إزالة العلامة المرجعية');
  };

  const isBookmarked = (surahNum: number, ayahNum: number) => {
    return bookmarks.some(b => b.surahNumber === surahNum && b.ayahNumberInSurah === ayahNum);
  };

  // Khatmahs
  const [khatmahs, setKhatmahs] = useState<KhatmahPlan[]>(() => {
    try {
      const saved = localStorage.getItem('anwar_khatmahs');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'khatmah_demo_1',
              title: 'ختمة رمضان المبارك',
              startDate: new Date().toISOString().split('T')[0],
              targetDays: 30,
              dailyPagesTarget: 20,
              completedPages: Array.from({ length: 42 }, (_, i) => i + 1), // 42 pages completed
              completedJuz: [1, 2],
              status: 'active',
              createdAt: Date.now() - 3600 * 24 * 2 * 1000
            }
          ];
    } catch {
      return [];
    }
  });

  const activeKhatmah = useMemo(() => {
    return khatmahs.find(k => k.status === 'active') || khatmahs[0] || null;
  }, [khatmahs]);

  const createKhatmah = (plan: Omit<KhatmahPlan, 'id' | 'createdAt' | 'completedPages' | 'completedJuz' | 'status'>) => {
    const newKhatmah: KhatmahPlan = {
      ...plan,
      id: 'khatmah_' + Date.now(),
      completedPages: [],
      completedJuz: [],
      status: 'active',
      createdAt: Date.now()
    };
    setKhatmahs(prev => {
      const updated = [newKhatmah, ...prev];
      try {
        localStorage.setItem('anwar_khatmahs', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    showToast(`تم إنشاء "${plan.title}" بنجاح! وفقك الله لختم كتابه.`);
  };

  const togglePageCompleted = (khatmahId: string, pageNum: number) => {
    setKhatmahs(prev => {
      const updated = prev.map(k => {
        if (k.id !== khatmahId) return k;
        const exists = k.completedPages.includes(pageNum);
        const newPages = exists ? k.completedPages.filter(p => p !== pageNum) : [...k.completedPages, pageNum];
        const isComplete = newPages.length >= 604;
        return {
          ...k,
          completedPages: newPages,
          status: isComplete ? 'completed' : k.status
        };
      });
      try {
        localStorage.setItem('anwar_khatmahs', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const toggleJuzCompleted = (khatmahId: string, juzNum: number) => {
    setKhatmahs(prev => {
      const updated = prev.map(k => {
        if (k.id !== khatmahId) return k;
        const exists = k.completedJuz.includes(juzNum);
        const newJuz = exists ? k.completedJuz.filter(j => j !== juzNum) : [...k.completedJuz, juzNum];
        return {
          ...k,
          completedJuz: newJuz
        };
      });
      try {
        localStorage.setItem('anwar_khatmahs', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const deleteKhatmah = (id: string) => {
    setKhatmahs(prev => {
      const updated = prev.filter(k => k.id !== id);
      try {
        localStorage.setItem('anwar_khatmahs', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    showToast('تم حذف الختمة');
  };

  // Audio State & HTML5 Audio element
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioState, setAudioState] = useState<AudioState>(() => {
    const initialReciter = RECITERS_LIST.find(r => r.id === DEFAULT_SETTINGS.selectedReciterId) || RECITERS_LIST[0];
    return {
      isPlaying: false,
      surahNumber: 1,
      ayahNumber: 1,
      reciter: initialReciter,
      currentTime: 0,
      duration: 0,
      playbackSpeed: 1,
      repeatMode: 'none',
      audioElement: null
    };
  });

  // Initialize Audio Element
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const onTimeUpdate = () => {
      setAudioState(prev => ({
        ...prev,
        currentTime: audio.currentTime,
        duration: audio.duration || prev.duration
      }));
    };

    const onLoadedMetadata = () => {
      setAudioState(prev => ({
        ...prev,
        duration: audio.duration || 0
      }));
    };

    const onPlay = () => setAudioState(prev => ({ ...prev, isPlaying: true }));
    const onPause = () => setAudioState(prev => ({ ...prev, isPlaying: false }));
    
    const onEnded = () => {
      setAudioState(current => {
        if (current.repeatMode === 'ayah') {
          audio.currentTime = 0;
          audio.play().catch(() => {});
          return current;
        } else {
          // Play next Ayah in Surah
          const sMeta = SURAH_LIST.find(s => s.number === current.surahNumber);
          if (sMeta && current.ayahNumber < sMeta.numberOfAyahs) {
            const nextAyah = current.ayahNumber + 1;
            const nextUrl = current.reciter.ayahAudioUrlPattern(current.surahNumber, nextAyah);
            audio.src = nextUrl;
            audio.play().catch(() => {});
            return {
              ...current,
              ayahNumber: nextAyah,
              isPlaying: true
            };
          } else if (current.repeatMode === 'surah') {
            const firstUrl = current.reciter.ayahAudioUrlPattern(current.surahNumber, 1);
            audio.src = firstUrl;
            audio.play().catch(() => {});
            return {
              ...current,
              ayahNumber: 1,
              isPlaying: true
            };
          } else {
            return {
              ...current,
              isPlaying: false,
              currentTime: 0
            };
          }
        }
      });
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const playSurahAudio = (surahNum: number, reciterId?: string) => {
    const targetReciter = reciterId ? (RECITERS_LIST.find(r => r.id === reciterId) || audioState.reciter) : audioState.reciter;
    const url = targetReciter.surahAudioUrlPattern(surahNum);

    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.playbackRate = audioState.playbackSpeed;
      audioRef.current.play().catch(e => console.warn('Audio playback error', e));
    }

    setAudioState(prev => ({
      ...prev,
      isPlaying: true,
      surahNumber: surahNum,
      ayahNumber: 1,
      reciter: targetReciter,
      currentTime: 0
    }));

    const sMeta = SURAH_LIST.find(s => s.number === surahNum);
    showToast(`جاري تشغيل سورة ${sMeta?.name || surahNum} بصوت ${targetReciter.name} 🎧`);
  };

  const playAyahAudio = (surahNum: number, ayahNum: number, reciterId?: string) => {
    const targetReciter = reciterId ? (RECITERS_LIST.find(r => r.id === reciterId) || audioState.reciter) : audioState.reciter;
    const url = targetReciter.ayahAudioUrlPattern(surahNum, ayahNum);

    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.playbackRate = audioState.playbackSpeed;
      audioRef.current.play().catch(e => console.warn('Audio playback error', e));
    }

    setAudioState(prev => ({
      ...prev,
      isPlaying: true,
      surahNumber: surahNum,
      ayahNumber: ayahNum,
      reciter: targetReciter,
      currentTime: 0
    }));
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const resumeAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };

  const togglePlayPause = () => {
    if (audioState.isPlaying) {
      pauseAudio();
    } else {
      if (!audioRef.current?.src || audioRef.current.src === '') {
        playSurahAudio(selectedSurahNum);
      } else {
        resumeAudio();
      }
    }
  };

  const setAudioSpeed = (speed: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
    setAudioState(prev => ({ ...prev, playbackSpeed: speed }));
  };

  const setAudioRepeatMode = (mode: 'none' | 'ayah' | 'surah') => {
    setAudioState(prev => ({ ...prev, repeatMode: mode }));
    showToast(`تم ضبط وضع التكرار: ${mode === 'none' ? 'بدون تكرار' : mode === 'ayah' ? 'تكرار الآية' : 'تكرار السورة'}`);
  };

  const setAudioReciter = (reciter: Reciter) => {
    setAudioState(prev => ({ ...prev, reciter }));
    updateSettings({ selectedReciterId: reciter.id });
    if (audioState.isPlaying) {
      playAyahAudio(audioState.surahNumber, audioState.ayahNumber, reciter.id);
    }
  };

  const seekAudioTo = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
    }
  };

  const skipNextAyah = () => {
    const sMeta = SURAH_LIST.find(s => s.number === audioState.surahNumber);
    if (sMeta && audioState.ayahNumber < sMeta.numberOfAyahs) {
      playAyahAudio(audioState.surahNumber, audioState.ayahNumber + 1);
    } else if (audioState.surahNumber < 114) {
      playAyahAudio(audioState.surahNumber + 1, 1);
    }
  };

  const skipPrevAyah = () => {
    if (audioState.ayahNumber > 1) {
      playAyahAudio(audioState.surahNumber, audioState.ayahNumber - 1);
    } else if (audioState.surahNumber > 1) {
      const prevSurahMeta = SURAH_LIST.find(s => s.number === audioState.surahNumber - 1);
      playAyahAudio(audioState.surahNumber - 1, prevSurahMeta?.numberOfAyahs || 1);
    }
  };

  // Prayer Calculation state
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimeData>(() => {
    return calculatePrayerTimes(
      new Date(),
      settings.lat,
      settings.lng,
      settings.prayerCalcMethod,
      settings.juristicMethod
    );
  });

  const [nextPrayer, setNextPrayer] = useState<NextPrayerInfo>(() => {
    return getNextPrayer(prayerTimes);
  });

  // Live prayer countdown ticker
  useEffect(() => {
    const interval = setInterval(() => {
      const calculated = calculatePrayerTimes(
        new Date(),
        settings.lat,
        settings.lng,
        settings.prayerCalcMethod,
        settings.juristicMethod
      );
      setPrayerTimes(calculated);
      setNextPrayer(getNextPrayer(calculated));
    }, 1000);
    return () => clearInterval(interval);
  }, [settings.lat, settings.lng, settings.prayerCalcMethod, settings.juristicMethod]);

  const refreshLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          // Find nearest city or generic name
          updateSettings({
            lat: latitude,
            lng: longitude,
            locationCity: 'الموقع الحالي (GPS)',
            autoDetectLocation: true
          });
          showToast('تم تحديد الموقع الجغرافي وحساب مواقيت الصلاة بدقة 🕌');
        },
        () => {
          showToast('تعذر الوصول للموقع تلقائياً، يمكنك اختيار المدينة يدوياً.');
        }
      );
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // Automatically fetch initial reading progress surah
  useEffect(() => {
    getSurahDetail(readingProgress.lastSurahNumber).catch(() => {});
  }, [readingProgress.lastSurahNumber]);

  return (
    <QuranContext.Provider
      value={{
        activeTab,
        setActiveTab,
        showSplash,
        setShowSplash: (show: boolean) => {
          setShowSplash(show);
          sessionStorage.setItem('anwar_splash_seen', 'true');
        },
        selectedSurahNum,
        setSelectedSurahNum,
        selectedAyahNum,
        setSelectedAyahNum,
        readingProgress,
        saveReadingProgress,
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
        khatmahs,
        activeKhatmah,
        createKhatmah,
        togglePageCompleted,
        toggleJuzCompleted,
        deleteKhatmah,
        audioState,
        playSurahAudio,
        playAyahAudio,
        pauseAudio,
        resumeAudio,
        togglePlayPause,
        setAudioSpeed,
        setAudioRepeatMode,
        setAudioReciter,
        seekAudioTo,
        skipNextAyah,
        skipPrevAyah,
        prayerTimes,
        nextPrayer,
        refreshLocation,
        settings,
        updateSettings,
        selectedAyahDetail,
        setSelectedAyahDetail,
        toastMessage,
        showToast
      }}
    >
      {children}
    </QuranContext.Provider>
  );
};

export const useQuran = () => {
  const context = useContext(QuranContext);
  if (!context) {
    throw new Error('useQuran must be used within a QuranProvider');
  }
  return context;
};
