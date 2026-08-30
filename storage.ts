import { LocationData, ActiveTab } from '../types';

const STORAGE_KEYS = {
  LOCATION: 'anwar_wahy_location',
  ACTIVE_TAB: 'anwar_wahy_active_tab',
  QURAN_PROGRESS: 'anwar_wahy_quran_progress',
  AUDIO_SETTINGS: 'anwar_wahy_audio_settings',
  NOTIFICATIONS: 'anwar_wahy_notifications'
};

export const DEFAULT_LOCATION: LocationData = {
  city: 'Cairo',
  country: 'Egypt',
  latitude: 30.0444,
  longitude: 31.2357,
  timezone: 'Africa/Cairo',
  calculationMethod: 'Egyptian',
  madhab: 'shafi',
  isAutoDetected: false,
  manualOffsets: {
    fajr: 0,
    sunrise: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0
  }
};

export function getSavedLocation(): LocationData {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.LOCATION);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_LOCATION, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to load saved location:', e);
  }
  return DEFAULT_LOCATION;
}

export function saveLocation(loc: LocationData): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LOCATION, JSON.stringify(loc));
  } catch (e) {
    console.warn('Failed to save location:', e);
  }
}

export function getSavedActiveTab(defaultTab: ActiveTab = 'quran'): ActiveTab {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB);
    if (saved && ['quran', 'prayers', 'qibla', 'adhkar', 'settings'].includes(saved)) {
      return saved as ActiveTab;
    }
  } catch (e) {
    console.warn('Failed to get active tab:', e);
  }
  return defaultTab;
}

export function saveActiveTab(tab: ActiveTab): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, tab);
  } catch (e) {
    console.warn('Failed to save active tab:', e);
  }
}

export interface QuranProgress {
  surahNumber: number;
  ayahIndex: number;
  mode: 'smart_voice' | 'read' | 'listen';
  reciterId: string;
}

export function getSavedQuranProgress(): QuranProgress {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.QURAN_PROGRESS);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to load Quran progress:', e);
  }
  return {
    surahNumber: 1, // Al-Fatiha
    ayahIndex: 0,
    mode: 'smart_voice',
    reciterId: 'ar.alafasy'
  };
}

export function saveQuranProgress(progress: QuranProgress): void {
  try {
    localStorage.setItem(STORAGE_KEYS.QURAN_PROGRESS, JSON.stringify(progress));
  } catch (e) {
    console.warn('Failed to save Quran progress:', e);
  }
}

export interface AudioSettings {
  selectedAdhanId: string;
  adhanVolume: number;
  enableAdhanSound: boolean;
  enableNotifications: boolean;
  vibrateOnAdhan: boolean;
}

export const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  selectedAdhanId: 'makkah',
  adhanVolume: 1.0,
  enableAdhanSound: true,
  enableNotifications: true,
  vibrateOnAdhan: true
};

export function getSavedAudioSettings(): AudioSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIO_SETTINGS);
    if (saved) {
      return { ...DEFAULT_AUDIO_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Failed to load audio settings:', e);
  }
  return DEFAULT_AUDIO_SETTINGS;
}

export function saveAudioSettings(settings: AudioSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.AUDIO_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save audio settings:', e);
  }
}
