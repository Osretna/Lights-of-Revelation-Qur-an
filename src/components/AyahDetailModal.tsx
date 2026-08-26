import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookMarked,
  Play,
  Pause,
  Bookmark,
  Copy,
  Share2,
  Repeat,
  Sparkles,
  X,
  Volume2,
  Check
} from 'lucide-react';
import { useQuran } from '../context/QuranContext';
import { TAFSIR_SCHOLARS, getTafsirForAyah } from '../data/tafsirData';
import { TafsirScholar } from '../types/quran';

export const AyahDetailModal: React.FC = () => {
  const {
    selectedAyahDetail,
    setSelectedAyahDetail,
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    audioState,
    playAyahAudio,
    pauseAudio,
    resumeAudio,
    showToast
  } = useQuran();

  const [selectedScholar, setSelectedScholar] = useState<TafsirScholar>('saadi');
  const [repeatCount, setRepeatCount] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);

  if (!selectedAyahDetail) return null;

  const { surahNum, ayah, surahMeta } = selectedAyahDetail;
  const isPlayingThisAyah =
    audioState.isPlaying &&
    audioState.surahNumber === surahNum &&
    audioState.ayahNumber === ayah.numberInSurah;

  const tafsirContent = getTafsirForAyah(surahNum, ayah.numberInSurah, selectedScholar);
  const currentScholarInfo = TAFSIR_SCHOLARS.find(s => s.id === selectedScholar) || TAFSIR_SCHOLARS[0];
  const bookmarked = isBookmarked(surahNum, ayah.numberInSurah);

  const handleToggleBookmark = () => {
    if (bookmarked) {
      const existing = bookmarks.find(b => b.surahNumber === surahNum && b.ayahNumberInSurah === ayah.numberInSurah);
      if (existing) removeBookmark(existing.id);
    } else {
      addBookmark({
        surahNumber: surahNum,
        surahName: surahMeta.name,
        ayahNumberInSurah: ayah.numberInSurah,
        ayahGlobalNumber: ayah.number,
        page: ayah.page,
        juz: ayah.juz,
        textPreview: ayah.text
      });
    }
  };

  const handleCopyAyah = () => {
    const textToCopy = `﴿${ayah.text}﴾\n[سورة ${surahMeta.name}: آية ${ayah.numberInSurah}]\n\nالتفسير (${currentScholarInfo.name}):\n${tafsirContent}\n\n- عبر تطبيق أنوار الوحي للقرآن الكريم`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    showToast('تم نسخ الآية مع التفسير إلى الحافظة 📋');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-emerald-950 border border-amber-500/40 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-emerald-800 flex justify-between items-center bg-gradient-to-r from-emerald-950 to-emerald-900 text-amber-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-amber-200">
                تفسير وتدبر الآية ({ayah.numberInSurah})
              </h3>
              <p className="text-xs text-amber-200/70">
                سورة {surahMeta.name} • الجزء {ayah.juz} • صفحة {ayah.page}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedAyahDetail(null)}
            className="p-2 rounded-xl bg-emerald-900 text-amber-300 hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Container */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5 flex-1">
          {/* Ayah Card Display */}
          <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/70 dark:bg-emerald-900/40 border-2 border-amber-300/80 dark:border-amber-500/30 text-center shadow-inner relative">
            <span className="text-amber-500 text-sm absolute top-3 right-4">۞</span>
            <span className="text-amber-500 text-sm absolute bottom-3 left-4">۞</span>

            <p className="font-quran text-xl sm:text-2xl text-slate-900 dark:text-amber-100 leading-loose">
              {ayah.text}
            </p>
            
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-amber-800 dark:text-amber-300 font-semibold">
              <span>﴿ سورة {surahMeta.name} - الآية {ayah.numberInSurah} ﴾</span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 dark:bg-emerald-900/30 p-2.5 rounded-2xl border border-slate-200 dark:border-emerald-800">
            {/* Audio Play for verse */}
            <button
              onClick={() => {
                if (isPlayingThisAyah) {
                  pauseAudio();
                } else {
                  playAyahAudio(surahNum, ayah.numberInSurah);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow-sm gold-glow transition-all"
            >
              {isPlayingThisAyah ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-emerald-950" />
                  <span>إيقاف التلاوة</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-emerald-950" />
                  <span>استماع للآية</span>
                </>
              )}
            </button>

            {/* Bookmark */}
            <button
              onClick={handleToggleBookmark}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                bookmarked
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-400'
                  : 'bg-white dark:bg-emerald-950 text-slate-700 dark:text-amber-200 border-slate-200 dark:border-emerald-800 hover:border-amber-400'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
              <span>{bookmarked ? 'محفوظة' : 'حفظ'}</span>
            </button>

            {/* Copy */}
            <button
              onClick={handleCopyAyah}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 text-slate-700 dark:text-amber-200 hover:border-amber-400 text-xs font-semibold transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ' : 'نسخ مع التفسير'}</span>
            </button>

            {/* Repeat memorization */}
            <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-amber-200/70">
              <Repeat className="w-3.5 h-3.5" />
              <span>تكرار:</span>
              {[1, 3, 5, 10].map(cnt => (
                <button
                  key={cnt}
                  onClick={() => {
                    setRepeatCount(cnt);
                    showToast(`تم ضبط تكرار الآية للتحفيظ: ${cnt} مرات`);
                  }}
                  className={`w-6 h-6 rounded-md font-bold text-[11px] border transition-all ${
                    repeatCount === cnt
                      ? 'bg-amber-500 text-emerald-950 border-amber-400'
                      : 'bg-white dark:bg-emerald-950 border-slate-200 dark:border-emerald-800'
                  }`}
                >
                  {cnt}
                </button>
              ))}
            </div>
          </div>

          {/* Scholar Tafsir Switcher Tabs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-amber-200">
                اختر كتاب التفسير المعتمد:
              </label>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                {currentScholarInfo.era}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {TAFSIR_SCHOLARS.map(scholar => (
                <button
                  key={scholar.id}
                  onClick={() => setSelectedScholar(scholar.id)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                    selectedScholar === scholar.id
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 border-amber-400 shadow-sm'
                      : 'bg-slate-50 dark:bg-emerald-900/40 text-slate-700 dark:text-amber-200 border-slate-200 dark:border-emerald-800 hover:border-amber-400'
                  }`}
                >
                  {scholar.name.replace('تفسير ', '')}
                </button>
              ))}
            </div>

            {/* Tafsir Body Text */}
            <div className="p-5 rounded-2xl bg-white dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentScholarInfo.bookTitle}</span>
              </div>
              <p className="text-sm sm:text-base text-slate-700 dark:text-amber-100 leading-relaxed text-justify">
                {tafsirContent}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-emerald-800 bg-slate-50 dark:bg-emerald-900/30 flex justify-end">
          <button
            onClick={() => setSelectedAyahDetail(null)}
            className="py-2 px-5 rounded-xl bg-emerald-900 text-amber-200 hover:bg-emerald-800 text-xs font-bold transition-colors"
          >
            إغلاق النافذة
          </button>
        </div>
      </motion.div>
    </div>
  );
};
