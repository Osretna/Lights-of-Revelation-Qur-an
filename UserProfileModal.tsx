import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User as UserIcon,
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
  Flame,
  Cloud,
  LogIn,
  LogOut,
  RefreshCw,
  RotateCcw,
  Sparkle
} from 'lucide-react';
import { useQuran } from '../context/QuranContext';
import { auth, googleProvider, signInWithPopup, signOut, User } from '../services/firebase';
import { syncUserProfileToFirebase, syncBookmarkToFirebase, syncKhatmahToFirebase } from '../services/firebaseSync';

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
    settings,
    userStats,
    resetAllCounters,
    showToast
  } = useQuran();

  const [activeSubTab, setActiveSubTab] = useState<'stats' | 'bookmarks' | 'cloud' | 'backup'>('stats');
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

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
      userStats,
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

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showToast('تم تسجيل الدخول ومزامنة بياناتك عبر Firebase بنجاح ☁️');
    } catch (err) {
      console.error(err);
      showToast('تعذر تسجيل الدخول، يرجى المحاولة لاحقاً');
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    showToast('تم تسجيل الخروج بنجاح');
  };

  const handleManualSync = async () => {
    if (!currentUser) {
      showToast('يرجى تسجيل الدخول أولاً لتفعيل المزامنة السحابية');
      return;
    }
    setIsSyncing(true);
    try {
      await syncUserProfileToFirebase(currentUser, readingProgress, settings, userStats.totalPagesRead);
      for (const bm of bookmarks) {
        await syncBookmarkToFirebase(currentUser, bm);
      }
      if (activeKhatmah) {
        await syncKhatmahToFirebase(currentUser, activeKhatmah);
      }
      showToast('تمت مزامنة جميع القراءات والعلامات المرجعية مع Firebase Cloud بنجاح ☁️✨');
    } catch (e) {
      console.error(e);
      showToast('حدث خطأ أثناء المزامنة');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleResetAll = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في تصفير وإعادة تعيين كافة العدادات والإحصائيات إلى الصفر؟')) {
      resetAllCounters();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-[#042118] border-2 border-[#d4af37]/40 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#d4af37]/25 flex justify-between items-center bg-gradient-to-r from-[#063321] to-[#042118] text-[#f5f2ed]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 flex items-center justify-center font-bold">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#d4af37]">
                {currentUser?.displayName || 'الملف الشخصي والإحصائيات'}
              </h3>
              <p className="text-xs text-[#f5f2ed]/70">
                {currentUser ? `متصل سحابياً: ${currentUser.email || 'حساب زائر'}` : 'قارئ القرآن الكريم • حفظ الله لك وقتك'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#084d32] text-[#d4af37] hover:bg-[#063321] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Tabs */}
        <div className="flex bg-slate-100 dark:bg-[#063321] p-1.5 border-b border-slate-200 dark:border-[#d4af37]/20 text-xs font-semibold overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveSubTab('stats')}
            className={`flex-1 min-w-[100px] py-2 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'stats' ? 'bg-[#d4af37] text-[#042118] font-bold' : 'text-slate-600 dark:text-[#f5f2ed]'
            }`}
          >
            الإحصائيات والعدادات
          </button>
          <button
            onClick={() => setActiveSubTab('bookmarks')}
            className={`flex-1 min-w-[100px] py-2 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'bookmarks' ? 'bg-[#d4af37] text-[#042118] font-bold' : 'text-slate-600 dark:text-[#f5f2ed]'
            }`}
          >
            العلامات ({bookmarks.length})
          </button>
          <button
            onClick={() => setActiveSubTab('cloud')}
            className={`flex-1 min-w-[120px] py-2 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'cloud' ? 'bg-[#d4af37] text-[#042118] font-bold' : 'text-slate-600 dark:text-[#f5f2ed]'
            }`}
          >
            السحابة (Firebase)
          </button>
          <button
            onClick={() => setActiveSubTab('backup')}
            className={`flex-1 min-w-[100px] py-2 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'backup' ? 'bg-[#d4af37] text-[#042118] font-bold' : 'text-slate-600 dark:text-[#f5f2ed]'
            }`}
          >
            النسخ المحلي
          </button>
        </div>

        {/* Body Container */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* STATS SUBTAB */}
          {activeSubTab === 'stats' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-[#063321] border border-amber-200 dark:border-[#d4af37]/30 text-center">
                  <Flame className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                  <span className="text-2xl font-bold font-mono text-slate-800 dark:text-[#d4af37]">
                    {userStats.streakDays}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-[#f5f2ed]/70 block">
                    أيام تتابع القراءة
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-[#063321] border border-emerald-200 dark:border-[#d4af37]/30 text-center">
                  <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
                  <span className="text-2xl font-bold font-mono text-slate-800 dark:text-[#d4af37]">
                    {userStats.totalPagesRead}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-[#f5f2ed]/70 block">
                    صفحة مقروءة
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-teal-50 dark:bg-[#063321] border border-teal-200 dark:border-[#d4af37]/30 text-center">
                  <Headphones className="w-6 h-6 text-teal-600 dark:text-teal-400 mx-auto mb-1" />
                  <span className="text-2xl font-bold font-mono text-slate-800 dark:text-[#d4af37]">
                    {Math.floor(userStats.listeningSeconds / 3600)}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-[#f5f2ed]/70 block">
                    ساعة استماع
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-[#063321] border border-indigo-200 dark:border-[#d4af37]/30 text-center">
                  <Award className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mx-auto mb-1" />
                  <span className="text-2xl font-bold font-mono text-slate-800 dark:text-[#d4af37]">
                    {userStats.completedKhatmahsCount}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-[#f5f2ed]/70 block">
                    ختمة مكتملة
                  </span>
                </div>
              </div>

              {/* Tasbeeh Counter Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#063321] border border-slate-200 dark:border-[#d4af37]/25 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-[#d4af37]" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-[#f5f2ed]">
                      إجمالي التسبيحات المنجزة:
                    </h4>
                    <span className="text-[11px] text-slate-500 dark:text-[#f5f2ed]/60">
                      يتم احتسابها تلقائياً عند استخدام السبحة الإلكترونية
                    </span>
                  </div>
                </div>
                <span className="font-mono text-xl font-bold text-[#d4af37]">
                  {userStats.tasbeehTotalCount}
                </span>
              </div>

              {/* Reset All Counters Button */}
              <div className="pt-2">
                <button
                  onClick={handleResetAll}
                  className="w-full py-3 px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>تصفير وإعادة ضبط كافة العدادات والإحصائيات</span>
                </button>
              </div>
            </div>
          )}

          {/* CLOUD SUBTAB */}
          {activeSubTab === 'cloud' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#063321]/60 border border-[#d4af37]/30 text-right space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-[#d4af37]" />
                    <h4 className="text-sm font-bold text-[#d4af37]">
                      مزامنة فايربيس السحابية (Firebase Cloud Sync)
                    </h4>
                  </div>
                  <span className="text-[10px] bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 px-2 py-0.5 rounded-full font-bold">
                    نشط ومتصل
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  مشروع Firebase متصل: <code className="font-mono text-[#d4af37]">lights-of-revelation-qur-an</code>. يمكنك حفظ علاماتك المرجعية وتقدم قراءتك والوصول إليها من أي جهاز آخر في العالم.
                </p>
              </div>

              {currentUser ? (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#063321]/40 border border-slate-200 dark:border-[#d4af37]/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-bold text-slate-800 dark:text-[#f5f2ed]">
                        {currentUser.displayName || 'مستخدم مسجل'}
                      </h5>
                      <span className="text-xs text-slate-500 dark:text-[#d4af37]/70">
                        {currentUser.email || 'حساب زائر مجهول'}
                      </span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold hover:bg-rose-500/30 cursor-pointer"
                    >
                      تسجيل خروج
                    </button>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={handleManualSync}
                      disabled={isSyncing}
                      className="flex-1 py-2.5 rounded-xl bg-[#d4af37] text-[#042118] font-bold text-xs flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? 'جاري المزامنة...' : 'مزامنة البيانات الآن سحابياً'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#063321]/40 border border-slate-200 dark:border-[#d4af37]/20 text-center space-y-3">
                  <p className="text-xs text-slate-600 dark:text-[#f5f2ed]/80">
                    سجل دخولك الآن لمزامنة موضع قراءتك وعلاماتك المرجعية عبر جميع أجهزتك الذكية.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                      onClick={handleGoogleSignIn}
                      className="py-2.5 px-4 rounded-xl bg-[#d4af37] hover:bg-[#c19b2e] text-[#042118] font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>تسجيل الدخول بـ Google</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* BOOKMARKS SUBTAB */}
          {activeSubTab === 'bookmarks' && (
            <div className="space-y-3">
              {bookmarks.length === 0 ? (
                <div className="text-center py-12 text-slate-500 dark:text-[#f5f2ed]/60">
                  <Bookmark className="w-10 h-10 mx-auto text-slate-300 dark:text-[#084d32] mb-2" />
                  <p className="text-sm font-semibold">لا توجد علامات مرجعية محفوظة بعد</p>
                  <p className="text-xs mt-1">اضغط على أيقونة النجمة أو الحفظ في قارئ القرآن لإضافتها هنا</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {bookmarks.map(b => (
                    <div
                      key={b.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#063321]/40 border border-slate-200 dark:border-[#d4af37]/20 flex items-center justify-between gap-3 hover:border-[#d4af37] transition-all"
                    >
                      <div
                        onClick={() => handleJumpToBookmark(b)}
                        className="cursor-pointer flex-1 min-w-0 text-right"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold bg-[#d4af37]/20 text-[#d4af37] px-2 py-0.5 rounded">
                            سورة {b.surahName}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-[#f5f2ed]/70">
                            الآية {b.ayahNumberInSurah}
                          </span>
                        </div>
                        <p className="font-quran text-sm text-slate-800 dark:text-[#f5f2ed] truncate mt-1">
                          ﴿{b.textPreview}﴾
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleJumpToBookmark(b)}
                          className="p-2 rounded-xl bg-[#d4af37] text-[#042118] font-bold text-xs hover:bg-[#c19b2e] transition-colors cursor-pointer"
                          title="فتح في المصحف"
                        >
                          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                        </button>
                        <button
                          onClick={() => removeBookmark(b.id)}
                          className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
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
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#063321]/40 border border-slate-200 dark:border-[#d4af37]/20 space-y-2">
                <h4 className="text-sm font-bold text-slate-800 dark:text-[#d4af37]">
                  تصدير واستيراد البيانات (Offline JSON Backup)
                </h4>
                <p className="text-xs text-slate-600 dark:text-[#f5f2ed]/80 leading-relaxed">
                  احفظ نسخة احتياطية من جميع علاماتك المرجعية، تقدم الختمات، وإحصائيات القراءة لنقلها لأي جهاز آخر.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleExportBackup}
                  className="flex-1 py-3 px-4 rounded-2xl bg-[#d4af37] hover:bg-[#c19b2e] text-[#042118] font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
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
