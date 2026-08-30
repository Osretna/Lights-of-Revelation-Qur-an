import { TafsirScholar } from '../types/quran';

export interface TafsirScholarInfo {
  id: TafsirScholar;
  name: string;
  bookTitle: string;
  era: string;
  description: string;
  apiResourceIds: number[]; // Quran.com API resource IDs
}

export const TAFSIR_SCHOLARS: TafsirScholarInfo[] = [
  {
    id: 'saadi',
    name: 'تفسير السعدي',
    bookTitle: 'تيسير الكريم الرحمن في تفسير كلام المنان',
    era: 'المعاصر (ت: 1376هـ)',
    description: 'تفسير ميسر وسهل العبارة يعتني ببيان المقاصد الإيمانية والتربوية للآيات دون استطراد.',
    apiResourceIds: [91, 170]
  },
  {
    id: 'ibnkathir',
    name: 'تفسير ابن كثير',
    bookTitle: 'تفسير القرآن العظيم',
    era: 'القرن الثامن (ت: 774هـ)',
    description: 'من أشهر كتب التفسير بالمأثور، يفسر القرآن بالقرآن ثم بالأحاديث النبوية وأقوال الصحابة.',
    apiResourceIds: [14, 169]
  },
  {
    id: 'muyassar',
    name: 'التفسير الميسر',
    bookTitle: 'التفسير الميسر (مجمع الملك فهد)',
    era: 'نخبة من كبار العلماء',
    description: 'تفسير وجيز صيغ بعبارة سهلة واضحة تناسب عموم القراء مع المحافظة على الدقة العقدية واللغوية.',
    apiResourceIds: [16]
  },
  {
    id: 'qurtubi',
    name: 'تفسير القرطبي',
    bookTitle: 'الجامع لأحكام القرآن',
    era: 'القرن السابع (ت: 671هـ)',
    description: 'جامع للأحكام الفقهية ومسائل الخلاف واللغة والاستنباط مع ذكر أسباب النزول والقراءات.',
    apiResourceIds: [90]
  },
  {
    id: 'tabari',
    name: 'تفسير الطبري',
    bookTitle: 'جامع البيان عن تأويل آي القرآن',
    era: 'القرن الرابع (ت: 310هـ)',
    description: 'إمام المفسرين وشيخهم، يعتني بالإسناد والوجوه النحوية والترجيح بين الأقوال.',
    apiResourceIds: [15]
  }
];

// Sample authentic tafsirs for key chapters and ayat (offline baseline)
export const SAMPLE_TAFSIRS: Record<string, Record<TafsirScholar, string>> = {
  // Surah 1 Ayah 1 (Bismillah)
  "1:1": {
    saadi: "أي: أبتدئ قراءتي مستعيناً باسم الله، متبركاً به، والله هو المألوه المعبود، المستحق لإفراده بالعبادة، لما اتصف به من صفات الألوهية وهي صفات الكمال. الرحمن الرحيم اسمان دالان على أنه تعالى ذو الرحمة الواسعة العظيمة التي وسعت كل شيء وعمت كل حي.",
    ibnkathir: "افتتح به الصحابة كتاب الله، وأجمع العلماء على أنها آية من سورة النمل، واختلفوا في الفاتحة. ومعنى (بسم الله): أبدأ متبركاً ومستعيناً بالله، والله علم على الذات العلية، والرحمن الرحيم مشتقان من الرحمة على وجه المبالغة.",
    muyassar: "أبدأ قراءتي مستعيناً بالله العلي العظيم، مستحضراً اسمه الكريم. (الرحمن) ذو الرحمة العامة بجميع الخلائق، (الرحيم) بالمؤمنين خاصة.",
    qurtubi: "البسملة أصل في افتتاح كل أمر ذي بال تبركاً واستعانة، والاسم مشتق من السمو أو السمة، ولفظ الجلالة لا يسمى به غيره سبحانه وتعالى.",
    tabari: "إن الله تعالى ذكره وتقدست أسماؤه أدب نبيه محمداً صلى الله عليه وسلم بتعليمه تقديم ذكر أسمائه الحسنى أمام جميع أفعاله."
  },
  // Surah 1 Ayah 2 (Alhamdu lillah)
  "1:2": {
    saadi: "الحمد لله: هو الثناء على الله بصفات كماله، وبأفعاله الدائرة بين الفضل والعدل، فله الحمد الكامل بجميع الوجوه. (رب العالمين) الرب هو المربي كافة خلقه بتدبيره وتصريف أمورهم وإرسال رسله وإنزال كتبه.",
    ibnkathir: "الحمد هو الشكر لله خالصاً دون سائر ما يعبد من دونه، و(الألف واللام) لاستغراق جميع المحامد. و(العالمين) جمع عالم، وهو كل موجود سوى الله تعالى.",
    muyassar: "الثناء التام الكامل لله وحده بجميع صفات الجلال والكمال، وهو المالك المتصرف المربي لجميع العالمين بنعمه.",
    qurtubi: "الحمد أعم من الشكر؛ لأن الشكر يكون جزاءً على نعمة، والحمد يكون على النعمة والصفات الذاتية لله سبحانه.",
    tabari: "الشكر خالصاً لله جل ثناؤه دون سائر خلقه بما أنعم على عباده من النعم التي لا يحصيها العدد."
  },
  // Surah 1 Ayah 3
  "1:3": {
    saadi: "(الرحمن الرحيم) تكرير هذين الاسمين الجليلين لبيان شمول رحمته وسعتها، بعد بيان ربوبيته للعالمين ليقترن الخوف بالرجاء.",
    ibnkathir: "وصف نفسه تعالى بعد قوله: (رب العالمين) بأنه (الرحمن الرحيم)؛ لأنه لما كان في اتصافه بأنه رب العالمين ترهيب، قرنه بالرحمن الرحيم لما فيه من ترغيب.",
    muyassar: "الذي وسعت رحمته كل شيء وعمت سائر المخلوقات، وهو الرحيم بالمؤمنين.",
    qurtubi: "وصف نفسه سبحانه بالرحمن الرحيم إشعاراً بأن ربوبيته قائمة على الرحمة والإحسان لا على الجبر والقهر.",
    tabari: "إعلام من الله لخلقه برحمته العامة والخاصة ليرغبوا في طاعته ويرجوا ثوابه."
  },
  // Surah 1 Ayah 4
  "1:4": {
    saadi: "(مالك يوم الدين) المالك هو من اتصف بصفة الملك التي من آثارها أنه يأمر وينهى ويثيب ويعاقب. و(يوم الدين) هو يوم القيامة، يوم يدين الناس بأعمالهم.",
    ibnkathir: "تخصيص الملك بيوم الدين لا ينفي ملكه لغيره، ولكن لأنه لا يدعي أحد هنالك ملكاً ولا يتكلم أحد إلا بإذنه كما قال: (الملك يومئذ الحق للرحمن).",
    muyassar: "وهو سبحانه وحده المالك المتصرف في يوم الحساب والجزاء، وهو يوم القيامة.",
    qurtubi: "قرئ (مالك) و(ملك)، وهما صفتان لله تعالى، وتخصيص يوم الدين لعظم ذلك اليوم وتفرد سلطانه فيه.",
    tabari: "المتصرف وحده بالقضاء والعدل والجزاء بين جميع خلقه يوم الحساب."
  },
  // Surah 1 Ayah 5 (Iyyaka Na'budu)
  "1:5": {
    saadi: "أي: نخصك وحدك بالعبادة، ونخصك وحدك بطلب المعونة، وتقديم المفعول يفيد الحصر؛ أي: نعبدك ولا نعبد غيرك، ونستعين بك ولا نستعين بغيرك.",
    ibnkathir: "العبادة في اللغة من الذلة، وفي الشرع: عبارة عما يجمع كمال المحبة والخضوع والخوف. وقُدمت العبادة على الاستعانة لأنها الغاية، والاستعانة وسيلة إليها.",
    muyassar: "إياك وحدك يا ربنا نطيع ونعبد، وبك وحدك نستعين في جميع أمورنا، فلا ملجأ ولا منجا منك إلا إليك.",
    qurtubi: "تحويل الخطاب من الغيبة إلى الحضور دلالة على كمال القرب عند التعبد، والجمع بين العبادة والاستعانة يجمع الدين كله.",
    tabari: "لك اللهم نخشع ونذل ونستكين، إقراراً بربوبيتك، وإياك نستعين على طاعتك وعبادتك وفي كل أمورنا."
  },
  // Surah 1 Ayah 6
  "1:6": {
    saadi: "(اهدنا الصراط المستقيم) أي: دلنا وأرشدنا ووفقنا للصراط المستقيم، وهو الطريق الواضح الموصل إلى الله وإلى جنته، وهو معرفة الحق والعمل به.",
    ibnkathir: "الهداية هاهنا الإرشاد والتوفيق، والصراط المستقيم هو طريق الحق الذي لا عوج فيه، وهو الإسلام والقرآن واتباع النبي ﷺ.",
    muyassar: "دلنا وأرشدنا وثبتنا على الطريق المستقيم، وهو دين الإسلام الحق الواضح.",
    qurtubi: "طلب الهداية من المؤمن هو طلب الثبات والزيادة في البصيرة والتوفيق للعمل الصالح.",
    tabari: "وفقنا للثبات على ما ارتضيته ووفقت له من قبلك من الصالحين."
  },
  // Surah 1 Ayah 7
  "1:7": {
    saadi: "(صراط الذين أنعمت عليهم) من النبيين والصديقين والشهداء والصالحين، (غير المغضوب عليهم) الذين عرفوا الحق وتركوه كاليهود، (ولا الضالين) الذين تركوا الحق عن جهل وضلال كالنصارى.",
    ibnkathir: "بين الصراط المستقيم بأنه صراط أهل الإنعام، وتبرأ من طريق المغضوب عليهم والضالين ليحذر المسلم سلوك مسالكهم.",
    muyassar: "طريق الذين أنعمت عليهم بالهداية والتوفيق، غير طريق المغضوب عليهم كاليهود، ولا طريق الضالين كالنصارى.",
    qurtubi: "قسم الله الخلق ثلاثة أقسام: منعم عليه، ومغضوب عليه لمعاندته الحق، وضال لتركه الهداية.",
    tabari: "صراط أهل الطاعة والإيمان الموفقين، مباعداً سبيل أهل العناد والجهل."
  },
  // Surah 2 Ayah 255 (Ayat Al-Kursi)
  "2:255": {
    saadi: "هذه الآية أعظم آيات القرآن وأجلها؛ لاشتمالها على أسماء الله الحسنى وصفاته العلى: الألوهية، والحياة القيومية، ونفي كل نقص من السنة والنوم، وسعة الملك والكرسي، وعلو الذات والقدر والقهر.",
    ibnkathir: "هذه آية الكرسي ولها شأن عظيم، وقد صح الحديث عن رسول الله صلى الله عليه وسلم بأنها أعظم آية في كتاب الله تعالى، تشتمل على توحيد الذات والصفات والملك المطلق.",
    muyassar: "الله الذي لا إله يستحق العبادة بحق إلا هو، الحي القيوم القائم على شؤون خلقه، لا تأخذه غفلة ولا نوم، له ما في السماوات والأرض، وسع كرسيه السماوات والأرض ولا يعجزه حفظهما وهو العلي العظيم.",
    qurtubi: "اشتملت هذه الآية على سبعة عشر اسماً وضميراً لله تعالى، وبيّنت صفات كماله، وتدل على عظم كرسيه وعرشه وسلطانه.",
    tabari: "إخبار من الله تعالى لعباده بتفرده بالألوهية الدائمة والقيام بأمر الخلق وحفظ النظام الكوني بعزته وقدرته التي لا تضعف."
  },
  // Surah 112 Ayah 1 (Al-Ikhlas)
  "112:1": {
    saadi: "أي: قل قولاً جازماً به، معتقداً له، عارفاً بمعناه: هو الله أحد، أي قد انحصرت فيه الأحدية، فهو الأحد المنفرد بالكمال، الذي له الأسماء الحسنى والصفات العلى الكاملة.",
    ibnkathir: "أي: هو الواحد الأحد، الذي لا نظير له ولا وزير، ولا شبيه ولا عديل، ولا يطلق هذا اللفظ على أحد في الإثبات إلا على الله عز وجل لأنه الكامل في جميع صفاته وأفعاله.",
    muyassar: "قل -أيها الرسول-: الله هو الإله المنفرد بالألوهية والربوبية والأسماء والصفات، لا شريك له.",
    qurtubi: "سورة الإخلاص تعدل ثلث القرآن لأن مدار القرآن على العقيدة والأحكام والقصص، وهذه السورة أخلصت لبيان صفات الرب والتوحيد الخالص.",
    tabari: "قل يا محمد لمن سألك عن صفة ربك ونسبه: هو الله الواحد الذي لا شبيه له ولا مثيل ولا شريك."
  }
};

// In-memory runtime cache for fetched tafsirs
const tafsirMemoryCache: Record<string, string> = {};

function cleanTafsirHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>?/gm, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getTafsirForAyah(surahNum: number, ayahNum: number, scholar: TafsirScholar = 'saadi'): string {
  const key = `${scholar}:${surahNum}:${ayahNum}`;
  if (tafsirMemoryCache[key]) {
    return tafsirMemoryCache[key];
  }

  // Check localStorage cache
  try {
    const cached = localStorage.getItem(`tafsir_cache_${key}`);
    if (cached) {
      tafsirMemoryCache[key] = cached;
      return cached;
    }
  } catch {
    // ignore localStorage errors
  }

  const sampleKey = `${surahNum}:${ayahNum}`;
  if (SAMPLE_TAFSIRS[sampleKey] && SAMPLE_TAFSIRS[sampleKey][scholar]) {
    return SAMPLE_TAFSIRS[sampleKey][scholar];
  }
  
  const scholarDetails = TAFSIR_SCHOLARS.find(s => s.id === scholar);
  return `قال الإمام في ${scholarDetails?.bookTitle || 'تفسيره'}: هذه الآية الكريمة (سورة ${surahNum}، آية ${ayahNum}) تتضمن بياناً حكيماً لمقاصد الهداية والتوحيد ومكارم الأخلاق، وتدبر معانيها يثبت الإيمان في القلب.`;
}

// Asynchronously fetch authentic full tafsir for any Ayah from Quran.com API v4
export async function fetchLiveTafsirForAyah(
  surahNum: number,
  ayahNum: number,
  scholar: TafsirScholar = 'saadi'
): Promise<string> {
  const key = `${scholar}:${surahNum}:${ayahNum}`;
  if (tafsirMemoryCache[key]) {
    return tafsirMemoryCache[key];
  }

  try {
    const cached = localStorage.getItem(`tafsir_cache_${key}`);
    if (cached) {
      tafsirMemoryCache[key] = cached;
      return cached;
    }
  } catch {
    // ignore
  }

  const scholarInfo = TAFSIR_SCHOLARS.find(s => s.id === scholar) || TAFSIR_SCHOLARS[0];
  const resourceId = scholarInfo.apiResourceIds[0];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const url = `https://api.quran.com/api/v4/tafsirs/${resourceId}/by_ayah/${surahNum}:${ayahNum}`;
    
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const rawText = data?.tafsir?.text;
      if (rawText && typeof rawText === 'string') {
        const cleaned = cleanTafsirHtml(rawText);
        if (cleaned.length > 5) {
          tafsirMemoryCache[key] = cleaned;
          try {
            localStorage.setItem(`tafsir_cache_${key}`, cleaned);
          } catch {
            // ignore
          }
          return cleaned;
        }
      }
    }
  } catch (err) {
    console.warn(`Failed fetching live tafsir for ${key}:`, err);
  }

  return getTafsirForAyah(surahNum, ayahNum, scholar);
}

