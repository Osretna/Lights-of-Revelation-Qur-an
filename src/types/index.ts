export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  page: number;
  juz: number;
}

export interface Ayah {
  number: number; // overall number in Quran
  numberInSurah: number;
  text: string; // with diacritics
  cleanText?: string; // normalized
  juz: number;
  page: number;
  hizbQuarter: number;
  sajda?: boolean;
}

export interface QuranSurahDetail extends SurahMeta {
  ayahs: Ayah[];
}

export interface WordMatchStatus {
  word: string;
  cleanWord: string;
  status: 'pending' | 'active' | 'matched' | 'skipped' | 'error';
  spokenWord?: string;
  index: number;
}

export interface RecitationState {
  currentSurah: number;
  currentAyahIndex: number;
  currentWordIndex: number;
  isListening: boolean;
  isAudioPlaying: boolean;
  score: number;
  mistakesCount: number;
  wordsStatus: WordMatchStatus[];
  transcript: string;
  mode: 'smart_voice' | 'read' | 'listen';
  reciterId: string;
}

export interface Reciter {
  id: string;
  name: string;
  subname: string;
  serverUrl: string; // base URL for audio
}

export interface LocationData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  calculationMethod: string;
  madhab: 'shafi' | 'hanafi';
  isAutoDetected: boolean;
  manualOffsets: {
    fajr: number;
    sunrise: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
}

export interface PrayerTimeItem {
  key: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'midnight' | 'lastThird';
  name: string;
  arabicName: string;
  time: Date;
  timeString: string;
  isNext: boolean;
  isPassed: boolean;
  iconName: string;
}

export interface AdhanAudioOption {
  id: string;
  name: string;
  muezzin: string;
  url: string;
  isFajrOnly?: boolean;
}

export interface DhikrItem {
  id: string;
  category: 'morning' | 'evening' | 'after_prayer' | 'sleep' | 'tasbeeh';
  categoryTitle: string;
  text: string;
  count: number;
  currentCount: number;
  virtue?: string;
  reference?: string;
}

export type ActiveTab = 'quran' | 'prayers' | 'qibla' | 'adhkar' | 'settings';
