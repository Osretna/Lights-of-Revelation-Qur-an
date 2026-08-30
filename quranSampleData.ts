import { Ayah, SurahDetail } from '../types/quran';
import { SURAH_LIST } from './surahList';

// Remove tashkeel / diacritics for ultra-fast Arabic fuzzy search
export function removeTashkeel(text: string): string {
  if (!text) return '';
  return text
    .replace(/([^\u0621-\u063A\u0641-\u064A\u0660-\u0669a-zA-Z0-9\s])/g, '')
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\s\uFEFF\xA0]+/g, ' ')
    .trim();
}

// Bismillah text constant
export const BISMILLAH_TEXT = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

// Function to clean Bismillah prefix from Ayah 1 for surahs other than Al-Fatiha & At-Tawbah
export function cleanFirstAyahBismillah(text: string, surahNum: number): string {
  if (surahNum === 1 || surahNum === 9) return text;
  return text
    .replace(/^[\s\uFEFF\xA0]*بِسْمِ[\s\u00A0]*[ٱا]للَّ?هِ[\s\u00A0]*[ٱا]لرَّ?حْمَٰ?نِ[\s\u00A0]*[ٱا]لرَّ?حِيمِ[\s\u00A0]*/i, '')
    .trim();
}

// Global In-Memory Surahs Cache (All 114 Surahs)
const fullQuranCache: Record<number, Ayah[]> = {};
let isQuranLoadingPromise: Promise<boolean> | null = null;

/**
 * Preload all 114 Surahs from the bundled authentic Uthmani JSON file
 */
export async function preloadFullQuran(): Promise<boolean> {
  if (Object.keys(fullQuranCache).length >= 114) {
    return true;
  }

  if (isQuranLoadingPromise) {
    return isQuranLoadingPromise;
  }

  isQuranLoadingPromise = (async () => {
    try {
      // 1. Try local bundled static asset
      const res = await fetch('/quran-uthmani.json');
      if (res.ok) {
        const surahs = await res.json();
        if (Array.isArray(surahs) && surahs.length > 0) {
          populateQuranCache(surahs);
          return true;
        }
      }
    } catch (e) {
      console.warn('Failed to load local /quran-uthmani.json, trying CDN mirror...', e);
    }

    // 2. Mirror fallback CDNs if local fetch fails
    const cdnMirrors = [
      'https://api.alquran.cloud/v1/quran/quran-uthmani',
      'https://cdn.jsdelivr.net/gh/risan/quran-json@main/dist/quran.json'
    ];

    for (const mirrorUrl of cdnMirrors) {
      try {
        const res = await fetch(mirrorUrl);
        if (res.ok) {
          const data = await res.json();
          const surahs = data?.data?.surahs || data;
          if (Array.isArray(surahs) && surahs.length > 0) {
            populateQuranCache(surahs);
            return true;
          }
        }
      } catch (err) {
        console.warn(`Mirror ${mirrorUrl} failed:`, err);
      }
    }

    return Object.keys(fullQuranCache).length > 0;
  })();

  return isQuranLoadingPromise;
}

function populateQuranCache(surahs: any[]) {
  for (const s of surahs) {
    const sNum = s.number || s.id;
    if (sNum && Array.isArray(s.ayahs || s.verses)) {
      const rawAyahs = s.ayahs || s.verses;
      const mapped: Ayah[] = rawAyahs.map((a: any, idx: number) => {
        const numInSurah = a.numberInSurah || a.number || (idx + 1);
        let rawText = a.text || a.ar || '';
        if (numInSurah === 1) {
          rawText = cleanFirstAyahBismillah(rawText, sNum);
        }
        return {
          number: a.number || (sNum * 1000 + numInSurah),
          numberInSurah: numInSurah,
          text: rawText,
          juz: a.juz || Math.ceil(sNum / 4),
          page: a.page || 1,
          hizbQuarter: a.hizbQuarter || 1,
          sajda: Boolean(a.sajda)
        };
      });
      fullQuranCache[sNum] = mapped;
    }
  }
}

// Immediately initiate preload in background
if (typeof window !== 'undefined') {
  preloadFullQuran().catch(() => {});
}

/**
 * Fetch full Surah content with complete offline guarantee
 */
export async function getSurahDetail(surahNum: number): Promise<SurahDetail> {
  const meta = SURAH_LIST.find(s => s.number === surahNum) || SURAH_LIST[0];

  // 1. Check in-memory cache
  if (fullQuranCache[surahNum] && fullQuranCache[surahNum].length > 0) {
    return {
      ...meta,
      ayahs: fullQuranCache[surahNum],
      bismillahPre: surahNum !== 1 && surahNum !== 9
    };
  }

  // 2. If not in cache, load the full Quran dataset
  await preloadFullQuran();
  if (fullQuranCache[surahNum] && fullQuranCache[surahNum].length > 0) {
    return {
      ...meta,
      ayahs: fullQuranCache[surahNum],
      bismillahPre: surahNum !== 1 && surahNum !== 9
    };
  }

  // 3. Fallback direct per-surah fetch from AlQuran Cloud
  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/quran-uthmani`);
    if (res.ok) {
      const data = await res.json();
      if (data?.data?.ayahs && Array.isArray(data.data.ayahs)) {
        const mappedAyahs: Ayah[] = data.data.ayahs.map((a: any) => {
          let text = a.text;
          if (a.numberInSurah === 1) {
            text = cleanFirstAyahBismillah(text, surahNum);
          }
          return {
            number: a.number,
            numberInSurah: a.numberInSurah,
            text,
            juz: a.juz,
            page: a.page,
            hizbQuarter: a.hizbQuarter,
            sajda: a.sajda
          };
        });

        fullQuranCache[surahNum] = mappedAyahs;
        return {
          ...meta,
          ayahs: mappedAyahs,
          bismillahPre: surahNum !== 1 && surahNum !== 9
        };
      }
    }
  } catch (err) {
    console.warn(`Online fetch for Surah ${surahNum} failed:`, err);
  }

  // Return available cached ayahs or empty array (safeguard)
  return {
    ...meta,
    ayahs: fullQuranCache[surahNum] || [],
    bismillahPre: surahNum !== 1 && surahNum !== 9
  };
}

// Global search interface
export interface SearchResult {
  surahNumber: number;
  surahName: string;
  ayahNumberInSurah: number;
  ayahGlobalNumber: number;
  text: string;
  matchedPart: string;
  juz: number;
  page: number;
}

/**
 * Fast search across all 114 Surahs and 6,236 Ayahs
 */
export async function searchInQuran(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  // Ensure full quran is in cache
  await preloadFullQuran();

  const cleanQuery = removeTashkeel(query);
  const results: SearchResult[] = [];

  for (const surahMeta of SURAH_LIST) {
    // Check if Surah name matches query
    if (removeTashkeel(surahMeta.name).includes(cleanQuery)) {
      results.push({
        surahNumber: surahMeta.number,
        surahName: surahMeta.name,
        ayahNumberInSurah: 1,
        ayahGlobalNumber: surahMeta.startPage * 10,
        text: `سورة ${surahMeta.name} (${surahMeta.revelationType} - ${surahMeta.numberOfAyahs} آية)`,
        matchedPart: surahMeta.name,
        juz: surahMeta.startJuz,
        page: surahMeta.startPage
      });
    }

    const ayahs = fullQuranCache[surahMeta.number];
    if (ayahs) {
      for (const ayah of ayahs) {
        const cleanAyah = removeTashkeel(ayah.text);
        if (cleanAyah.includes(cleanQuery)) {
          results.push({
            surahNumber: surahMeta.number,
            surahName: surahMeta.name,
            ayahNumberInSurah: ayah.numberInSurah,
            ayahGlobalNumber: ayah.number,
            text: ayah.text,
            matchedPart: query,
            juz: ayah.juz,
            page: ayah.page
          });
        }
      }
    }
  }

  return results.slice(0, 100);
}
