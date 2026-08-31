/**
 * Arabic and Quranic Text Normalizer & Phonetic Recitation Matcher
 * Specially calibrated for Quran Voice Speech Recognition on Mobile & Desktop.
 * Accurately handles لفظ الجلالة (Allah), Ligatures, Wasl Hamzas, Dagger Alifs,
 * Quranic Orthography (الرسم العثماني), and Speech-to-Text Dialect/Particle Variations.
 */

// Arabic Diacritics Regex (Tashkeel, Tanween, Shaddah, Sukun, Dagger Alif, Quranic signs)
const TASHKEEL_REGEX = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const TATWEEL_REGEX = /\u0640/g;
const ALLAH_LIGATURE_REGEX = /\uFDF2/g;
const BASMALAH_LIGATURE_REGEX = /\uFDFD/g;
const NON_ARABIC_CHAR_REGEX = /[^\u0621-\u064A\u0671\s0-9]/g;

// Convert Numbers to Arabic Words (STT often converts "أحد" to "1" or "١")
const NUMBER_MAP: Record<string, string> = {
  '0': 'صفر', '٠': 'صفر',
  '1': 'احد', '١': 'احد',
  '2': 'اثنين', '٢': 'اثنين',
  '3': 'ثلاثه', '٣': 'ثلاثه',
  '4': 'اربعه', '٤': 'اربعه',
  '5': 'خمسه', '٥': 'خمسه',
  '6': 'سته', '٦': 'سته',
  '7': 'سبعه', '٧': 'سبعه',
  '8': 'ثمانيه', '٨': 'ثمانيه',
  '9': 'تسعه', '٩': 'تسعه',
  '10': 'عشره', '١٠': 'عشره'
};

// Quranic Orthographic Variants (الرسم العثماني مقابل الإملاء الصوتي القياسي)
const ORTHOGRAPHIC_REPLACEMENTS: [RegExp, string][] = [
  [/صلو[ةه]/g, 'صلاه'],
  [/زكو[ةه]/g, 'زكاه'],
  [/حيو[ةه]/g, 'حياه'],
  [/ربو[ا]/g, 'ربا'],
  [/مشكو[ةه]/g, 'مشكاه'],
  [/نجو[ةه]/g, 'نجاه'],
  [/الغدو[ةه]/g, 'الغداه'],
  [/منو[ةه]/g, 'مناة'],
  [/الرحمٰن|الرحمـٰن|الرحمـن/g, 'الرحمن'],
  [/ايـٰك|ايـك/g, 'اياك'],
  [/مـٰلك|مـلك/g, 'مالك']
];

/**
 * Normalizes raw Arabic / Quranic text for speech recognition comparison
 */
export function normalizeArabicText(text: string): string {
  if (!text) return '';

  let normalized = text;

  // 1. Replace special Islamic Unicode ligatures first
  normalized = normalized.replace(ALLAH_LIGATURE_REGEX, 'الله');
  normalized = normalized.replace(BASMALAH_LIGATURE_REGEX, 'بسم الله الرحمن الرحيم');

  // 2. Remove all Tashkeel / Harakat and Quranic marks
  normalized = normalized.replace(TASHKEEL_REGEX, '');
  normalized = normalized.replace(TATWEEL_REGEX, '');

  // 3. Normalize all forms of Alif (أ, إ, آ, ٱ, ٲ, ٳ, ٴ) to standard 'ا'
  normalized = normalized.replace(/[أإآٱٲٳٴ]/g, 'ا');
  
  // 4. Normalize Taa Marbuta (ة) to Haa (ه)
  normalized = normalized.replace(/ة/g, 'ه');

  // 5. Normalize Alif Maqsura (ى) to Yaa (ي)
  normalized = normalized.replace(/ى/g, 'ي');

  // 6. Normalize Hamzated Waw & Yaa (ؤ, ئ)
  normalized = normalized.replace(/ؤ/g, 'و');
  normalized = normalized.replace(/ئ/g, 'ي');

  // 7. Normalize standalone Hamza (ء) at word endings or middles
  normalized = normalized.replace(/ء/g, 'ا');

  // 8. Apply Quranic orthographic mappings (Uthmani to standard phonetic)
  for (const [pattern, replacement] of ORTHOGRAPHIC_REPLACEMENTS) {
    normalized = normalized.replace(pattern, replacement);
  }

  // 9. Replace digits with Arabic phonetic words (Mobile speech often returns "1" for "أحد")
  normalized = normalized.replace(/[0-9٠-٩]+/g, (match) => {
    return NUMBER_MAP[match] || match;
  });

  // 10. Remove non-Arabic characters & punctuation
  normalized = normalized.replace(NON_ARABIC_CHAR_REGEX, ' ');

  // 11. Collapse multiple spaces into single space
  normalized = normalized.replace(/\s+/g, ' ').trim();

  return normalized;
}

/**
 * Check if word is لفظ الجلالة (Allah) or its various prefixes/derivatives
 */
export function isLafzAlJalalah(word: string): boolean {
  if (!word) return false;
  const norm = normalizeArabicText(word).replace(/\s+/g, '');
  
  const allahForms = new Set([
    'الله',
    'لله',
    'والله',
    'بالله',
    'فالله',
    'تالله',
    'ولله',
    'فلله',
    'اللهم',
    'واللهم',
    'باللهم',
    'اله',
    'الاه',
    'الهنا',
    'الهكم',
    'الهم',
    'رب',
    'ربي',
    'ربنا',
    'ربكم',
    'ربهم',
    'الرب'
  ]);

  if (allahForms.has(norm)) return true;

  // Check prefix forms (e.g. "و" + "الله" or "ل" + "الله")
  if (norm.endsWith('الله') || norm.endsWith('لله') || norm.endsWith('اللهم')) {
    return true;
  }

  return false;
}

/**
 * Splits text into normalized clean words for comparison while preserving original words
 */
export function splitQuranTextIntoWords(quranAyahText: string): { original: string; clean: string }[] {
  if (!quranAyahText) return [];
  
  // Split on whitespace
  const rawWords = quranAyahText.trim().split(/\s+/).filter(w => w.length > 0);
  
  return rawWords.map((raw) => {
    // Remove Quranic ayah markers e.g. ﴿١﴾ or (1)
    const cleanedRaw = raw.replace(/[0-9٠-٩\(\)\[\]\{\}\<\>﴿﴾«»"'\.\,\،\؛\؟\:\-]/g, '').trim();
    return {
      original: raw,
      clean: normalizeArabicText(cleanedRaw)
    };
  }).filter(item => item.clean.length > 0);
}

/**
 * Calculate Levenshtein Distance between two Arabic words
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Calculate similarity ratio between 0 and 1
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const norm1 = normalizeArabicText(str1);
  const norm2 = normalizeArabicText(str2);

  if (norm1 === norm2) return 1.0;
  if (!norm1.length || !norm2.length) return 0.0;

  // Special boost for لفظ الجلالة
  if (isLafzAlJalalah(norm1) && isLafzAlJalalah(norm2)) {
    return 1.0;
  }

  const maxLen = Math.max(norm1.length, norm2.length);
  const distance = levenshteinDistance(norm1, norm2);
  return (maxLen - distance) / maxLen;
}

/**
 * Phonetic letter normalization for common Arabic recitation & dialect variations
 * (e.g. ص <-> س, ض <-> ظ, ذ <-> ز)
 */
function phoneticSimplify(word: string): string {
  return normalizeArabicText(word)
    .replace(/[صسث]/g, 'س')
    .replace(/[ضظذز]/g, 'ز')
    .replace(/[طت]/g, 'ت')
    .replace(/[قكغ]/g, 'ك')
    .replace(/[حخ]/g, 'ح')
    .replace(/[عء]/g, 'ا');
}

/**
 * Checks if a spoken word matches the target Quranic word with high resilience for mobile STT
 */
export function isWordMatch(targetClean: string, spokenClean: string): boolean {
  if (!targetClean || !spokenClean) return false;

  const target = normalizeArabicText(targetClean);
  const spoken = normalizeArabicText(spokenClean);

  // 1. Exact normalized match
  if (target === spoken) return true;

  // 2. SPECIAL HANDLING: لفظ الجلالة (Allah)
  // Handles: "الله", "لله", "والله", "بالله", "فالله", "تالله", "اله", "الاه", "اللهم"
  if (isLafzAlJalalah(target) && isLafzAlJalalah(spoken)) {
    return true;
  }

  // 3. Common Quranic Phonetic & Dagger Alif variations
  // E.g. الرحمن <-> الرحمان, هذا <-> هاذا, ذلك <-> ذالك, الصراط <-> السراط
  if (
    (target === 'الرحمن' && (spoken === 'الرحمان' || spoken === 'رحمن' || spoken === 'رحمان')) ||
    (target === 'الرحيم' && spoken === 'رحيم') ||
    (target === 'هذا' && spoken === 'هاذا') ||
    (target === 'ذلك' && spoken === 'ذالك') ||
    (target === 'الصراط' && (spoken === 'السراط' || spoken === 'صراط' || spoken === 'سراط')) ||
    (target === 'صراط' && (spoken === 'سراط' || spoken === 'الصراط')) ||
    (target === 'احد' && (spoken === 'واحد' || spoken === '١' || spoken === '1')) ||
    (target === 'المغضوب' && (spoken === 'المغظوب' || spoken === 'مغضوب' || spoken === 'مغظوب')) ||
    (target === 'الضالين' && (spoken === 'الظالين' || spoken === 'ضالين' || spoken === 'ظالين')) ||
    (target === 'اياك' && (spoken === 'واياك' || spoken === 'ياك')) ||
    (target === 'واياك' && (spoken === 'اياك' || spoken === 'و اياك')) ||
    (target === 'نعبد' && spoken === 'نعبدو') ||
    (target === 'نستعين' && spoken === 'نستعينو')
  ) {
    return true;
  }

  // 4. Prefix matching for Arabic particles (و, ف, ب, ل, ك, س, ال, وال, فال, بال, لل, كال)
  const prefixes = ['و', 'ف', 'ب', 'ل', 'ك', 'س', 'ال', 'وال', 'فال', 'بال', 'لل', 'كال'];
  for (const prefix of prefixes) {
    if (target.startsWith(prefix) && target.slice(prefix.length) === spoken) {
      return true;
    }
    if (spoken.startsWith(prefix) && spoken.slice(prefix.length) === target) {
      return true;
    }
  }

  // 5. Pronoun & plural suffix matching (ه, ها, هم, هن, نا, كم, كن, ي, ك, ون, ين, ات)
  const suffixes = ['ه', 'ها', 'هم', 'هن', 'نا', 'كم', 'كن', 'ي', 'ك', 'ون', 'ين', 'ان', 'ات', 'وا'];
  for (const suffix of suffixes) {
    if (target.endsWith(suffix) && target.slice(0, -suffix.length) === spoken) {
      return true;
    }
    if (spoken.endsWith(suffix) && spoken.slice(0, -suffix.length) === target) {
      return true;
    }
  }

  // 6. Substring inclusion if word is sufficiently long (>= 4 chars)
  if (target.length >= 4 && spoken.includes(target)) return true;
  if (spoken.length >= 4 && target.includes(spoken)) return true;

  // 7. Phonetically simplified match
  if (phoneticSimplify(target) === phoneticSimplify(spoken)) {
    return true;
  }

  // 8. Levenshtein distance check with length-adaptive tolerance
  const maxLen = Math.max(target.length, spoken.length);
  const dist = levenshteinDistance(target, spoken);

  if (maxLen <= 2) {
    return dist === 0; // Short 2-letter words like "قل", "هو", "في" need exact match
  } else if (maxLen <= 4) {
    return dist <= 1; // 1 typo allowed for 3-4 letter words (e.g. احد / واحد, ملك / مالك)
  } else if (maxLen <= 7) {
    return dist <= 2; // 2 typos allowed for medium words (e.g. العالمين / العالمين)
  } else {
    return dist <= 3; // 3 typos allowed for long words (e.g. المستعرضين / المغضوب)
  }
}

/**
 * Multi-word lookahead matcher for continuous speech
 * In mobile browsers, multiple words are often received in a single chunk (e.g. "بسم الله الرحمن الرحيم")
 */
export function matchSpeechStreamWithAyah(
  targetWords: { original: string; clean: string }[],
  spokenTranscript: string,
  currentIndex: number
): { matchedCount: number; newIndex: number; lastSpoken: string } {
  if (currentIndex >= targetWords.length || !spokenTranscript) {
    return { matchedCount: 0, newIndex: currentIndex, lastSpoken: '' };
  }

  const cleanSpokenWords = spokenTranscript
    .trim()
    .split(/\s+/)
    .map(w => normalizeArabicText(w))
    .filter(w => w.length > 0);

  if (cleanSpokenWords.length === 0) {
    return { matchedCount: 0, newIndex: currentIndex, lastSpoken: '' };
  }

  let matched = 0;
  let targetIdx = currentIndex;
  let lastSpokenWord = '';

  // Iterate through spoken words and attempt forward matching
  for (let sIdx = 0; sIdx < cleanSpokenWords.length; sIdx++) {
    if (targetIdx >= targetWords.length) break;

    const spoken = cleanSpokenWords[sIdx];
    const target = targetWords[targetIdx].clean;

    // Check single word match
    if (isWordMatch(target, spoken)) {
      matched++;
      targetIdx++;
      lastSpokenWord = spoken;
      continue;
    }

    // Check compound word match (e.g. "بسم" + "الله" recited as "بسمالله" or vice versa)
    if (sIdx + 1 < cleanSpokenWords.length) {
      const combinedSpoken = spoken + cleanSpokenWords[sIdx + 1];
      if (isWordMatch(target, combinedSpoken)) {
        matched++;
        targetIdx++;
        sIdx++; // consumed two spoken words
        lastSpokenWord = combinedSpoken;
        continue;
      }
    }

    if (targetIdx + 1 < targetWords.length) {
      const combinedTarget = target + targetWords[targetIdx + 1].clean;
      if (isWordMatch(combinedTarget, spoken)) {
        matched += 2;
        targetIdx += 2; // matched two target words
        lastSpokenWord = spoken;
        continue;
      }
    }

    // Skip ahead by 1 in target if speaker jumped ahead
    if (targetIdx + 1 < targetWords.length && isWordMatch(targetWords[targetIdx + 1].clean, spoken)) {
      matched += 2;
      targetIdx += 2;
      lastSpokenWord = spoken;
      continue;
    }
  }

  return {
    matchedCount: matched,
    newIndex: targetIdx,
    lastSpoken: lastSpokenWord
  };
}
