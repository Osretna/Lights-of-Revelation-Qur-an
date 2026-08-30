import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Plus,
  Calendar,
  Award,
  BookOpen,
  Sparkles,
  RotateCcw,
  Check,
  Share2,
  Trophy
} from 'lucide-react';
import { useQuran } from '../context/QuranContext';
import { JUZ_LIST } from '../data/surahList';

export const KhatmahTracker: React.FC = () => {
  const {
    activeKhatmah,
    createNewKhatmah,
    markKhatmahPageComplete,
    showToast
  } = useQuran();

  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [targetDays, setTargetDays] = useState<number>(30);
  const [khatmahTitle, setKhatmahTitle] = useState<string>('ختمة القرآن الكريم');

  const completedPages = activeKhatmah?.completedPages || [];
  const completedCount = completedPages.length;
  const percentage = Math.round((completedCount / 604) * 100);
  const isCompleted = completedCount >= 604;

  const handleCreateKhatmah = (e: React.FormEvent) => {
    e.preventDefault();
    createNewKhatmah(khatmahTitle, targetDays);
    setShowNewModal(false);
    showToast('تم إنشاء خطة الختمة بنجاح! وفقك الله 🌟');
  };

  const handleQuickAddPages = (count: number) => {
    let nextAdded = 0;
    for (let p = 1; p <= 604 && nextAdded < count; p++) {
      if (!completedPages.includes(p)) {
        markKhatmahPageComplete(p);
        nextAdded++;
      }
    }
    showToast(`تم تسجيل قراءة ${nextAdded} صفحة في الختمة 📖`);
  };

  // Helper to get all page numbers belonging to a specific Juz
  const getJuzPageNumbers = (juzNum: number): number[] => {
    const startPage = (juzNum - 1) * 20 + 1;
    const endPage = Math.min(604, juzNum * 20 + (juzNum === 30 ? 4 : 0));
    const pages: number[] = [];
    for (let p = startPage; p <= endPage; p++) {
      pages.push(p);
    }
    return pages;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 pb-28 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border border-amber-500/30 rounded-3xl p-6 text-amber-50 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-amber-400" />
              <h1 className="font-arabic-title text-2xl sm:text-3xl font-bold text-amber-200">
                إدارة ومتابعة ختمة القرآن الكريم
              </h1>
            </div>
            <p className="text-sm text-amber-100/80 mt-1">
              حدد هدفك اليومي، تابع الصفحات المنجزة، واحتفل بختم كتاب الله تعالى.
            </p>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow-md gold-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>إنشاء ختمة جديدة</span>
          </button>
        </div>
      </div>

      {/* Main Khatmah Status Hero */}
      <div className="bg-white dark:bg-emerald-950 border border-slate-200 dark:border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Progress Ring Graphic */}
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100 dark:text-emerald-900"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-amber-500"
                  strokeDasharray={`${percentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-amber-300 font-mono">
                  {percentage}%
                </span>
                <span className="text-[10px] text-slate-500 dark:text-amber-200/70 font-semibold">
                  نسبة الإنجاز
                </span>
              </div>
            </div>

            <div className="space-y-1 text-right">
              <span className="text-xs bg-amber-500/20 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-full font-bold border border-amber-500/30">
                {activeKhatmah?.title || 'ختمة نشطة'}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-amber-100 mt-1">
                {completedCount} <span className="text-sm font-normal text-slate-500 dark:text-amber-200/70">من 604 صفحة</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-amber-200/80">
                الهدف اليومي: <strong>{activeKhatmah?.dailyPagesTarget || 20} صفحة / يوم</strong>
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                متبقي لإتمام الختمة: {604 - completedCount} صفحة
              </p>
            </div>
          </div>

          {/* Quick Record Actions */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-600 dark:text-amber-200/80 text-center md:text-right">
              تسجيل إنجاز اليوم السريع:
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleQuickAddPages(1)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-emerald-900/60 border border-slate-200 dark:border-emerald-800 text-slate-800 dark:text-amber-200 hover:border-amber-400 font-bold text-xs transition-colors"
              >
                +1 صفحة
              </button>
              <button
                onClick={() => handleQuickAddPages(5)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-emerald-900/60 border border-slate-200 dark:border-emerald-800 text-slate-800 dark:text-amber-200 hover:border-amber-400 font-bold text-xs transition-colors"
              >
                +5 صفحات
              </button>
              <button
                onClick={() => handleQuickAddPages(20)}
                className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-bold text-xs shadow-sm transition-all"
              >
                +20 (جزء كامل)
              </button>
            </div>

            {/* Certificate trigger if done */}
            {isCompleted && (
              <button
                onClick={() => setShowCertificate(true)}
                className="mt-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md animate-bounce"
              >
                <Trophy className="w-4 h-4 text-amber-300" />
                <span>عرض شهادة ختم القرآن الكريم 🎉</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Interactive 30-Juz Checklist */}
      <div className="bg-white dark:bg-emerald-950 border border-slate-200 dark:border-amber-500/20 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base sm:text-lg text-slate-800 dark:text-amber-100">
              خريطة إنجاز أجزاء القرآن الثلاثين
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-amber-300/60">
            انقر لتحديد الجزء المنجز
          </span>
        </div>

        {/* 30 Juz Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
          {JUZ_LIST.map(juz => {
            const juzPages = getJuzPageNumbers(juz.juzNumber);
            const isJuzDone = juzPages.every(p => completedPages.includes(p));
            const pagesDoneInJuz = juzPages.filter(p => completedPages.includes(p)).length;

            return (
              <button
                key={juz.juzNumber}
                onClick={() => {
                  // Toggle whole juz pages
                  juzPages.forEach(p => markKhatmahPageComplete(p));
                  showToast(`تم تحديث إنجاز الجزء ${juz.juzNumber} 📖`);
                }}
                className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                  isJuzDone
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-900 dark:text-emerald-300 font-bold'
                    : 'bg-slate-50 dark:bg-emerald-900/30 border-slate-200 dark:border-emerald-800 text-slate-700 dark:text-amber-100 hover:border-amber-400'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="w-6 h-6 rounded-lg bg-emerald-950 text-amber-300 text-xs font-bold flex items-center justify-center">
                    {juz.juzNumber}
                  </span>
                  {isJuzDone && <Check className="w-4 h-4 text-emerald-500" />}
                </div>

                <div>
                  <h4 className="text-xs font-bold truncate">الجزء {juz.juzNumber}</h4>
                  <span className="text-[10px] text-slate-500 dark:text-amber-300/60 block mt-0.5">
                    {pagesDoneInJuz} / {juzPages.length} صفحة
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* New Khatmah Modal */}
      <AnimatePresence>
        {showNewModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-emerald-950 border border-amber-500/40 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4"
            >
              <h3 className="font-bold text-lg text-slate-800 dark:text-amber-200">
                إنشاء خطة ختمة جديدة
              </h3>

              <form onSubmit={handleCreateKhatmah} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-amber-200 block mb-1">
                    اسم الختمة:
                  </label>
                  <input
                    type="text"
                    required
                    value={khatmahTitle}
                    onChange={e => setKhatmahTitle(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-emerald-900/60 border border-slate-200 dark:border-emerald-800 text-slate-800 dark:text-amber-100 text-sm font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-amber-200 block mb-1">
                    المدة المستهدفة لختم القرآن:
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[10, 15, 30, 60].map(days => (
                      <button
                        type="button"
                        key={days}
                        onClick={() => setTargetDays(days)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          targetDays === days
                            ? 'bg-amber-500 text-emerald-950 border-amber-400'
                            : 'bg-slate-50 dark:bg-emerald-900/40 text-slate-700 dark:text-amber-200 border-slate-200 dark:border-emerald-800'
                        }`}
                      >
                        {days} يوم
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-amber-300/70 mt-2">
                    المعدل المطلوب: <strong>{Math.ceil(604 / targetDays)} صفحة يومياً</strong>
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-sm shadow-md transition-all"
                  >
                    بدء الختمة
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewModal(false)}
                    className="py-3 px-5 rounded-xl bg-slate-100 dark:bg-emerald-900/50 text-slate-700 dark:text-amber-200 text-sm font-semibold"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Celebratory Completion Certificate Modal */}
      <AnimatePresence>
        {showCertificate && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gradient-to-b from-[#042f2e] via-emerald-950 to-[#02221b] border-4 border-amber-400 rounded-3xl w-full max-w-xl p-8 text-center text-amber-50 shadow-2xl gold-glow-lg relative overflow-hidden"
            >
              <div className="absolute top-2 right-2 text-amber-400/40 text-sm">۞</div>
              <div className="absolute top-2 left-2 text-amber-400/40 text-sm">۞</div>
              <div className="absolute bottom-2 right-2 text-amber-400/40 text-sm">۞</div>
              <div className="absolute bottom-2 left-2 text-amber-400/40 text-sm">۞</div>

              <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-amber-300" />
              </div>

              <p className="font-quran text-sm text-amber-300/80 mb-1">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>

              <h2 className="font-arabic-title text-3xl font-black text-amber-300 mb-2">
                شهادة إتمام ختم القرآن الكريم
              </h2>

              <p className="text-sm text-amber-100/90 leading-relaxed my-4">
                هنيئاً لك ختم كتاب الله تبارك وتعالى. نسأل الله أن يجعله شفيعاً لك ونوراً في قلبك وحجة لك لا عليك.
              </p>

              <div className="bg-emerald-900/60 border border-amber-500/30 p-3 rounded-2xl max-w-xs mx-auto mb-6 text-xs text-amber-200">
                <p>تاريخ الإتمام: {new Date().toLocaleDateString('ar-EG', { dateStyle: 'full' })}</p>
                <p className="mt-0.5">عبر تطبيق أنوار الوحي للقرآن الكريم</p>
              </div>

              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setShowCertificate(false)}
                  className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow-md"
                >
                  إغلاق الشهادة
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
