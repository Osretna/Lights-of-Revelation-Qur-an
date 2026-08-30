import React from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Headphones,
  BookMarked,
  Search,
  Flame,
  Clock,
  Compass,
  CheckCircle2,
  Play,
  ArrowLeft,
  Sparkles,
  MapPin,
  Volume2,
  Calendar,
  Share2,
  Copy,
  ChevronLeft
} from 'lucide-react';
import { useQuran } from '../context/QuranContext';
import { SURAH_LIST } from '../data/surahList';
import { RECITERS_LIST } from '../data/recitersData';
import { playIslamicTone } from '../utils/adhanAudio';
import { CommunityDuasBoard } from './CommunityDuasBoard';
import { GoogleAdBanner } from './GoogleAdBanner';
import { DesignerSignature } from './DesignerSignature';

export const HomeDashboard: React.FC = () => {
  const {
    setActiveTab,
    readingProgress,
    setSelectedSurahNum,
    setSelectedAyahNum,
    activeKhatmah,
    nextPrayer,
    prayerTimes,
    settings,
    playSurahAudio,
    showToast
  } = useQuran();

  const handleContinueReading = () => {
    setSelectedSurahNum(readingProgress.lastSurahNumber);
    setSelectedAyahNum(readingProgress.lastAyahNumber);
    setActiveTab('quran');
  };

  const handleCardClick = (tab: 'quran' | 'audio' | 'tafsir' | 'search' | 'azkar' | 'prayer' | 'qibla' | 'khatmah') => {
    setActiveTab(tab);
  };

  const currentSurahMeta = SURAH_LIST.find(s => s.number === readingProgress.lastSurahNumber) || SURAH_LIST[0];

  // Daily Ayah of the day
  const dailyAyah = {
    surahNumber: 2,
    surahName: 'البقرة',
    ayahNumber: 255,
    text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ',
    meaning: 'آية الكرسي: أعظم آية في كتاب الله تعالى، تبين كمال ألوهيته وعظمته وقيوميته وسعة سلطانه وحفظه للكون.'
  };

  const dailyHadith = {
    text: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ.',
    narrator: 'رواه البخاري عن عثمان بن عفان رضي الله عنه'
  };

  const khatmahPercentage = activeKhatmah
    ? Math.round((activeKhatmah.completedPages.length / 604) * 100)
    : 0;

  const handleCopyAyah = () => {
    navigator.clipboard.writeText(`"${dailyAyah.text}" - [سورة ${dailyAyah.surahName}: آية ${dailyAyah.ayahNumber}]`);
    showToast('تم نسخ آية اليوم إلى الحافظة ✨');
  };

  const prayersList = [
    { key: 'fajr', name: 'الفجر', time: prayerTimes.fajr },
    { key: 'sunrise', name: 'الشروق', time: prayerTimes.sunrise },
    { key: 'dhuhr', name: 'الظهر', time: prayerTimes.dhuhr },
    { key: 'asr', name: 'العصر', time: prayerTimes.asr },
    { key: 'maghrib', name: 'المغرب', time: prayerTimes.maghrib },
    { key: 'isha', name: 'العشاء', time: prayerTimes.isha }
  ];

  return (
    <div className="space-y-6 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      {/* Top Header Greeting & Location */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#063321] border border-[#d4af37]/25 rounded-3xl p-5 sm:p-6 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#d4af37 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#d4af37] tracking-wide">
              السلام عليكم ورحمة الله وبركاته
            </h1>
          </div>
          <p className="text-sm text-[#f5f2ed]/80 mt-1 flex items-center gap-2">
            <span className="font-semibold text-[#d4af37]">{prayerTimes.hijriDate}</span>
            <span className="text-[#d4af37]/60">•</span>
            <span>{new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="flex items-center gap-1.5 bg-[#042118] border border-[#d4af37]/30 px-4 py-2 rounded-full text-xs text-[#f5f2ed] shadow-inner">
            <MapPin className="w-4 h-4 text-[#d4af37]" />
            <span>{settings.locationCity}</span>
          </div>
          <button
            onClick={playIslamicTone}
            className="flex items-center gap-1.5 bg-[#d4af37] hover:bg-[#c19b2e] text-[#042118] font-bold px-4 py-2 rounded-full text-xs shadow-md transition-colors cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>نغمة إسلامية</span>
          </button>
        </div>
      </div>

      {/* Main 12-Column Grid Layout (Hero + Services on Left, Prayer Widget on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Continue Reading Banner & 8 Service Hubs */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Main Continue Reading Luxury Banner */}
          <div className="bg-gradient-to-l from-[#06422b] to-[#042118] border border-[#d4af37]/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative overflow-hidden shadow-xl">
            <div className="z-10 flex-1">
              <span className="bg-[#d4af37] text-[#042118] text-xs font-bold px-3.5 py-1 rounded-full mb-3 inline-block uppercase tracking-wider shadow-sm">
                متابعة القراءة
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#f5f2ed] mb-1">
                سورة {currentSurahMeta.name}
              </h2>
              <p className="text-[#d4af37]/80 text-sm mb-6 font-medium">
                وصلت إلى الآية {readingProgress.lastAyahNumber} • الجزء {readingProgress.lastJuzNumber} (صفحة {readingProgress.lastPageNumber})
              </p>
              <button
                id="home-continue-quran-btn"
                onClick={handleContinueReading}
                className="flex items-center gap-3 bg-[#f5f2ed] hover:bg-white text-[#042118] px-8 py-3.5 rounded-xl font-bold shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer text-sm sm:text-base"
              >
                <Play className="w-5 h-5 fill-[#042118]" />
                <span>إكمال القراءة</span>
              </button>
            </div>

            {/* Circular Progress Gauge */}
            <div className="relative z-10 flex flex-col items-center gap-2 self-center sm:self-auto">
              <div className="w-32 h-32 rounded-full border-4 border-[#d4af37]/20 flex items-center justify-center relative bg-[#042118]/60 shadow-inner">
                <svg className="absolute inset-0 transform -rotate-90 w-full h-full p-1" viewBox="0 0 128 128">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="#d4af37"
                    strokeWidth="8"
                    strokeDasharray="351"
                    strokeDashoffset={351 - (351 * khatmahPercentage) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-3xl font-serif font-bold text-[#d4af37]">{khatmahPercentage}%</span>
              </div>
              <span className="text-xs font-semibold text-[#f5f2ed]/70">إنجاز الختمة</span>
            </div>

            {/* Decorative Islamic geometry watermark */}
            <div className="absolute -left-10 -bottom-10 opacity-10 pointer-events-none">
              <svg width="240" height="240" viewBox="0 0 100 100" fill="#d4af37">
                <path d="M50 0L61.2 38.8H100L68.8 61.2L80 100L50 77.6L20 100L31.2 61.2L0 38.8H38.8L50 0Z" />
              </svg>
            </div>
          </div>

          {/* 8 Primary Service Action Cards (Grid 4x2) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
            {/* 1. Quran */}
            <div
              id="home-card-quran"
              onClick={() => handleCardClick('quran')}
              className="bg-[#063321] border border-[#d4af37]/15 rounded-2xl p-5 flex flex-col items-center justify-center gap-2.5 hover:border-[#d4af37]/60 hover:bg-[#084d32] cursor-pointer transition-all group shadow-sm text-center"
            >
              <div className="w-13 h-13 bg-[#084d32] rounded-full flex items-center justify-center text-[#d4af37] group-hover:scale-110 group-hover:bg-[#d4af37] group-hover:text-[#042118] transition-all shadow-md">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-[#f5f2ed] group-hover:text-[#d4af37] transition-colors">القرآن الكريم</span>
            </div>

            {/* 2. Audio Recitations */}
            <div
              id="home-card-audio"
              onClick={() => handleCardClick('audio')}
              className="bg-[#063321] border border-[#d4af37]/15 rounded-2xl p-5 flex flex-col items-center justify-center gap-2.5 hover:border-[#d4af37]/60 hover:bg-[#084d32] cursor-pointer transition-all group shadow-sm text-center"
            >
              <div className="w-13 h-13 bg-[#084d32] rounded-full flex items-center justify-center text-[#d4af37] group-hover:scale-110 group-hover:bg-[#d4af37] group-hover:text-[#042118] transition-all shadow-md">
                <Headphones className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-[#f5f2ed] group-hover:text-[#d4af37] transition-colors">التلاوات</span>
            </div>

            {/* 3. Tafsir */}
            <div
              id="home-card-tafsir"
              onClick={() => handleCardClick('tafsir')}
              className="bg-[#063321] border border-[#d4af37]/15 rounded-2xl p-5 flex flex-col items-center justify-center gap-2.5 hover:border-[#d4af37]/60 hover:bg-[#084d32] cursor-pointer transition-all group shadow-sm text-center"
            >
              <div className="w-13 h-13 bg-[#084d32] rounded-full flex items-center justify-center text-[#d4af37] group-hover:scale-110 group-hover:bg-[#d4af37] group-hover:text-[#042118] transition-all shadow-md">
                <BookMarked className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-[#f5f2ed] group-hover:text-[#d4af37] transition-colors">التفاسير</span>
            </div>

            {/* 4. Azkar */}
            <div
              id="home-card-azkar"
              onClick={() => handleCardClick('azkar')}
              className="bg-[#063321] border border-[#d4af37]/15 rounded-2xl p-5 flex flex-col items-center justify-center gap-2.5 hover:border-[#d4af37]/60 hover:bg-[#084d32] cursor-pointer transition-all group shadow-sm text-center"
            >
              <div className="w-13 h-13 bg-[#084d32] rounded-full flex items-center justify-center text-[#d4af37] group-hover:scale-110 group-hover:bg-[#d4af37] group-hover:text-[#042118] transition-all shadow-md">
                <Flame className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-[#f5f2ed] group-hover:text-[#d4af37] transition-colors">الأذكار</span>
            </div>

            {/* 5. Prayer Times */}
            <div
              id="home-card-prayer"
              onClick={() => handleCardClick('prayer')}
              className="bg-[#063321] border border-[#d4af37]/15 rounded-2xl p-5 flex flex-col items-center justify-center gap-2.5 hover:border-[#d4af37]/60 hover:bg-[#084d32] cursor-pointer transition-all group shadow-sm text-center"
            >
              <div className="w-13 h-13 bg-[#084d32] rounded-full flex items-center justify-center text-[#d4af37] group-hover:scale-110 group-hover:bg-[#d4af37] group-hover:text-[#042118] transition-all shadow-md">
                <Clock className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-[#f5f2ed] group-hover:text-[#d4af37] transition-colors">أوقات الصلاة</span>
            </div>

            {/* 6. Qibla */}
            <div
              id="home-card-qibla"
              onClick={() => handleCardClick('qibla')}
              className="bg-[#063321] border border-[#d4af37]/15 rounded-2xl p-5 flex flex-col items-center justify-center gap-2.5 hover:border-[#d4af37]/60 hover:bg-[#084d32] cursor-pointer transition-all group shadow-sm text-center"
            >
              <div className="w-13 h-13 bg-[#084d32] rounded-full flex items-center justify-center text-[#d4af37] group-hover:scale-110 group-hover:bg-[#d4af37] group-hover:text-[#042118] transition-all shadow-md">
                <Compass className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-[#f5f2ed] group-hover:text-[#d4af37] transition-colors">القبلة</span>
            </div>

            {/* 7. Search */}
            <div
              id="home-card-search"
              onClick={() => handleCardClick('search')}
              className="bg-[#063321] border border-[#d4af37]/15 rounded-2xl p-5 flex flex-col items-center justify-center gap-2.5 hover:border-[#d4af37]/60 hover:bg-[#084d32] cursor-pointer transition-all group shadow-sm text-center"
            >
              <div className="w-13 h-13 bg-[#084d32] rounded-full flex items-center justify-center text-[#d4af37] group-hover:scale-110 group-hover:bg-[#d4af37] group-hover:text-[#042118] transition-all shadow-md">
                <Search className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-[#f5f2ed] group-hover:text-[#d4af37] transition-colors">البحث</span>
            </div>

            {/* 8. Khatmah */}
            <div
              id="home-card-khatmah"
              onClick={() => handleCardClick('khatmah')}
              className="bg-[#063321] border border-[#d4af37]/15 rounded-2xl p-5 flex flex-col items-center justify-center gap-2.5 hover:border-[#d4af37]/60 hover:bg-[#084d32] cursor-pointer transition-all group shadow-sm text-center"
            >
              <div className="w-13 h-13 bg-[#084d32] rounded-full flex items-center justify-center text-[#d4af37] group-hover:scale-110 group-hover:bg-[#d4af37] group-hover:text-[#042118] transition-all shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-[#f5f2ed] group-hover:text-[#d4af37] transition-colors">الختمة</span>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Professional Polish Contrasting Prayer Times Card */}
        <div className="lg:col-span-4 bg-[#f5f2ed] rounded-3xl p-6 sm:p-7 flex flex-col text-[#042118] border-4 border-[#d4af37] shadow-2xl justify-between">
          <div>
            <div className="flex justify-between items-center mb-5 border-b border-[#042118]/10 pb-3">
              <h3 className="text-xl font-bold font-serif text-[#042118]">مواقيت الصلاة</h3>
              <span className="text-xs font-bold text-[#042118]/70 bg-[#042118]/10 px-3 py-1 rounded-full">
                {settings.locationCity}
              </span>
            </div>

            {/* Prayer Times Row List */}
            <div className="space-y-2.5 mb-5">
              {prayersList.map(p => {
                const isNext = nextPrayer.nameArabic === p.name;
                return (
                  <div
                    key={p.key}
                    className={`flex justify-between items-center p-3 rounded-xl transition-all ${
                      isNext
                        ? 'bg-[#063321] text-[#f5f2ed] ring-4 ring-[#d4af37]/40 font-bold shadow-md'
                        : 'bg-white text-[#042118] shadow-xs'
                    }`}
                  >
                    <span className="text-sm">{p.name}</span>
                    <span className={`text-base font-mono font-bold ${isNext ? 'text-[#d4af37]' : 'text-[#042118]'}`}>
                      {p.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next Prayer Countdown Callout */}
          <div className="bg-[#042118] rounded-2xl p-5 text-white flex flex-col items-center justify-center text-center shadow-lg border border-[#d4af37]/30 mt-2">
            <span className="text-[#d4af37] text-xs font-bold uppercase mb-1 tracking-widest">الصلاة القادمة</span>
            <span className="text-2xl font-serif font-bold text-[#f5f2ed] mb-1">صلاة {nextPrayer.nameArabic}</span>
            <span className="text-xl font-mono font-bold text-[#d4af37]">{nextPrayer.formattedCountdown}</span>
            <p className="text-[11px] text-[#f5f2ed]/60 mt-1">متبقي على رفع الأذان المبارك</p>
          </div>
        </div>
      </div>

      {/* Daily Ayah & Hadith Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 pt-2">
        {/* Ayah of the day */}
        <div className="bg-[#063321] border border-[#d4af37]/25 rounded-3xl p-6 shadow-md relative overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#d4af37]" />
              <span className="text-sm font-bold text-[#d4af37]">
                آية اليوم وتدبرها
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyAyah}
                title="نسخ الآية"
                className="p-2 rounded-lg bg-[#084d32] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#042118] transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => playSurahAudio(2)}
                title="تشغيل التلاوة"
                className="p-2 rounded-lg bg-[#d4af37] text-[#042118] hover:bg-[#c19b2e] transition-colors"
              >
                <Play className="w-4 h-4 fill-[#042118]" />
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#042118] border border-[#d4af37]/20 mb-3 text-center">
            <p className="font-quran text-xl sm:text-2xl text-[#f5f2ed] leading-loose">
              "{dailyAyah.text}"
            </p>
            <p className="text-xs text-[#d4af37] mt-3 font-semibold">
              [ سورة {dailyAyah.surahName} - آية {dailyAyah.ayahNumber} ]
            </p>
          </div>

          <p className="text-xs text-[#f5f2ed]/80 leading-relaxed">
            <strong className="text-[#d4af37]">التفسير الميسر: </strong>
            {dailyAyah.meaning}
          </p>
        </div>

        {/* Hadith of the day */}
        <div className="bg-[#063321] border border-[#d4af37]/25 rounded-3xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-[#d4af37]" />
              <span className="text-sm font-bold text-[#d4af37]">
                حديث نبوي شريف
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#042118] border border-[#d4af37]/20 mb-3 text-center">
              <p className="font-quran text-xl sm:text-2xl text-[#f5f2ed] leading-relaxed">
                "{dailyHadith.text}"
              </p>
              <p className="text-xs text-[#d4af37]/90 mt-3 font-medium">
                {dailyHadith.narrator}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 text-xs text-[#f5f2ed]/70 border-t border-[#d4af37]/20">
            <span>تطبيق أنوار الوحي للقرآن الكريم</span>
            <button
              onClick={() => setActiveTab('quran')}
              className="text-[#d4af37] font-bold hover:underline flex items-center gap-1"
            >
              <span>ابدأ التلاوة المباركة</span>
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>

      {/* Famous Reciters Quick Carousel */}
      <div className="bg-[#063321] border border-[#d4af37]/25 rounded-3xl p-6 shadow-md">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <Headphones className="w-5 h-5 text-[#d4af37]" />
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#f5f2ed]">
              مشاهير القراء في التطبيق
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('audio')}
            className="text-xs text-[#d4af37] font-bold hover:underline flex items-center gap-1"
          >
            <span>عرض كل القراء</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {RECITERS_LIST.slice(0, 6).map(reciter => (
            <button
              key={reciter.id}
              onClick={() => {
                setActiveTab('audio');
                playSurahAudio(1, reciter.id);
              }}
              className="p-4 rounded-2xl bg-[#042118] border border-[#d4af37]/20 hover:border-[#d4af37] transition-all text-center group cursor-pointer"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-[#084d32] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] font-bold text-sm mb-2 group-hover:scale-110 group-hover:bg-[#d4af37] group-hover:text-[#042118] transition-all">
                <Headphones className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-[#f5f2ed] truncate group-hover:text-[#d4af37] transition-colors">
                {reciter.name}
              </h4>
              <span className="text-[10px] text-[#d4af37]/70 block mt-0.5">
                {reciter.style}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Halal Google AdSense / Islamic Sponsor Banner */}
      <GoogleAdBanner format="horizontal" placementName="الرئيسية" />

      {/* Real-time Firebase Community Duas Board */}
      <CommunityDuasBoard />

      {/* Official Architect & Lead Engineer Signature with 6-Spectrum Illumination */}
      <DesignerSignature variant="card" />
    </div>
  );
};
