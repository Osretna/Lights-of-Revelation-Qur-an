import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Bookmark,
  Award,
  BookOpen,
  Headphones,
  Calendar,
  Download,
  Upload,
  Trash2,
  X,
  ArrowLeft,
  Sparkles,
  Flame
} from 'lucide-react';
import { useQuran } from '../context/QuranContext';

interface UserProfileModalProps {
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ onClose }) => {
  const {
    bookmarks,
    removeBookmark,
    setSelectedSurahNum,
    setSelectedAyahNum,
    setActiveTab,
    saveReadingProgress,
    readingProgress,
    activeKhatmah,
    showToast
  } = useQuran();

  const [activeSubTab, setActiveSubTab] = useState<'stats' | 'bookmarks' | 'backup'>('stats');

  const handleJumpToBookmark = (b: typeof bookmarks[0]) => {
    setSelectedSurahNum(b.surahNumber);
    setSelectedAyahNum(b.ayahNumberInSurah);
    saveReadingProgress(b.surahNumber, b.ayahNumberInSurah, b.page, b.juz);
    setActiveTab('quran');
    onClose();
  };

  const handleExportBackup = () => {
    const data = {
      bookmarks,
      readingProgress,
      activeKhatmah,
      date: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anwar_alwahi_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('تم تصدير ملف النسخة الاحتياطية بنجاح 💾');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-emerald-950 border border-amber-500/40 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-emerald-800 flex justify-between items-center bg-gradient-to-r from-emerald-950 to-emerald-900 text-amber-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-amber-200">
                الملف الشخصي والإحصائيات
              </h3>
              <p className="text-xs text-amber-200/70">
                قارئ القرآن الكريم • حفظ الله لك وقتك
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-emerald-900 text-amber-300 hover:bg-emerald-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Tabs */}
        <div className="flex bg-slate-100 dark:bg-emerald-900/40 p-1.5 border-b border-slate-200 dark:border-emerald-800 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('stats')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeSubTab === 'stats' ? 'bg-amber-500 text-emerald-950 font-bold' : 'text-slate-600 dark:text-amber-200'
            }`}
          >
            الإحصائيات والإنجازات
          </button>
          <button
            onClick={() => setActiveSubTab('bookmarks')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeSubTab === 'bookmarks' ? 'bg-amber-500 text-emerald-950 font-bold' : 'text-slate-600 dark:text-amber-200'
            }`}
          >
            العلامات المرجعية ({bookmarks.length})
          </button>
          <button
            onClick={() => setActiveSubTab('backup')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeSubTab === 'backup' ? 'bg-amber-500 text-emerald-950 font-bold' : 'text-slate-600 dark:text-amber-200'
            }`}
          >
            النسخ الاحتياطي
          </button>
        </div>

        {/* Body Container */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* STATS SUBTAB */}
          {activeSubTab === 'stats' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-emerald-900/30 border border-amber-200 dark:border-emerald-800 text-center">
                  <Flame className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                  <span className="text-2xl font-bold font-mono text-slate-800 dark:text-amber-300">
                    {readingProgress.streakDays || 12}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-amber-200/70 block">
                    أيام تتابع القراءة
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-center">
                  <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
                  <span className="text-2xl font-bold font-mono text-slate-800 dark:text-amber-300">
                    {readingProgress.totalPagesRead || 148}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-amber-200/70 block">
                    صفحة مقروءة
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-teal-50 dark:bg-emerald-900/30 border border-teal-200 dark:border-emerald-800 text-center">
                  <Headphones className="w-6 h-6 text-teal-600 dark:text-teal-400 mx-auto mb-1" />
                  <span className="text-2xl font-bold font-mono text-slate-800 dark:text-amber-300">
                    {readingProgress.listeningMinutes ? Math.round(readingProgress.listeningMinutes / 60) : 18}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-amber-200/70 block">
                    ساعة استماع
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-emerald-900/30 border border-indigo-200 dark:border-emerald-800 text-center">
                  <Award className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mx-auto mb-1" />
                  <span className="text-2xl font-bold font-mono text-slate-800 dark:text-amber-300">
                    {activeKhatmah?.completedPages?.length >= 604 ? 2 : 1}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-amber-200/70 block">
                    ختمة مكتملة
                  </span>
                </div>
              </div>

              {/* Badges Achievements */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-bold text-slate-800 dark:text-amber-200">
                    أوسمة الإنجاز والهمة العالية
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-500/30">
                    🏆 همة القارئ الدائم
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    🌟 محب سورة الكهف
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-teal-500/20 text-teal-800 dark:text-teal-300 text-xs font-bold border border-teal-500/30">
                    📖 رفيق القرآن
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* BOOKMARKS SUBTAB */}
          {activeSubTab === 'bookmarks' && (
            <div className="space-y-3">
              {bookmarks.length === 0 ? (
                <div className="text-center py-12 text-slate-500 dark:text-amber-200/70">
                  <Bookmark className="w-10 h-10 mx-auto text-slate-300 dark:text-emerald-800 mb-2" />
                  <p className="text-sm font-semibold">لا توجد علامات مرجعية محفوظة بعد</p>
                  <p className="text-xs mt-1">اضغط على أيقونة النجمة أو الحفظ في قارئ القرآن لإضافتها هنا</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {bookmarks.map(b => (
                    <div
                      key={b.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-emerald-900/30 border border-slate-200 dark:border-emerald-800 flex items-center justify-between gap-3 hover:border-amber-400 transition-all"
                    >
                      <div
                        onClick={() => handleJumpToBookmark(b)}
                        className="cursor-pointer flex-1 min-w-0 text-right"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded">
                            سورة {b.surahName}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-amber-200/70">
                            الآية {b.ayahNumberInSurah}
                          </span>
                        </div>
                        <p className="font-quran text-sm text-slate-800 dark:text-amber-100 truncate mt-1">
                          ﴿{b.textPreview}﴾
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleJumpToBookmark(b)}
                          className="p-2 rounded-xl bg-amber-500 text-emerald-950 font-bold text-xs hover:bg-amber-400 transition-colors"
                          title="فتح في المصحف"
                        >
                          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                        </button>
                        <button
                          onClick={() => removeBookmark(b.id)}
                          className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="حذف العلامة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* BACKUP SUBTAB */}
          {activeSubTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <h4 className="text-sm font-bold text-slate-800 dark:text-amber-200">
                  تصدير واستيراد البيانات (Offline JSON Backup)
                </h4>
                <p className="text-xs text-slate-600 dark:text-amber-200/80 leading-relaxed">
                  احفظ نسخة احتياطية من جميع علاماتك المرجعية، تقدم الختمات، وإحصائيات القراءة لنقلها لأي جهاز آخر.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleExportBackup}
                  className="flex-1 py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>تصدير نسخة احتياطية الآن</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
