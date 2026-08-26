import { Ayah, SurahDetail } from '../types/quran';
import { SURAH_LIST } from './surahList';

// Remove tashkeel / diacritics for ultra-fast Arabic fuzzy search
export function removeTashkeel(text: string): string {
  return text
    .replace(/([^\u0621-\u063A\u0641-\u064A\u0660-\u0669a-zA-Z0-9\s])/g, '')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .trim();
}

// Bismillah text constant
export const BISMILLAH_TEXT = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

// Bundled offline Surahs for immediate guaranteed offline access
export const BUNDLED_SURAHS: Record<number, Ayah[]> = {
  // 1: Al-Fatiha
  1: [
    { number: 1, numberInSurah: 1, text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", juz: 1, page: 1, hizbQuarter: 1 },
    { number: 2, numberInSurah: 2, text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", juz: 1, page: 1, hizbQuarter: 1 },
    { number: 3, numberInSurah: 3, text: "الرَّحْمَٰنِ الرَّحِيمِ", juz: 1, page: 1, hizbQuarter: 1 },
    { number: 4, numberInSurah: 4, text: "مَالِكِ يَوْمِ الدِّينِ", juz: 1, page: 1, hizbQuarter: 1 },
    { number: 5, numberInSurah: 5, text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", juz: 1, page: 1, hizbQuarter: 1 },
    { number: 6, numberInSurah: 6, text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", juz: 1, page: 1, hizbQuarter: 1 },
    { number: 7, numberInSurah: 7, text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", juz: 1, page: 1, hizbQuarter: 1 }
  ],
  // 67: Al-Mulk
  67: [
    { number: 5242, numberInSurah: 1, text: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", juz: 29, page: 562, hizbQuarter: 113 },
    { number: 5243, numberInSurah: 2, text: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ", juz: 29, page: 562, hizbQuarter: 113 },
    { number: 5244, numberInSurah: 3, text: "الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ", juz: 29, page: 562, hizbQuarter: 113 },
    { number: 5245, numberInSurah: 4, text: "ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ", juz: 29, page: 562, hizbQuarter: 113 },
    { number: 5246, numberInSurah: 5, text: "وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ", juz: 29, page: 562, hizbQuarter: 113 },
    { number: 5247, numberInSurah: 6, text: "وَلِلَّذِينَ كَفَرُوا بِرَبِّهِمْ عَذَابُ جَهَنَّمَ ۖ وَبِئْسَ الْمَصِيرُ", juz: 29, page: 562, hizbQuarter: 113 },
    { number: 5248, numberInSurah: 7, text: "إِذَا أُلْقُوا فِيهَا سَمِعُوا لَهَا شَهِيقًا وَهِيَ تَفُورُ", juz: 29, page: 562, hizbQuarter: 113 },
    { number: 5249, numberInSurah: 8, text: "تَكَادُ تَمَيَّزُ مِنَ الْغَيْظِ ۖ كُلَّمَا أُلْقِيَ فِيهَا فَوْجٌ سَأَلَهُمْ خَزَنَتُهَا أَلَمْ يَأْتِكُمْ نَذِيرٌ", juz: 29, page: 562, hizbQuarter: 113 },
    { number: 5250, numberInSurah: 9, text: "قَالُوا بَلَىٰ قَدْ جَاءَنَا نَذِيرٌ فَكَذَّبْنَا وَقُلْنَا مَا نَزَّلَ اللَّهُ مِن شَيْءٍ إِنْ أَنتُمْ إِلَّا فِي ضَلَالٍ كَبِيرٍ", juz: 29, page: 562, hizbQuarter: 113 },
    { number: 5251, numberInSurah: 10, text: "وَقَالُوا لَوْ كُنَّا نَسْمَعُ أَوْ نَعْقِلُ مَا كُنَّا فِي أَصْحَابِ السَّعِيرِ", juz: 29, page: 562, hizbQuarter: 113 },
    { number: 5252, numberInSurah: 11, text: "فَاعْتَرَفُوا بِذَنبِهِمْ فَسُحْقًا لِّأَصْحَابِ السَّعِيرِ", juz: 29, page: 562, hizbQuarter: 113 },
    { number: 5253, numberInSurah: 12, text: "إِنَّ الَّذِينَ يَخْشَوْنَ رَبَّهُم بِالْغَيْبِ لَهُم مَّغْفِرَةٌ وَأَجْرٌ كَبِيرٌ", juz: 29, page: 562, hizbQuarter: 113 },
    { number: 5254, numberInSurah: 13, text: "وَأَسِرُّوا قَوْلَكُمْ أَوِ اجْهَرُوا بِهِ ۖ إِنَّهُ عَلِيمٌ بِذَاتِ الصُّدُورِ", juz: 29, page: 563, hizbQuarter: 113 },
    { number: 5255, numberInSurah: 14, text: "أَلَا يَعْلَمُ مَنْ خَلَقَ وَهُوَ اللَّطِيفُ الْخَبِيرُ", juz: 29, page: 563, hizbQuarter: 113 },
    { number: 5256, numberInSurah: 15, text: "هُوَ الَّذِي جَعَلَ لَكُمُ الْأَرْضَ ذَلُولًا فَامْشُوا فِي مَنَاكِبِهَا وَكُلُوا مِن رِّزْقِهِ ۖ وَإِلَيْهِ النُّشُورُ", juz: 29, page: 563, hizbQuarter: 113 },
    { number: 5257, numberInSurah: 16, text: "أَأَمِنتُم مَّن فِي السَّمَاءِ أَن يَخْسِفَ بِكُمُ الْأَرْضَ فَإِذَا هِيَ تَمُورُ", juz: 29, page: 563, hizbQuarter: 113 },
    { number: 5258, numberInSurah: 17, text: "أَمْ أَمِنتُم مَّن فِي السَّمَاءِ أَن يُرْسِلَ عَلَيْكُمْ حَاصِبًا ۖ فَسَتَعْلَمُونَ كَيْفَ نَذِيرِ", juz: 29, page: 563, hizbQuarter: 113 },
    { number: 5259, numberInSurah: 18, text: "وَلَقَدْ كَذَّبَ الَّذِينَ مِن قَبْلِهِمْ فَكَيْفَ كَانَ نَكِيرِ", juz: 29, page: 563, hizbQuarter: 113 },
    { number: 5260, numberInSurah: 19, text: "أَوَلَمْ يَرَوْا إِلَى الطَّيْرِ فَوْقَهُمْ صَافَّاتٍ وَيَقْبِضْنَ ۚ مَا يُمْسِكُهُنَّ إِلَّا الرَّحْمَٰنُ ۚ إِنَّهُ بِكُلِّ شَيْءٍ بَصِيرٌ", juz: 29, page: 563, hizbQuarter: 113 },
    { number: 5261, numberInSurah: 20, text: "أَمَّنْ هَٰذَا الَّذِي هُوَ جُندٌ لَّكُمْ يَنصُرُكُم مِّن دُونِ الرَّحْمَٰنِ ۚ إِنِ الْكَافِرُونَ إِلَّا فِي غُرُورٍ", juz: 29, page: 563, hizbQuarter: 113 },
    { number: 5262, numberInSurah: 21, text: "أَمَّنْ هَٰذَا الَّذِي يَرْزُقُكُمْ إِنْ أَمْسَكَ رِزْقَهُ ۚ بَل لَّجُّوا فِي عُتُوٍّ وَنُفُورٍ", juz: 29, page: 563, hizbQuarter: 113 },
    { number: 5263, numberInSurah: 22, text: "أَفَمَن يَمْشِي مُكِبًّا عَلَىٰ وَجْهِهِ أَهْدَىٰ أَمَّن يَمْشِي سَوِيًّا عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ", juz: 29, page: 563, hizbQuarter: 113 },
    { number: 5264, numberInSurah: 23, text: "قُلْ هُوَ الَّذِي أَنشَأَكُمْ وَجَعَلَ لَكُمُ السَّمْعَ وَالْأَبْصَارَ وَالْأَفْئِدَةَ ۖ قَلِيلًا مَّا تَشْكُرُونَ", juz: 29, page: 563, hizbQuarter: 113 },
    { number: 5265, numberInSurah: 24, text: "قُلْ هُوَ الَّذِي ذَرَأَكُمْ فِي الْأَرْضِ وَإِلَيْهِ تُحْشَرُونَ", juz: 29, page: 563, hizbQuarter: 113 },
    { number: 5266, numberInSurah: 25, text: "وَيَقُولُونَ مَتَىٰ هَٰذَا الْوَعْدُ إِن كُنتُمْ صَادِقِينَ", juz: 29, page: 563, hizbQuarter: 113 },
    { number: 5267, numberInSurah: 26, text: "قُلْ إِنَّمَا الْعِلْمُ عِندَ اللَّهِ وَإِنَّمَا أَنَا نَذِيرٌ مُّبِينٌ", juz: 29, page: 563, hizbQuarter: 113 },
    { number: 5268, numberInSurah: 27, text: "فَلَمَّا رَأَوْهُ زُلْفَةً سِيئَتْ وُجُوهُ الَّذِينَ كَفَرُوا وَقِيلَ هَٰذَا الَّذِي كُنتُم بِهِ تَدَّعُونَ", juz: 29, page: 564, hizbQuarter: 113 },
    { number: 5269, numberInSurah: 28, text: "قُلْ أَرَأَيْتُمْ إِنْ أَهْلَكَنِيَ اللَّهُ وَمَن مَّعِيَ أَوْ رَحِمَنَا فَمَن يُجِيرُ الْكَافِرِينَ مِنْ عَذَابٍ أَلِيمٍ", juz: 29, page: 564, hizbQuarter: 113 },
    { number: 5270, numberInSurah: 29, text: "قُلْ هُوَ الرَّحْمَٰنُ آمَنَّا بِهِ وَعَلَيْهِ تَوَكَّلْنَا ۖ فَسَتَعْلَمُونَ مَنْ هُوَ فِي ضَلَالٍ مُّبِينٍ", juz: 29, page: 564, hizbQuarter: 113 },
    { number: 5271, numberInSurah: 30, text: "قُلْ أَرَأَيْتُمْ إِنْ أَصْبَحَ مَاؤُكُمْ غَوْرًا فَمَن يَأْتِيكُم بِمَاءٍ مَّعِينٍ", juz: 29, page: 564, hizbQuarter: 113 }
  ],
  // 112: Al-Ikhlas
  112: [
    { number: 6222, numberInSurah: 1, text: "قُلْ هُوَ اللَّهُ أَحَدٌ", juz: 30, page: 604, hizbQuarter: 120 },
    { number: 6223, numberInSurah: 2, text: "اللَّهُ الصَّمَدُ", juz: 30, page: 604, hizbQuarter: 120 },
    { number: 6224, numberInSurah: 3, text: "لَمْ يَلِدْ وَلَمْ يُولَدْ", juz: 30, page: 604, hizbQuarter: 120 },
    { number: 6225, numberInSurah: 4, text: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", juz: 30, page: 604, hizbQuarter: 120 }
  ],
  // 113: Al-Falaq
  113: [
    { number: 6226, numberInSurah: 1, text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", juz: 30, page: 604, hizbQuarter: 120 },
    { number: 6227, numberInSurah: 2, text: "مِن شَرِّ مَا خَلَقَ", juz: 30, page: 604, hizbQuarter: 120 },
    { number: 6228, numberInSurah: 3, text: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", juz: 30, page: 604, hizbQuarter: 120 },
    { number: 6229, numberInSurah: 4, text: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", juz: 30, page: 604, hizbQuarter: 120 },
    { number: 6230, numberInSurah: 5, text: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", juz: 30, page: 604, hizbQuarter: 120 }
  ],
  // 114: An-Nas
  114: [
    { number: 6231, numberInSurah: 1, text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", juz: 30, page: 604, hizbQuarter: 120 },
    { number: 6232, numberInSurah: 2, text: "مَلِكِ النَّاسِ", juz: 30, page: 604, hizbQuarter: 120 },
    { number: 6233, numberInSurah: 3, text: "إِلَٰهِ النَّاسِ", juz: 30, page: 604, hizbQuarter: 120 },
    { number: 6234, numberInSurah: 4, text: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", juz: 30, page: 604, hizbQuarter: 120 },
    { number: 6235, numberInSurah: 5, text: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", juz: 30, page: 604, hizbQuarter: 120 },
    { number: 6236, numberInSurah: 6, text: "مِنَ الْجِنَّةِ وَالنَّاسِ", juz: 30, page: 604, hizbQuarter: 120 }
  ],
  // 108: Al-Kawthar
  108: [
    { number: 6205, numberInSurah: 1, text: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", juz: 30, page: 602, hizbQuarter: 120 },
    { number: 6206, numberInSurah: 2, text: "فَصَلِّ لِرَبِّكَ وَانْحَرْ", juz: 30, page: 602, hizbQuarter: 120 },
    { number: 6207, numberInSurah: 3, text: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ", juz: 30, page: 602, hizbQuarter: 120 }
  ],
  // 110: An-Nasr
  110: [
    { number: 6213, numberInSurah: 1, text: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ", juz: 30, page: 603, hizbQuarter: 120 },
    { number: 6214, numberInSurah: 2, text: "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا", juz: 30, page: 603, hizbQuarter: 120 },
    { number: 6215, numberInSurah: 3, text: "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا", juz: 30, page: 603, hizbQuarter: 120 }
  ],
  // 97: Al-Qadr
  97: [
    { number: 6126, numberInSurah: 1, text: "إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ", juz: 30, page: 598, hizbQuarter: 120 },
    { number: 6127, numberInSurah: 2, text: "وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ", juz: 30, page: 598, hizbQuarter: 120 },
    { number: 6128, numberInSurah: 3, text: "لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ", juz: 30, page: 598, hizbQuarter: 120 },
    { number: 6129, numberInSurah: 4, text: "تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ", juz: 30, page: 598, hizbQuarter: 120 },
    { number: 6130, numberInSurah: 5, text: "سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ", juz: 30, page: 598, hizbQuarter: 120 }
  ],
  // 103: Al-Asr
  103: [
    { number: 6177, numberInSurah: 1, text: "وَالْعَصْرِ", juz: 30, page: 601, hizbQuarter: 120 },
    { number: 6178, numberInSurah: 2, text: "إِنَّ الْإِنسَانَ لَفِي خُسْرٍ", juz: 30, page: 601, hizbQuarter: 120 },
    { number: 6179, numberInSurah: 3, text: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ", juz: 30, page: 601, hizbQuarter: 120 }
  ]
};

// Memory & LocalStorage Cache
const surahCache: Record<number, Ayah[]> = { ...BUNDLED_SURAHS };

// Fetch full Surah content with offline persistence
export async function getSurahDetail(surahNum: number): Promise<SurahDetail> {
  const meta = SURAH_LIST.find(s => s.number === surahNum) || SURAH_LIST[0];

  // 1. Check in-memory cache
  if (surahCache[surahNum] && surahCache[surahNum].length > 0) {
    return {
      ...meta,
      ayahs: surahCache[surahNum],
      bismillahPre: surahNum !== 1 && surahNum !== 9
    };
  }

  // 2. Check localStorage cache
  try {
    const local = localStorage.getItem(`anwar_surah_${surahNum}`);
    if (local) {
      const parsed: Ayah[] = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        surahCache[surahNum] = parsed;
        return {
          ...meta,
          ayahs: parsed,
          bismillahPre: surahNum !== 1 && surahNum !== 9
        };
      }
    }
  } catch {
    // ignore storage read issue
  }

  // 3. Fetch from standard AlQuran Cloud API
  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/quran-uthmani`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.data && Array.isArray(data.data.ayahs)) {
        const mappedAyahs: Ayah[] = data.data.ayahs.map((a: { number: number; numberInSurah: number; text: string; juz: number; page: number; hizbQuarter: number; sajda: boolean }) => ({
          number: a.number,
          numberInSurah: a.numberInSurah,
          text: a.text,
          juz: a.juz,
          page: a.page,
          hizbQuarter: a.hizbQuarter,
          sajda: a.sajda
        }));

        // Clean Bismillah from first verse if present (except Al-Fatiha)
        if (surahNum !== 1 && mappedAyahs[0]?.text.startsWith(BISMILLAH_TEXT)) {
          mappedAyahs[0].text = mappedAyahs[0].text.replace(BISMILLAH_TEXT, '').trim();
        }

        surahCache[surahNum] = mappedAyahs;
        try {
          localStorage.setItem(`anwar_surah_${surahNum}`, JSON.stringify(mappedAyahs));
        } catch {
          // ignore quota limits
        }

        return {
          ...meta,
          ayahs: mappedAyahs,
          bismillahPre: surahNum !== 1 && surahNum !== 9
        };
      }
    }
  } catch (err) {
    console.warn(`Online fetch for Surah ${surahNum} failed, generating structured placeholder`, err);
  }

  // 4. Fallback generated placeholder for verses if completely offline and not pre-cached
  const fallbackAyahs: Ayah[] = Array.from({ length: meta.numberOfAyahs }, (_, i) => {
    const ayahIndex = i + 1;
    return {
      number: meta.startPage * 10 + ayahIndex,
      numberInSurah: ayahIndex,
      text: `آية رقم ${ayahIndex} من سورة ${meta.name} - (يرجى الاتصال بالإنترنت لتحميل النص القرآني الكامل إن لم يتم تنزيله مسبقاً)`,
      juz: meta.startJuz,
      page: meta.startPage,
      hizbQuarter: Math.ceil(meta.startJuz * 4)
    };
  });

  return {
    ...meta,
    ayahs: fallbackAyahs,
    bismillahPre: surahNum !== 1 && surahNum !== 9
  };
}

// Global search function
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

export async function searchInQuran(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  const cleanQuery = removeTashkeel(query.trim().toLowerCase());
  const results: SearchResult[] = [];

  // Search in memory / bundled / pre-cached surahs
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

    const cachedAyahs = surahCache[surahMeta.number];
    if (cachedAyahs) {
      for (const ayah of cachedAyahs) {
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

  // If online, search via API for full global quran search
  try {
    const res = await fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(query)}/all/quran-simple-min`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.data && Array.isArray(data.data.matches)) {
        for (const match of data.data.matches.slice(0, 50)) {
          const surahMeta = SURAH_LIST.find(s => s.number === match.surah.number) || SURAH_LIST[0];
          // Check if already in results
          const exists = results.some(r => r.surahNumber === match.surah.number && r.ayahNumberInSurah === match.numberInSurah);
          if (!exists) {
            results.push({
              surahNumber: match.surah.number,
              surahName: surahMeta.name,
              ayahNumberInSurah: match.numberInSurah,
              ayahGlobalNumber: match.number,
              text: match.text,
              matchedPart: query,
              juz: match.juz || surahMeta.startJuz,
              page: match.page || surahMeta.startPage
            });
          }
        }
      }
    }
  } catch {
    // offline search already populated from local database
  }

  return results;
}
