import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Play,
  Pause,
  Headphones,
  BookMarked,
  Bookmark,
  Copy,
  Share2,
  ZoomIn,
  ZoomOut,
  ChevronRight,
  ChevronLeft,
  Search,
  Sparkles,
  SlidersHorizontal,
  Volume2,
  Check
} from 'lucide-react';
import { useQuran } from '../context/QuranContext';
import { SURAH_LIST, JUZ_LIST } from '../data/surahList';
import { getSurahDetail, BISMILLAH_TEXT } from '../data/quranSampleData';
import { SurahDetail, Ayah } from '../types/quran';

export const QuranReader: React.FC = () => {
  const {
    selectedSurahNum,
    setSelectedSurahNum,
    selectedAyahNum,
    setSelectedAyahNum,
    saveReadingProgress,
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    audioState,
    playAyahAudio,
    playSurahAudio,
    pauseAudio,
    resumeAudio,
    settings,
    updateSettings,
    setSelectedAyahDetail,
    showToast
  } = useQuran();

  const [surahData, setSurahData] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'surah' | 'juz' | 'page'>('surah');
  const [showSurahPicker, setShowSurahPicker] = useState<boolean>(false);
  const [showAppearanceMenu, setShowAppearanceMenu] = useState<boolean>(false);
  const [surahFilter, setSurahFilter] = useState<string>('');
  const [activeAyahHover, setActiveAyahHover] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const ayahRefs = useRef<Record<number, HTMLSpanElement | null>>({});

  // Load current Surah details
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getSurahDetail(selectedSurahNum)
      .then(detail => {
        if (isMounted) {
          setSurahData(detail);
          setLoading(false);
          // Save reading progress
          saveReadingProgress(
            detail.number,
            selectedAyahNum || 1,
            detail.startPage,
            detail.startJuz
          );
        }
      })
      .catch(err => {
        console.error('Failed to load Surah detail', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedSurahNum]);

  // Scroll active ayah into view if playing or selected
  useEffect(() => {
    if (settings.autoScrollAyah && audioState.isPlaying && audioState.surahNumber === selectedSurahNum) {
      const el = ayahRefs.current[audioState.ayahNumber];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [audioState.ayahNumber, audioState.isPlaying, selectedSurahNum, settings.autoScrollAyah]);

  const handleNextSurah = () => {
    if (selectedSurahNum < 114) {
      setSelectedSurahNum(selectedSurahNum + 1);
      setSelectedAyahNum(1);
    }
  };

  const handlePrevSurah = () => {
    if (selectedSurahNum > 1) {
      setSelectedSurahNum(selectedSurahNum - 1);
      setSelectedAyahNum(1);
    }
  };

  const handleAyahClick = (ayah: Ayah) => {
    setSelectedAyahNum(ayah.numberInSurah);
    if (surahData) {
      saveReadingProgress(surahData.number, ayah.numberInSurah, ayah.page, ayah.juz);
    }
  };

  const handleOpenAyahTafsir = (ayah: Ayah) => {
    if (surahData) {
      setSelectedAyahDetail({
        surahNum: surahData.number,
        ayah,
        surahMeta: surahData
      });
    }
  };

  const handleToggleBookmark = (ayah: Ayah) => {
    if (!surahData) return;
    if (isBookmarked(surahData.number, ayah.numberInSurah)) {
      const existing = bookmarks.find(b => b.surahNumber === surahData.number && b.ayahNumberInSurah === ayah.numberInSurah);
      if (existing) removeBookmark(existing.id);
    } else {
      addBookmark({
        surahNumber: surahData.number,
        surahName: surahData.name,
        ayahNumberInSurah: ayah.numberInSurah,
        ayahGlobalNumber: ayah.number,
        page: ayah.page,
        juz: ayah.juz,
        textPreview: ayah.text
      });
    }
  };

  const handleCopyAyah = (ayah: Ayah) => {
    if (!surahData) return;
    navigator.clipboard.writeText(`﴿${ayah.text}﴾ [سورة ${surahData.name}: ${ayah.numberInSurah}]`);
    showToast(`تم نسخ الآية (${ayah.numberInSurah}) إلى الحافظة 📋`);
  };

  const filteredSurahs = SURAH_LIST.filter(s =>
    s.name.includes(surahFilter) ||
    s.englishName.toLowerCase().includes(surahFilter.toLowerCase()) ||
    s.number.toString().includes(surahFilter)
  );

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 pb-28 space-y-4">
      {/* Top Reader Controls Bar */}
      <div className="bg-white dark:bg-emerald-950 border border-slate-200 dark:border-amber-500/20 rounded-2xl p-3 sm:p-4 shadow-sm flex flex-wrap items-center justify-between gap-2.5 backdrop-blur-md">
        {/* Left: Surah / Juz Selector Button */}
        <div className="flex items-center gap-2">
          <button
            id="quran-surah-picker-btn"
            onClick={() => setShowSurahPicker(true)}
            className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-amber-500/30 text-emerald-950 dark:text-amber-200 px-3.5 py-2 rounded-xl text-sm font-bold shadow-sm transition-all"
          >
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>سورة {surahData ? surahData.name : 'اختر السورة'}</span>
            <span className="text-[11px] bg-amber-500/20 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded">
              {surahData?.revelationType}
            </span>
          </button>

          {/* Prev / Next Surah Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevSurah}
              disabled={selectedSurahNum <= 1}
              title="السورة السابقة"
              className="p-2 rounded-xl bg-slate-100 dark:bg-emerald-900/40 text-slate-700 dark:text-amber-200 disabled:opacity-30 hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextSurah}
              disabled={selectedSurahNum >= 114}
              title="السورة التالية"
              className="p-2 rounded-xl bg-slate-100 dark:bg-emerald-900/40 text-slate-700 dark:text-amber-200 disabled:opacity-30 hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: View Mode Tabs */}
        <div className="flex items-center bg-slate-100 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setViewMode('surah')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              viewMode === 'surah'
                ? 'bg-amber-500 text-emerald-950 font-bold shadow-xs'
                : 'text-slate-600 dark:text-amber-200/70 hover:text-slate-900'
            }`}
          >
            بالسور
          </button>
          <button
            onClick={() => setViewMode('juz')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              viewMode === 'juz'
                ? 'bg-amber-500 text-emerald-950 font-bold shadow-xs'
                : 'text-slate-600 dark:text-amber-200/70 hover:text-slate-900'
            }`}
          >
            بالأجزاء
          </button>
          <button
            onClick={() => setViewMode('page')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              viewMode === 'page'
                ? 'bg-amber-500 text-emerald-950 font-bold shadow-xs'
                : 'text-slate-600 dark:text-amber-200/70 hover:text-slate-900'
            }`}
          >
            الصفحات
          </button>
        </div>

        {/* Right: Text Size & Appearance Customizer */}
        <div className="flex items-center gap-1.5">
          {/* Zoom controls */}
          <button
            onClick={() => updateSettings({ fontSize: Math.min(46, settings.fontSize + 2) })}
            title="تكبير حجم الخط"
            className="p-2 rounded-xl bg-slate-100 dark:bg-emerald-900/40 text-slate-700 dark:text-amber-200 hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => updateSettings({ fontSize: Math.max(18, settings.fontSize - 2) })}
            title="تصغير حجم الخط"
            className="p-2 rounded-xl bg-slate-100 dark:bg-emerald-900/40 text-slate-700 dark:text-amber-200 hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Full Surah Audio Player */}
          <button
            id="quran-play-surah-btn"
            onClick={() => playSurahAudio(selectedSurahNum)}
            title="استماع للسورة كاملة"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 text-xs font-bold shadow-sm gold-glow transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-emerald-950" />
            <span className="hidden sm:inline">تشغيل السورة</span>
          </button>

          {/* Appearance Modal trigger */}
          <button
            onClick={() => setShowAppearanceMenu(!showAppearanceMenu)}
            title="تخصيص الخط والمظهر"
            className="p-2 rounded-xl bg-slate-100 dark:bg-emerald-900/40 text-slate-700 dark:text-amber-200 hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Appearance Settings Dropdown Drawer */}
      <AnimatePresence>
        {showAppearanceMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-emerald-950 border border-amber-500/30 rounded-2xl p-4 shadow-lg overflow-hidden space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-emerald-800 pb-2">
              <h4 className="text-sm font-bold text-slate-800 dark:text-amber-200">
                تخصيص خط ومظهر القراءة
              </h4>
              <button
                onClick={() => setShowAppearanceMenu(false)}
                className="text-xs text-slate-500 hover:text-slate-800 dark:text-amber-300"
              >
                إغلاق
              </button>
            </div>

            {/* Font Family Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-amber-200/80">
                نوع الخط القرآني:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'Amiri Quran', label: 'مصحف الأميري' },
                  { id: 'Scheherazade New', label: 'شهرزاد العثماني' },
                  { id: 'Amiri', label: 'الخط الأميري العريض' },
                  { id: 'Cairo', label: 'خط كايرو الحديث' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => updateSettings({ fontFamily: f.id as any })}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                      settings.fontFamily === f.id
                        ? 'bg-amber-500 text-emerald-950 font-bold border-amber-400 shadow-xs'
                        : 'bg-slate-50 dark:bg-emerald-900/40 text-slate-700 dark:text-amber-100 border-slate-200 dark:border-emerald-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-amber-200/80">
                ثيم القراءة:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'emerald', label: 'الزمردي الفاخر', bg: 'bg-[#042f2e] text-amber-200' },
                  { id: 'dark', label: 'الليلي الهادئ', bg: 'bg-slate-900 text-slate-100' },
                  { id: 'sepia', label: 'السيبيا المريح', bg: 'bg-[#f4ecd8] text-[#433422]' },
                  { id: 'oled', label: 'الأسود التام (OLED)', bg: 'bg-black text-white' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => updateSettings({ theme: t.id as any })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${t.bg} ${
                      settings.theme === t.id ? 'ring-2 ring-amber-400 border-amber-400' : 'border-transparent'
                    }`}
                  >
                    {settings.theme === t.id && <Check className="w-3.5 h-3.5" />}
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-700 dark:text-amber-200/80">
                <span>حجم الخط:</span>
                <span className="font-bold font-mono">{settings.fontSize}px</span>
              </div>
              <input
                type="range"
                min={18}
                max={44}
                value={settings.fontSize}
                onChange={e => updateSettings({ fontSize: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Quran Frame Container */}
      <div
        ref={containerRef}
        className={`rounded-3xl border shadow-md p-5 sm:p-8 md:p-12 transition-colors ${
          settings.theme === 'sepia'
            ? 'bg-[#f8f2e4] border-[#d8c7a6] text-[#332211]'
            : settings.theme === 'oled'
            ? 'bg-black border-zinc-800 text-zinc-100'
            : settings.theme === 'dark'
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-[#fefdfa] dark:bg-emerald-950/95 border-amber-200 dark:border-amber-500/20 text-slate-900 dark:text-amber-50'
        }`}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4 text-amber-500">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-slate-600 dark:text-amber-200">
              جاري تحميل آيات السورة الكريمة...
            </p>
          </div>
        ) : surahData ? (
          <div className="space-y-8">
            {/* Authentic Mushaf Surah Header Banner */}
            <div className="relative mx-auto max-w-lg text-center p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border-2 border-amber-400 text-amber-100 shadow-lg gold-glow">
              {/* Islamic Decorative Corners */}
              <div className="absolute top-2 right-2 text-amber-400/40 text-xs">۞</div>
              <div className="absolute top-2 left-2 text-amber-400/40 text-xs">۞</div>
              <div className="absolute bottom-2 right-2 text-amber-400/40 text-xs">۞</div>
              <div className="absolute bottom-2 left-2 text-amber-400/40 text-xs">۞</div>

              <div className="flex items-center justify-between text-xs text-amber-300/80 px-4 mb-1">
                <span>الجزء {surahData.startJuz}</span>
                <span className="font-semibold">{surahData.revelationType} • {surahData.numberOfAyahs} آيات</span>
                <span>ترتيب النزول: {surahData.revelationOrder}</span>
              </div>

              <h2 className="font-arabic-title text-3xl sm:text-4xl font-black text-amber-300 tracking-wide my-1">
                سُورَةُ {surahData.name}
              </h2>

              <p className="text-xs text-amber-200/60 font-mono">
                {surahData.englishName} ({surahData.englishNameTranslation})
              </p>
            </div>

            {/* Bismillah Header (except Surah 9 At-Tawbah) */}
            {surahData.bismillahPre && (
              <div className="text-center py-4">
                <p className="font-quran text-2xl sm:text-3xl text-amber-700 dark:text-amber-300 font-bold tracking-wider drop-shadow-sm">
                  {BISMILLAH_TEXT}
                </p>
                <div className="w-28 h-0.5 mx-auto mt-3 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
              </div>
            )}

            {/* Verses Flow Rendering */}
            <div
              className="leading-[2.5] sm:leading-[2.8] text-justify select-text"
              style={{
                fontFamily: settings.fontFamily,
                fontSize: `${settings.fontSize}px`
              }}
            >
              {surahData.ayahs.map(ayah => {
                const isActivePlaying =
                  audioState.isPlaying &&
                  audioState.surahNumber === surahData.number &&
                  audioState.ayahNumber === ayah.numberInSurah;

                const isSelected = selectedAyahNum === ayah.numberInSurah;
                const bookmarked = isBookmarked(surahData.number, ayah.numberInSurah);

                return (
                  <span
                    key={ayah.numberInSurah}
                    ref={el => (ayahRefs.current[ayah.numberInSurah] = el)}
                    onClick={() => handleAyahClick(ayah)}
                    onMouseEnter={() => setActiveAyahHover(ayah.numberInSurah)}
                    onMouseLeave={() => setActiveAyahHover(null)}
                    className={`relative inline cursor-pointer px-1.5 py-0.5 rounded-xl transition-all duration-200 ${
                      isActivePlaying
                        ? 'bg-amber-400/25 text-amber-700 dark:text-amber-200 ring-2 ring-amber-400 font-bold'
                        : isSelected
                        ? 'bg-emerald-500/15 ring-1 ring-emerald-500'
                        : 'hover:bg-amber-500/10'
                    }`}
                  >
                    <span>{ayah.text}</span>

                    {/* Ayah End Number Symbol Badge */}
                    <span className="ayah-num-badge inline-flex">
                      {ayah.numberInSurah}
                    </span>

                    {/* Quick Floating Mini-Action Popover for Hover / Selected */}
                    {(activeAyahHover === ayah.numberInSurah || isSelected) && (
                      <span
                        onClick={e => e.stopPropagation()}
                        className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 bg-emerald-950 text-amber-200 border border-amber-500/40 rounded-xl px-2.5 py-1 text-xs shadow-xl flex items-center gap-2 whitespace-nowrap animate-in fade-in zoom-in-95"
                      >
                        <button
                          onClick={() => playAyahAudio(surahData.number, ayah.numberInSurah)}
                          title="استماع لهذه الآية"
                          className="hover:text-amber-400 p-1"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                        <button
                          onClick={() => handleOpenAyahTafsir(ayah)}
                          title="تفسير الآية"
                          className="hover:text-amber-400 p-1 flex items-center gap-1 font-sans text-[11px]"
                        >
                          <BookMarked className="w-3.5 h-3.5" />
                          <span>تفسير</span>
                        </button>
                        <button
                          onClick={() => handleToggleBookmark(ayah)}
                          title="حفظ علامة مرجعية"
                          className={`p-1 ${bookmarked ? 'text-amber-400' : 'hover:text-amber-400'}`}
                        >
                          <Bookmark className="w-3.5 h-3.5 fill-current" />
                        </button>
                        <button
                          onClick={() => handleCopyAyah(ayah)}
                          title="نسخ الآية"
                          className="hover:text-amber-400 p-1"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    )}
                  </span>
                );
              })}
            </div>

            {/* Bottom Footer Frame Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-200 dark:border-emerald-800/80">
              <button
                onClick={handlePrevSurah}
                disabled={selectedSurahNum <= 1}
                className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-emerald-900/60 hover:bg-emerald-900 border border-amber-500/30 text-amber-200 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السورة السابقة ({selectedSurahNum > 1 ? SURAH_LIST[selectedSurahNum - 2]?.name : ''})</span>
              </button>

              <div className="text-xs text-center text-slate-500 dark:text-amber-200/60">
                <span>صفحة {surahData.startPage} • الجزء {surahData.startJuz}</span>
              </div>

              <button
                onClick={handleNextSurah}
                disabled={selectedSurahNum >= 114}
                className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-40 transition-all shadow-md"
              >
                <span>السورة التالية ({selectedSurahNum < 114 ? SURAH_LIST[selectedSurahNum]?.name : ''})</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Surah / Juz Modal Picker */}
      <AnimatePresence>
        {showSurahPicker && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-emerald-950 border border-amber-500/40 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-emerald-800 flex justify-between items-center bg-emerald-950 text-amber-50">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-lg text-amber-200">فهرس سور القرآن الكريم (114 سورة)</h3>
                </div>
                <button
                  onClick={() => setShowSurahPicker(false)}
                  className="p-1.5 rounded-xl bg-emerald-900 text-amber-300 hover:bg-emerald-800"
                >
                  ✕
                </button>
              </div>

              {/* Search Filter */}
              <div className="p-3 border-b border-slate-200 dark:border-emerald-800 bg-slate-50 dark:bg-emerald-900/30">
                <div className="relative">
                  <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-amber-300/70" />
                  <input
                    type="text"
                    placeholder="ابحث باسم السورة، رقمها، أو الاسم بالإنجليزية..."
                    value={surahFilter}
                    onChange={e => setSurahFilter(e.target.value)}
                    className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-white dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 text-slate-800 dark:text-amber-100 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Surahs Grid */}
              <div className="overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1">
                {filteredSurahs.map(s => (
                  <button
                    key={s.number}
                    onClick={() => {
                      setSelectedSurahNum(s.number);
                      setSelectedAyahNum(1);
                      setShowSurahPicker(false);
                    }}
                    className={`p-3 rounded-2xl border text-right flex items-center justify-between transition-all ${
                      selectedSurahNum === s.number
                        ? 'bg-amber-500/20 border-amber-500 text-emerald-950 dark:text-amber-300 font-bold'
                        : 'bg-slate-50 dark:bg-emerald-900/40 border-slate-200 dark:border-emerald-800 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-emerald-950 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-xs">
                        {s.number}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-slate-800 dark:text-amber-100">
                          سورة {s.name}
                        </h4>
                        <span className="text-[11px] text-slate-500 dark:text-amber-200/60">
                          {s.englishName} • {s.numberOfAyahs} آية
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-900/60 text-amber-300 border border-emerald-700">
                      {s.revelationType}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
