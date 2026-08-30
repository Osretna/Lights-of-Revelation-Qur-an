export type RevelationType = 'مكية' | 'مدنية';

export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: RevelationType;
  revelationOrder: number;
  startJuz: number;
  startPage: number;
}

export interface Ayah {
  number: number; // overall number in Quran (1-6236)
  numberInSurah: number;
  text: string;
  textUthmani?: string;
  juz: number;
  page: number;
  hizbQuarter: number;
  sajda?: boolean | { id: number; recommended: boolean; obligatory: boolean };
  audio?: string;
  translation?: string;
}

export interface SurahDetail extends SurahMeta {
  ayahs: Ayah[];
  bismillahPre?: boolean;
}

export interface Reciter {
  id: string;
  name: string;
  style: 'مرتل' | 'مجود' | 'معلم';
  serverUrl: string; // e.g. https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/ or mp3quran
  surahAudioUrlPattern: (surahNum: number) => string;
  ayahAudioUrlPattern: (surahNum: number, ayahNumInSurah: number) => string;
  surahAudioUrls?: (surahNum: number) => string[];
  ayahAudioUrls?: (surahNum: number, ayahNumInSurah: number) => string[];
  photo?: string;
  bitrate: string;
}

export type TafsirScholar = 'saadi' | 'ibnkathir' | 'tabari' | 'qurtubi' | 'muyassar';

export interface TafsirEntry {
  scholar: TafsirScholar;
  scholarName: string;
  surah: number;
  ayah: number;
  text: string;
}

export interface PrayerTimeData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: string;
  hijriDate: string;
  hijriDay: string;
  hijriMonth: string;
  hijriYear: string;
}

export interface ZikrItem {
  id: string;
  category: 'sabah' | 'masaa' | 'sleep' | 'post_prayer' | 'mosque' | 'adhan' | 'quran_dua';
  text: string;
  count: number;
  repeatTarget: number;
  reward?: string;
  reference?: string;
}

export interface KhatmahPlan {
  id: string;
  title: string;
  startDate: string;
  targetDays: number;
  dailyPagesTarget: number;
  completedPages: number[]; // page numbers 1-604
  completedJuz: number[]; // juz numbers 1-30
  status: 'active' | 'completed';
  createdAt: number;
  notes?: string;
}

export interface Bookmark {
  id: string;
  surahNumber: number;
  surahName: string;
  ayahNumberInSurah: number;
  ayahGlobalNumber: number;
  page: number;
  juz: number;
  textPreview: string;
  timestamp: number;
  note?: string;
  color?: string;
}

export interface ReadingProgress {
  lastSurahNumber: number;
  lastSurahName: string;
  lastAyahNumber: number;
  lastPageNumber: number;
  lastJuzNumber: number;
  lastUpdated: number;
}

export interface PrayerOffsets {
  fajr: number;
  sunrise: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

export interface AppSettings {
  theme: 'emerald' | 'dark' | 'sepia' | 'oled';
  fontFamily: 'Amiri' | 'Amiri Quran' | 'Scheherazade New' | 'Cairo';
  fontSize: number; // 20 - 46
  showTashkeel: boolean;
  autoScrollAyah: boolean;
  selectedReciterId: string;
  playbackSpeed: number;
  repeatMode: 'none' | 'ayah' | 'surah';
  prayerCalcMethod: 'Makkah' | 'Egypt' | 'MWL' | 'ISNA' | 'Karachi' | 'Dubai' | 'Qatar' | 'Kuwait' | 'Turkey' | 'Algeria' | 'Tunisia' | 'France';
  juristicMethod: 'shafii' | 'hanafi';
  timeFormat: '12h' | '24h';
  prayerOffsets: PrayerOffsets;
  adhanNotification: boolean;
  adhanReminderMinutes: number; // 0 (at adhan time), 5, 10, 15 minutes before
  playAdhanAudioOnTime: boolean;
  adhanNotificationPrayers: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
  adhanMuadhin: string;
  locationCity: string;
  lat: number;
  lng: number;
  autoDetectLocation: boolean;
  showSponsorship: boolean;
  // Google AdSense & Halal Ads Settings
  adSenseEnabled: boolean;
  adSensePublisherId: string;
  adSenseBannerSlot: string;
  adSenseInFeedSlot: string;
  adSenseNativeSlot: string;
  adSenseTestMode: boolean;
  halalAdFilterActive: boolean;
  showIslamicFallbackWhenNoAds: boolean;
}

export interface UserStats {
  pagesRead: number[];
  totalPagesRead: number;
  streakDays: number;
  lastActiveDate: string;
  listeningSeconds: number;
  completedKhatmahsCount: number;
  tasbeehTotalCount: number;
  correctionAttempts: number;
  correctionSuccessCount: number;
}

