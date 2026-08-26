import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Sparkles, Compass, Clock, Headphones, ArrowLeft } from 'lucide-react';
import { useQuran } from '../context/QuranContext';

export const SplashScreen: React.FC = () => {
  const { setShowSplash, setActiveTab } = useQuran();

  const handleStart = () => {
    setShowSplash(false);
    setActiveTab('home');
  };

  const handleQuickQuran = () => {
    setShowSplash(false);
    setActiveTab('quran');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#042f2e] text-amber-50 flex flex-col items-center justify-between p-6 sm:p-10 islamic-pattern overflow-y-auto">
      {/* Decorative Golden Ambient Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Tag */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full flex justify-between items-center max-w-md pt-2"
      >
        <div className="flex items-center gap-2 bg-emerald-950/70 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-xs text-amber-300 font-medium backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>تطبيق إسلامي شامل ومجاني</span>
        </div>
        <button
          onClick={handleStart}
          className="text-xs text-amber-200/70 hover:text-amber-200 transition-colors px-3 py-1 rounded-lg border border-transparent hover:border-amber-500/20"
        >
          تخطي الشاشة
        </button>
      </motion.div>

      {/* Center Hero: Radiant Quran & Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.15 }}
        className="flex flex-col items-center text-center my-auto py-6 max-w-lg z-10"
      >
        {/* Animated Radiant Open Quran Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full blur-2xl opacity-40 animate-pulse" />
          
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-b from-emerald-800 to-emerald-950 border-2 border-amber-400/50 flex items-center justify-center shadow-2xl gold-glow-lg">
            {/* Islamic Star / Frame Pattern */}
            <div className="absolute inset-2 border border-amber-400/30 rounded-2xl pointer-events-none" />
            <BookOpen className="w-14 h-14 sm:w-18 sm:h-18 text-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
          </div>
        </div>

        {/* Bismillah Header */}
        <p className="font-quran text-lg sm:text-xl text-amber-300/90 mb-3 tracking-wide">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>

        {/* App Title */}
        <h1 className="font-arabic-title text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 mb-4 tracking-tight drop-shadow-md">
          أنوار الوحي
        </h1>

        {/* Signature Phrase */}
        <div className="relative px-6 py-2.5 rounded-full bg-emerald-950/80 border border-amber-400/20 mb-6 backdrop-blur-md">
          <p className="text-sm sm:text-base text-amber-100 font-medium">
            "كتاب الله بين يديك في كل وقت"
          </p>
        </div>

        {/* Highlights Pills */}
        <div className="flex flex-wrap justify-center gap-2 max-w-sm text-xs text-amber-200/80">
          <span className="flex items-center gap-1 bg-emerald-900/60 px-2.5 py-1 rounded-md border border-emerald-700/50">
            <BookOpen className="w-3 h-3 text-amber-400" /> القرآن كاملاً
          </span>
          <span className="flex items-center gap-1 bg-emerald-900/60 px-2.5 py-1 rounded-md border border-emerald-700/50">
            <Headphones className="w-3 h-3 text-amber-400" /> كبار القراء
          </span>
          <span className="flex items-center gap-1 bg-emerald-900/60 px-2.5 py-1 rounded-md border border-emerald-700/50">
            <Clock className="w-3 h-3 text-amber-400" /> مواقيت الصلاة
          </span>
          <span className="flex items-center gap-1 bg-emerald-900/60 px-2.5 py-1 rounded-md border border-emerald-700/50">
            <Compass className="w-3 h-3 text-amber-400" /> اتجاه القبلة
          </span>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="w-full max-w-md space-y-3 z-10 pb-4"
      >
        <button
          id="splash-start-btn"
          onClick={handleStart}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-bold text-base sm:text-lg shadow-xl gold-glow flex items-center justify-center gap-2.5 transition-all transform active:scale-[0.98]"
        >
          <span>فتح التطبيق والصفحة الرئيسية</span>
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <button
          id="splash-quran-btn"
          onClick={handleQuickQuran}
          className="w-full py-3.5 px-6 rounded-2xl bg-emerald-900/80 hover:bg-emerald-900 border border-amber-500/40 text-amber-200 font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all backdrop-blur-sm"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>بدء قراءة القرآن الكريم مباشرة</span>
        </button>
      </motion.div>
    </div>
  );
};
