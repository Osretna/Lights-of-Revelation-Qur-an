import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import {
  SurahMeta,
  Ayah,
  Reciter,
  Bookmark,
  KhatmahPlan,
  ReadingProgress,
  AppSettings,
  PrayerTimeData,
  UserStats
} from '../types/quran';
import { SURAH_LIST } from '../data/surahList';
import { RECITERS_LIST } from '../data/recitersData';
import {
  calculatePrayerTimes,
  getNextPrayer,
  NextPrayerInfo,
  POPULAR_CITIES,
  reverseGeocode,
  fetchLiveAladhanTimings
} from '../utils/prayerCalculator';
import { getSurahDetail } from '../data/quranSampleData';
import { getOfflineSurahBlobUrl, isSurahSavedOffline } from '../utils/offlineAudioStorage';
import { playAdhanAudio, triggerPrayerNotification, playIslamicTone, unlockAudioSystem } from '../utils/adhanAudio';
import { soundManager } from '../utils/soundManager';

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

export interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
  surahNumber: number;
  ayahNumber: number;
  reciter: Reciter;
  currentTime: number;
  duration: number;
  playbackSpeed: number;
  repeatMode: 'none' | 'ayah' | 'surah';
  audioMode: 'ayah' | 'surah';
  playSingleAyahOnly?: boolean;
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
  createNewKhatmah: (title: string, targetDays: number) => void;
  markKhatmahPageComplete: (pageNum: number) => void;
  togglePageCompleted: (khatmahId: string, pageNum: number) => void;
  toggleJuzCompleted: (khatmahId: string, juzNum: number) => void;
  deleteKhatmah: (id: string) => void;

  // User Stats & Clean Counters
  userStats: UserStats;
  recordPageRead: (pageNum: number) => void;
  incrementTasbeehCount: () => void;
  recordCorrectionAttempt: (isSuccess: boolean) => void;
  resetAllCounters: () => void;

  // Offline Downloads
  downloadedReciters: Record<string, number>;
  addDownloadedReciter: (reciterId: string, sizeMB?: number) => void;
  removeDownloadedReciter: (reciterId: string) => void;
  clearAllDownloads: () => void;

  // Audio Player
  audioState: AudioState;
  playSurahAudio: (surahNum: number, reciterId?: string) => void;
  playSurahFullAudio: (surahNum: number, reciterId?: string) => void;
  playAyahAudio: (surahNum: number, ayahNum: number, reciterId?: string, singleAyahOnly?: boolean) => void;
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

  // Active Adhan Alert Modal
  activeAdhanAlert: { prayerName: string; cityName: string } | null;
  closeAdhanAlert: () => void;

  // Voice Recitation Correction Modal
  isVoiceCorrectionOpen: boolean;
  setIsVoiceCorrectionOpen: (open: boolean) => void;

  // Admin Authentication
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (auth: boolean) => void;
  verifyAdminPassword: (password: string) => boolean;
  logoutAdmin: () => void;

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
  timeFormat: '12h',
  prayerOffsets: {
    fajr: 0,
    sunrise: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0
  },
  adhanNotification: true,
  adhanReminderMinutes: 0,
  playAdhanAudioOnTime: true,
  adhanNotificationPrayers: {
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true
  },
  adhanMuadhin: 'makkah',
  locationCity: 'مكة المكرمة',
  lat: 21.4225,
  lng: 39.8262,
  autoDetectLocation: false,
  showSponsorship: true,
  // Google AdSense & Halal Ads Defaults
  adSenseEnabled: true,
  adSensePublisherId: 'ca-pub-6359877001554870',
  adSenseBannerSlot: '',
  adSenseInFeedSlot: '',
  adSenseNativeSlot: '',
  adSenseTestMode: false,
  halalAdFilterActive: true,
  showIslamicFallbackWhenNoAds: true
};

const DEFAULT_USER_STATS: UserStats = {
  pagesRead: [],
  totalPagesRead: 0,
  streakDays: 0,
  lastActiveDate: '',
  listeningSeconds: 0,
  completedKhatmahsCount: 0,
  tasbeehTotalCount: 0,
  correctionAttempts: 0,
  correctionSuccessCount: 0
};

const QuranContext = createContext<QuranContextType | undefined>(undefined);

export const QuranProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    const seen = sessionStorage.getItem('anwar_splash_seen');
    return !seen;
  });

  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [selectedSurahNum, setSelectedSurahNum] = useState<number>(1);
  const [selectedAyahNum, setSelectedAyahNum] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedAyahDetail, setSelectedAyahDetail] = useState<{ surahNum: number; ayah: Ayah; surahMeta: SurahMeta } | null>(null);
  const [isVoiceCorrectionOpen, setIsVoiceCorrectionOpen] = useState<boolean>(false);
  const [activeAdhanAlert, setActiveAdhanAlert] = useState<{ prayerName: string; cityName: string } | null>(null);

  const closeAdhanAlert = () => {
    setActiveAdhanAlert(null);
    soundManager.stopAdhan();
  };
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('anwar_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const verifyAdminPassword = (password: string): boolean => {
    if (password.trim() === 'admin1234') {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem('anwar_admin_auth', 'true');
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('anwar_admin_auth');
    } catch {
      // ignore
    }
    setActiveTab('home');
    showToast('تم تسجيل الخروج وقفل لوحة الإدارة 🔒');
  };

  // Load Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('anwar_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Unlock Web Audio engine on first user interaction for background Azan support
  useEffect(() => {
    const handleFirstGesture = () => {
      unlockAudioSystem();
    };
    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });
    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, []);

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

  // Clean Zeroed User Statistics
  const [userStats, setUserStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem('anwar_user_stats');
      return saved ? { ...DEFAULT_USER_STATS, ...JSON.parse(saved) } : DEFAULT_USER_STATS;
    } catch {
      return DEFAULT_USER_STATS;
    }
  });

  const saveStats = (stats: UserStats) => {
    setUserStats(stats);
    try {
      localStorage.setItem('anwar_user_stats', JSON.stringify(stats));
    } catch {
      // ignore
    }
  };

  const recordPageRead = (pageNum: number) => {
    setUserStats(prev => {
      const uniquePages = prev.pagesRead.includes(pageNum)
        ? prev.pagesRead
        : [...prev.pagesRead, pageNum];

      const todayStr = new Date().toISOString().split('T')[0];
      let streak = prev.streakDays;
      if (prev.lastActiveDate !== todayStr) {
        streak = prev.streakDays + 1;
      }

      const updated: UserStats = {
        ...prev,
        pagesRead: uniquePages,
        totalPagesRead: uniquePages.length,
        streakDays: Math.max(1, streak),
        lastActiveDate: todayStr
      };
      saveStats(updated);
      return updated;
    });
  };

  const incrementTasbeehCount = () => {
    setUserStats(prev => {
      const updated = { ...prev, tasbeehTotalCount: (prev.tasbeehTotalCount || 0) + 1 };
      saveStats(updated);
      return updated;
    });
  };

  const recordCorrectionAttempt = (isSuccess: boolean) => {
    setUserStats(prev => {
      const updated: UserStats = {
        ...prev,
        correctionAttempts: (prev.correctionAttempts || 0) + 1,
        correctionSuccessCount: (prev.correctionSuccessCount || 0) + (isSuccess ? 1 : 0)
      };
      saveStats(updated);
      return updated;
    });
  };

  // Offline Downloads State
  const [downloadedReciters, setDownloadedReciters] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('anwar_downloaded_reciters');
      return saved ? JSON.parse(saved) : {
        'ar.alafasy': 420,
        'ar.abdulbasitmurattal': 380
      };
    } catch {
      return {
        'ar.alafasy': 420,
        'ar.abdulbasitmurattal': 380
      };
    }
  });

  const addDownloadedReciter = (reciterId: string, sizeMB: number = 450) => {
    setDownloadedReciters(prev => {
      const updated = { ...prev, [reciterId]: sizeMB };
      try {
        localStorage.setItem('anwar_downloaded_reciters', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const removeDownloadedReciter = (reciterId: string) => {
    setDownloadedReciters(prev => {
      const updated = { ...prev };
      delete updated[reciterId];
      try {
        localStorage.setItem('anwar_downloaded_reciters', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const clearAllDownloads = () => {
    setDownloadedReciters({});
    try {
      localStorage.removeItem('anwar_downloaded_reciters');
    } catch {
      // ignore
    }
  };

  const resetAllCounters = () => {
    setUserStats(DEFAULT_USER_STATS);
    localStorage.removeItem('anwar_user_stats');
    localStorage.removeItem('anwar_khatmahs');
    setKhatmahs([]);
    showToast('تم تصفير كافة العدادات والإحصائيات بنجاح 🔄');
  };

  // Load Reading Progress - Starts fresh at Al-Fatihah, Page 1
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
    recordPageRead(page);
    try {
      localStorage.setItem('anwar_reading_progress', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Load Bookmarks - Clean empty array by default
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const saved = localStorage.getItem('anwar_bookmarks');
      return saved ? JSON.parse(saved) : [];
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

  // Khatmahs - Clean empty array by default (0% initial state)
  const [khatmahs, setKhatmahs] = useState<KhatmahPlan[]>(() => {
    try {
      const saved = localStorage.getItem('anwar_khatmahs');
      return saved ? JSON.parse(saved) : [];
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

  const createNewKhatmah = (title: string, targetDays: number) => {
    createKhatmah({
      title,
      targetDays,
      dailyPagesTarget: Math.ceil(604 / (targetDays || 30)),
      startDate: new Date().toISOString().split('T')[0]
    });
  };

  const markKhatmahPageComplete = (pageNum: number) => {
    if (!activeKhatmah) {
      // Create a default initial khatmah if none exists
      createKhatmah({
        title: 'ختمة القرآن الكريم',
        startDate: new Date().toISOString().split('T')[0],
        targetDays: 30,
        dailyPagesTarget: 20
      });
      return;
    }
    togglePageCompleted(activeKhatmah.id, pageNum);
  };

  const togglePageCompleted = (khatmahId: string, pageNum: number) => {
    setKhatmahs(prev => {
      const updated = prev.map(k => {
        if (k.id !== khatmahId) return k;
        const exists = k.completedPages.includes(pageNum);
        const newPages = exists ? k.completedPages.filter(p => p !== pageNum) : [...k.completedPages, pageNum];
        const isComplete = newPages.length >= 604;
        if (isComplete && k.status !== 'completed') {
          showToast('مبارك! تم ختم القرآن الكريم كاملاً 🎉 تقبل الله طاعتكم');
          setUserStats(s => ({ ...s, completedKhatmahsCount: s.completedKhatmahsCount + 1 }));
        }
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
  const fallbackUrlsRef = useRef<string[]>([]);
  const isPlayingRef = useRef<boolean>(false);

  const [audioState, setAudioState] = useState<AudioState>(() => {
    const initialReciter = RECITERS_LIST.find(r => r.id === DEFAULT_SETTINGS.selectedReciterId) || RECITERS_LIST[0];
    return {
      isPlaying: false,
      isLoading: false,
      surahNumber: 1,
      ayahNumber: 1,
      reciter: initialReciter,
      currentTime: 0,
      duration: 0,
      playbackSpeed: 1,
      repeatMode: 'none',
      audioMode: 'ayah',
      audioElement: null
    };
  });

  const startAudioPlayback = (urls: string[], speed: number) => {
    if (!audioRef.current || urls.length === 0) return;
    
    fallbackUrlsRef.current = urls.slice(1);
    setAudioState(prev => ({ ...prev, isLoading: true }));

    const audio = audioRef.current;
    audio.playbackRate = speed;
    audio.src = urls[0];
    audio.load();

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isPlayingRef.current = true;
          setAudioState(prev => ({ ...prev, isPlaying: true, isLoading: false }));
        })
        .catch(err => {
          console.warn('Audio play attempt error:', err);
          if (fallbackUrlsRef.current.length > 0) {
            const nextUrl = fallbackUrlsRef.current.shift()!;
            audio.src = nextUrl;
            audio.load();
            audio.play().catch(e => {
              console.warn('Fallback audio failed:', e);
              isPlayingRef.current = false;
              setAudioState(prev => ({ ...prev, isPlaying: false, isLoading: false }));
            });
          } else {
            isPlayingRef.current = false;
            setAudioState(prev => ({ ...prev, isPlaying: false, isLoading: false }));
          }
        });
    }
  };

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = 1.0;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setAudioState(prev => ({
        ...prev,
        currentTime: audio.currentTime,
        duration: audio.duration || 0
      }));
    };

    const handleLoadedMetadata = () => {
      setAudioState(prev => ({
        ...prev,
        duration: audio.duration || 0,
        isLoading: false
      }));
    };

    const handleEnded = () => {
      setAudioState(prev => {
        if (prev.playSingleAyahOnly) {
          // If explicitly requested to play a single ayah only (e.g., Voice Correction / pronunciation check)
          return { ...prev, isPlaying: false, currentTime: 0, playSingleAyahOnly: false };
        } else if (prev.repeatMode === 'ayah' && prev.audioMode === 'ayah') {
          playAyahAudio(prev.surahNumber, prev.ayahNumber, prev.reciter.id);
          return prev;
        } else if (prev.repeatMode === 'surah') {
          if (prev.audioMode === 'surah') {
            playSurahFullAudio(prev.surahNumber, prev.reciter.id);
          } else {
            playAyahAudio(prev.surahNumber, 1, prev.reciter.id);
          }
          return prev;
        } else if (prev.audioMode === 'ayah') {
          const sMeta = SURAH_LIST.find(s => s.number === prev.surahNumber);
          if (sMeta && prev.ayahNumber < sMeta.numberOfAyahs) {
            playAyahAudio(prev.surahNumber, prev.ayahNumber + 1, prev.reciter.id);
          } else if (prev.surahNumber < 114) {
            setSelectedSurahNum(prev.surahNumber + 1);
            playAyahAudio(prev.surahNumber + 1, 1, prev.reciter.id);
          }
        }
        return { ...prev, isPlaying: false, currentTime: 0 };
      });
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Accurate real-time listening seconds tracker
  useEffect(() => {
    let interval: any = null;
    if (audioState.isPlaying) {
      interval = setInterval(() => {
        setUserStats(prev => {
          const updated: UserStats = {
            ...prev,
            listeningSeconds: (prev.listeningSeconds || 0) + 1
          };
          try {
            localStorage.setItem('anwar_user_stats', JSON.stringify(updated));
          } catch {
            // ignore
          }
          return updated;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [audioState.isPlaying]);

  const playSurahAudio = (surahNum: number, reciterId?: string) => {
    setSelectedSurahNum(surahNum);
    setSelectedAyahNum(1);
    playAyahAudio(surahNum, 1, reciterId);
  };

  const playSurahFullAudio = async (surahNum: number, reciterId?: string) => {
    const targetReciter = reciterId ? (RECITERS_LIST.find(r => r.id === reciterId) || audioState.reciter) : audioState.reciter;
    setSelectedSurahNum(surahNum);

    const isOffline = await isSurahSavedOffline(targetReciter.id, surahNum);
    if (isOffline) {
      const offlineUrl = await getOfflineSurahBlobUrl(targetReciter.id, surahNum);
      if (offlineUrl) {
        startAudioPlayback([offlineUrl], audioState.playbackSpeed);
        setAudioState(prev => ({
          ...prev,
          isPlaying: true,
          surahNumber: surahNum,
          ayahNumber: 1,
          reciter: targetReciter,
          audioMode: 'surah',
          currentTime: 0
        }));
        showToast(`تشغيل سورة ${SURAH_LIST.find(s => s.number === surahNum)?.name} من التخزين بدون إنترنت ⚡`);
        return;
      }
    }

    const urls = targetReciter.surahAudioUrls
      ? targetReciter.surahAudioUrls(surahNum)
      : [targetReciter.surahAudioUrlPattern(surahNum)];

    startAudioPlayback(urls, audioState.playbackSpeed);

    setAudioState(prev => ({
      ...prev,
      isPlaying: true,
      surahNumber: surahNum,
      ayahNumber: 1,
      reciter: targetReciter,
      audioMode: 'surah',
      currentTime: 0
    }));
  };

  const playAyahAudio = (surahNum: number, ayahNum: number, reciterId?: string, singleAyahOnly: boolean = false) => {
    setSelectedSurahNum(surahNum);
    setSelectedAyahNum(ayahNum);

    const targetReciter = reciterId ? (RECITERS_LIST.find(r => r.id === reciterId) || audioState.reciter) : audioState.reciter;
    const urls = targetReciter.ayahAudioUrls
      ? targetReciter.ayahAudioUrls(surahNum, ayahNum)
      : [targetReciter.ayahAudioUrlPattern(surahNum, ayahNum)];

    startAudioPlayback(urls, audioState.playbackSpeed);

    setAudioState(prev => ({
      ...prev,
      isPlaying: true,
      surahNumber: surahNum,
      ayahNumber: ayahNum,
      reciter: targetReciter,
      audioMode: 'ayah',
      playSingleAyahOnly: singleAyahOnly,
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
      if (!audioRef.current.src || audioRef.current.src === '') {
        if (audioState.audioMode === 'surah') {
          playSurahFullAudio(audioState.surahNumber, audioState.reciter.id);
        } else {
          playAyahAudio(audioState.surahNumber, audioState.ayahNumber, audioState.reciter.id);
        }
      } else {
        audioRef.current.play().catch(e => {
          console.warn('Resume audio failed:', e);
          if (audioState.audioMode === 'surah') {
            playSurahFullAudio(audioState.surahNumber, audioState.reciter.id);
          } else {
            playAyahAudio(audioState.surahNumber, audioState.ayahNumber, audioState.reciter.id);
          }
        });
      }
    }
  };

  const togglePlayPause = () => {
    if (audioState.isPlaying) {
      pauseAudio();
    } else {
      if (!audioRef.current?.src || audioRef.current.src === '') {
        if (audioState.audioMode === 'surah') {
          playSurahFullAudio(selectedSurahNum, audioState.reciter.id);
        } else {
          playSurahAudio(selectedSurahNum, audioState.reciter.id);
        }
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
      if (audioState.audioMode === 'surah') {
        playSurahFullAudio(audioState.surahNumber, reciter.id);
      } else {
        playAyahAudio(audioState.surahNumber, audioState.ayahNumber, reciter.id);
      }
    }
  };

  const seekAudioTo = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
    }
  };

  const skipNextAyah = () => {
    if (audioState.audioMode === 'surah') {
      if (audioState.surahNumber < 114) {
        const next = audioState.surahNumber + 1;
        setSelectedSurahNum(next);
        playSurahFullAudio(next, audioState.reciter.id);
      }
      return;
    }
    const sMeta = SURAH_LIST.find(s => s.number === audioState.surahNumber);
    if (sMeta && audioState.ayahNumber < sMeta.numberOfAyahs) {
      playAyahAudio(audioState.surahNumber, audioState.ayahNumber + 1);
    } else if (audioState.surahNumber < 114) {
      setSelectedSurahNum(audioState.surahNumber + 1);
      playAyahAudio(audioState.surahNumber + 1, 1);
    }
  };

  const skipPrevAyah = () => {
    if (audioState.audioMode === 'surah') {
      if (audioState.surahNumber > 1) {
        const prev = audioState.surahNumber - 1;
        setSelectedSurahNum(prev);
        playSurahFullAudio(prev, audioState.reciter.id);
      }
      return;
    }
    if (audioState.ayahNumber > 1) {
      playAyahAudio(audioState.surahNumber, audioState.ayahNumber - 1);
    } else if (audioState.surahNumber > 1) {
      const prevSurahMeta = SURAH_LIST.find(s => s.number === audioState.surahNumber - 1);
      setSelectedSurahNum(audioState.surahNumber - 1);
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
      settings.juristicMethod,
      settings.prayerOffsets
    );
  });

  const [nextPrayer, setNextPrayer] = useState<NextPrayerInfo>(() => {
    return getNextPrayer(prayerTimes);
  });

  // Track notified prayers to avoid duplicate alerts within the same prayer window
  const lastNotifiedRef = useRef<string>('');

  // Fetch online accurate timings when location or method or offsets change
  useEffect(() => {
    let isCancelled = false;
    const fetchTimings = async () => {
      const live = await fetchLiveAladhanTimings(
        settings.lat,
        settings.lng,
        settings.prayerCalcMethod,
        settings.juristicMethod,
        settings.prayerOffsets
      );
      if (!isCancelled && live) {
        setPrayerTimes(live);
        setNextPrayer(getNextPrayer(live));
      }
    };
    fetchTimings();
    return () => {
      isCancelled = true;
    };
  }, [
    settings.lat,
    settings.lng,
    settings.prayerCalcMethod,
    settings.juristicMethod,
    settings.prayerOffsets?.fajr,
    settings.prayerOffsets?.sunrise,
    settings.prayerOffsets?.dhuhr,
    settings.prayerOffsets?.asr,
    settings.prayerOffsets?.maghrib,
    settings.prayerOffsets?.isha
  ]);

  // Live prayer countdown & notification ticker
  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      const calculated = calculatePrayerTimes(
        now,
        settings.lat,
        settings.lng,
        settings.prayerCalcMethod,
        settings.juristicMethod,
        settings.prayerOffsets
      );
      setPrayerTimes(calculated);
      const nextInfo = getNextPrayer(calculated);
      setNextPrayer(nextInfo);

      // Check for Adhan notification
      if (settings.adhanNotification) {
        const currentTotalSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
        const todayDateStr = calculated.date || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

        const prayerEntries: { key: keyof typeof settings.adhanNotificationPrayers; nameArabic: string; timeStr: string }[] = [
          { key: 'fajr', nameArabic: 'الفجر', timeStr: calculated.fajr },
          { key: 'dhuhr', nameArabic: 'الظهر', timeStr: calculated.dhuhr },
          { key: 'asr', nameArabic: 'العصر', timeStr: calculated.asr },
          { key: 'maghrib', nameArabic: 'المغرب', timeStr: calculated.maghrib },
          { key: 'isha', nameArabic: 'العشاء', timeStr: calculated.isha }
        ];

        for (const prayer of prayerEntries) {
          const isPrayerEnabled = settings.adhanNotificationPrayers?.[prayer.key] ?? true;
          if (!isPrayerEnabled || !prayer.timeStr) continue;

          // Parse prayer time "HH:MM"
          const parts = prayer.timeStr.split(':');
          if (parts.length < 2) continue;
          const pHours = parseInt(parts[0], 10);
          const pMinutes = parseInt(parts[1], 10);
          if (isNaN(pHours) || isNaN(pMinutes)) continue;
          const prayerTotalSec = pHours * 3600 + pMinutes * 60;

          // 1. Pre-Adhan Reminder
          if (settings.adhanReminderMinutes > 0) {
            const reminderSec = prayerTotalSec - settings.adhanReminderMinutes * 60;
            const remDiff = currentTotalSec - reminderSec;
            const reminderKey = `reminder_${String(prayer.key)}_${todayDateStr}`;

            if (remDiff >= 0 && remDiff <= 60 && lastNotifiedRef.current !== reminderKey) {
              lastNotifiedRef.current = reminderKey;
              triggerPrayerNotification(
                `اقترب موعد صلاة ${prayer.nameArabic} 🕌`,
                `متبقي ${settings.adhanReminderMinutes} دقائق على رفع أذان صلاة ${prayer.nameArabic}`
              );
              playIslamicTone();
            }
          }

          // 2. Exact Adhan Trigger (triggers precisely as the second arrives, within 60s window)
          const adhanDiff = currentTotalSec - prayerTotalSec;
          const adhanKey = `adhan_${String(prayer.key)}_${todayDateStr}`;

          if (adhanDiff >= 0 && adhanDiff <= 60 && lastNotifiedRef.current !== adhanKey) {
            lastNotifiedRef.current = adhanKey;

            // Trigger visual modal alert on screen
            setActiveAdhanAlert({
              prayerName: prayer.nameArabic,
              cityName: settings.locationCity || 'مكة المكرمة'
            });

            // Trigger system / browser notification
            triggerPrayerNotification(
              `حان الآن موعد أذان صلاة ${prayer.nameArabic} 🕌`,
              `حي على الصلاة، حي على الفلاح - تقبل الله طاعتكم`
            );

            // Play instant adhan audio
            if (settings.playAdhanAudioOnTime) {
              soundManager.playAdhan(settings.adhanMuadhin);
              playAdhanAudio(settings.adhanMuadhin, prayer.nameArabic);
            }

            // Haptic vibration on mobile
            soundManager.triggerVibration([500, 200, 500, 200, 1000]);

            showToast(`حان الآن موعد أذان صلاة ${prayer.nameArabic} 🕌 تقبل الله طاعتكم`);
            break;
          }
        }
      }
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [
    settings.lat,
    settings.lng,
    settings.prayerCalcMethod,
    settings.juristicMethod,
    settings.prayerOffsets,
    settings.adhanNotification,
    settings.adhanReminderMinutes,
    settings.playAdhanAudioOnTime,
    settings.adhanMuadhin,
    settings.adhanNotificationPrayers,
    settings.locationCity
  ]);

  // Automatic High-Precision GPS Geolocation & Live Reverse Geocoding
  const refreshLocation = async () => {
    if (!('geolocation' in navigator)) {
      showToast('خاصية تحديد الموقع غير مدعومة في متصفحك.');
      return;
    }

    showToast('جاري تحديد موقعك الجغرافي وحساب المواقيت والقبلة بأعلى دقة GPS 📍...');
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude } = pos.coords;
        try {
          const geoResult = await reverseGeocode(latitude, longitude);
          const recommendedMethod = geoResult.recommendedMethod || settings.prayerCalcMethod;
          const liveTimings = await fetchLiveAladhanTimings(
            latitude,
            longitude,
            recommendedMethod,
            settings.juristicMethod,
            settings.prayerOffsets
          );

          const locationName = geoResult.fullName || geoResult.city || 'الموقع الحالي (GPS)';

          updateSettings({
            lat: latitude,
            lng: longitude,
            locationCity: locationName,
            prayerCalcMethod: recommendedMethod,
            autoDetectLocation: true
          });

          if (liveTimings) {
            setPrayerTimes(liveTimings);
            setNextPrayer(getNextPrayer(liveTimings));
          } else {
            const calculated = calculatePrayerTimes(
              new Date(),
              latitude,
              longitude,
              recommendedMethod,
              settings.juristicMethod,
              settings.prayerOffsets
            );
            setPrayerTimes(calculated);
            setNextPrayer(getNextPrayer(calculated));
          }

          showToast(`تم تحديد موقعك بدقة: ${locationName} وضبط تقويم (${recommendedMethod === 'Makkah' ? 'أم القرى - مكة المكرمة' : recommendedMethod === 'Egypt' ? 'المساحة المصرية' : recommendedMethod}) 🕌`);
        } catch (e) {
          const calculated = calculatePrayerTimes(
            new Date(),
            latitude,
            longitude,
            settings.prayerCalcMethod,
            settings.juristicMethod,
            settings.prayerOffsets
          );
          setPrayerTimes(calculated);
          setNextPrayer(getNextPrayer(calculated));
          showToast('تم تحديد الإحداثيات وتحديث مواقيت الصلاة 📍');
        }
      },
      err => {
        console.warn('Geolocation failed:', err);
        showToast('يرجى السماح بالوصول للموقع لتحديد مواقيت الصلاة والقبلة تلقائياً.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

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
        createNewKhatmah,
        markKhatmahPageComplete,
        togglePageCompleted,
        toggleJuzCompleted,
        deleteKhatmah,
        userStats,
        recordPageRead,
        incrementTasbeehCount,
        recordCorrectionAttempt,
        downloadedReciters,
        addDownloadedReciter,
        removeDownloadedReciter,
        clearAllDownloads,
        resetAllCounters,
        audioState,
        playSurahAudio,
        playSurahFullAudio,
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
        activeAdhanAlert,
        closeAdhanAlert,
        isVoiceCorrectionOpen,
        setIsVoiceCorrectionOpen,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        verifyAdminPassword,
        logoutAdmin,
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
