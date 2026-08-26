import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sun,
  Moon,
  BedDouble,
  Compass,
  Flame,
  BookOpen,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Share2,
  Volume2,
  ChevronRight,
  Heart
} from 'lucide-react';
import { useQuran } from '../context/QuranContext';
import { AZKAR_CATEGORIES, AZKAR_ITEMS, DIGITAL_TASBEEH_PRESETS, AzkarCategory } from '../data/azkarData';
import { ZikrItem } from '../types/quran';

export const AzkarSection: React.FC = () => {
  const { showToast } = useQuran();

  const [activeCategory, setActiveCategory] = useState<string>('sabah');
  const [activeTab, setActiveTab] = useState<'azkar' | 'tasbeeh'>('azkar');
  const [zikrCounts, setZikrCounts] = useState<Record<string, number>>({});

  // Digital Tasbeeh State
  const [selectedPreset, setSelectedPreset] = useState<typeof DIGITAL_TASBEEH_PRESETS[0]>(DIGITAL_TASBEEH_PRESETS[0]);
  const [tasbeehCount, setTasbeehCount] = useState<number>(0);
  const [totalTasbeehSession, setTotalTasbeehSession] = useState<number>(0);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun': return <Sun className="w-5 h-5 text-amber-500" />;
      case 'Moon': return <Moon className="w-5 h-5 text-indigo-400" />;
      case 'BedDouble': return <BedDouble className="w-5 h-5 text-purple-400" />;
      case 'Flame': return <Flame className="w-5 h-5 text-rose-500" />;
      case 'Compass': return <Compass className="w-5 h-5 text-teal-400" />;
      case 'BookOpen':
      default: return <BookOpen className="w-5 h-5 text-emerald-400" />;
    }
  };

  const currentAzkarList = AZKAR_ITEMS.filter(z => z.category === activeCategory);

  const handleIncrementZikr = (item: ZikrItem) => {
    const current = zikrCounts[item.id] || 0;
    if (current < item.repeatTarget) {
      const next = current + 1;
      setZikrCounts(prev => ({ ...prev, [item.id]: next }));
      if (next === item.repeatTarget) {
        showToast('تقبل الله منك! تم إكمال هذا الذكر المبارك ✓');
      }
    }
  };

  const handleResetZikr = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setZikrCounts(prev => ({ ...prev, [id]: 0 }));
  };

  const handleTasbeehClick = () => {
    setTasbeehCount(prev => prev + 1);
    setTotalTasbeehSession(prev => prev + 1);
    if ((tasbeehCount + 1) % selectedPreset.target === 0) {
      showToast(`أحسنت! أتممت ${selectedPreset.target} تسبيحة 🌟`);
    }
  };

  const handleResetTasbeeh = () => {
    setTasbeehCount(0);
    showToast('تمت إعادة ضبط العداد');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 pb-28 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border border-amber-500/30 rounded-3xl p-6 text-amber-50 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <h1 className="font-arabic-title text-2xl sm:text-3xl font-bold text-amber-200">
                حصن المسلم والسبحة الإلكترونية
              </h1>
            </div>
            <p className="text-sm text-amber-100/80 mt-1">
              أذكار الصباح والمساء، أدعية ما بعد الصلاة، وتسبيح رقمي مع حفظ التكرار.
            </p>
          </div>

          <div className="flex bg-emerald-950/80 p-1 rounded-2xl border border-amber-500/30">
            <button
              onClick={() => setActiveTab('azkar')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'azkar'
                  ? 'bg-amber-500 text-emerald-950 shadow-sm'
                  : 'text-amber-200 hover:text-amber-100'
              }`}
            >
              أذكار المسلم
            </button>
            <button
              onClick={() => setActiveTab('tasbeeh')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'tasbeeh'
                  ? 'bg-amber-500 text-emerald-950 shadow-sm'
                  : 'text-amber-200 hover:text-amber-100'
              }`}
            >
              السبحة الإلكترونية
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'azkar' ? (
        <div className="space-y-6">
          {/* Category Tabs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {AZKAR_CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2 ${
                    isActive
                      ? 'bg-gradient-to-br from-amber-500 to-amber-600 border-amber-300 text-emerald-950 font-bold shadow-md gold-glow'
                      : 'bg-white dark:bg-emerald-950 border-slate-200 dark:border-emerald-800 text-slate-800 dark:text-amber-100 hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{getCategoryIcon(cat.iconName)}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      isActive ? 'bg-emerald-950 text-amber-300' : 'bg-slate-100 dark:bg-emerald-900/80 text-slate-600 dark:text-amber-200'
                    }`}>
                      {cat.badgeCount}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold truncate">{cat.title}</h3>
                    <p className={`text-[10px] truncate ${isActive ? 'text-emerald-900' : 'text-slate-500 dark:text-amber-300/60'}`}>
                      {cat.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Azkar Items List */}
          <div className="space-y-4">
            {currentAzkarList.map(item => {
              const currentCount = zikrCounts[item.id] || 0;
              const isCompleted = currentCount >= item.repeatTarget;

              return (
                <div
                  key={item.id}
                  onClick={() => handleIncrementZikr(item)}
                  className={`p-5 sm:p-6 rounded-3xl border transition-all cursor-pointer select-none relative overflow-hidden ${
                    isCompleted
                      ? 'bg-emerald-500/15 border-emerald-500/50 dark:bg-emerald-950/60'
                      : 'bg-white dark:bg-emerald-950 border-slate-200 dark:border-amber-500/20 hover:border-amber-400 shadow-sm'
                  }`}
                >
                  {/* Progress background bar */}
                  <div
                    className="absolute top-0 right-0 bottom-0 bg-amber-500/10 dark:bg-amber-500/15 pointer-events-none transition-all duration-300"
                    style={{ width: `${(currentCount / item.repeatTarget) * 100}%` }}
                  />

                  <div className="relative z-10 space-y-3 text-right">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {isCompleted && (
                          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>مكتمل ✓</span>
                          </span>
                        )}
                        {item.reference && (
                          <span className="text-[11px] text-slate-500 dark:text-amber-200/70">
                            {item.reference}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={e => handleResetZikr(item.id, e)}
                          title="إعادة التكرار"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-xl">
                          {currentCount} / {item.repeatTarget}
                        </span>
                      </div>
                    </div>

                    {/* Zikr Text */}
                    <p className="font-quran text-lg sm:text-xl text-slate-900 dark:text-amber-100 leading-loose">
                      {item.text}
                    </p>

                    {/* Reward explanation */}
                    {item.reward && (
                      <div className="pt-2 border-t border-slate-100 dark:border-emerald-800/60 flex items-start gap-2 text-xs text-slate-600 dark:text-amber-200/80">
                        <Heart className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>{item.reward}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Digital Tasbeeh Section */
        <div className="space-y-6">
          {/* Preset Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {DIGITAL_TASBEEH_PRESETS.map(preset => {
              const isSelected = selectedPreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedPreset(preset);
                    setTasbeehCount(0);
                    showToast(`تم اختيار: ${preset.title}`);
                  }}
                  className={`p-3 rounded-2xl border text-right transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-emerald-950 border-amber-300 font-bold shadow-md gold-glow'
                      : 'bg-white dark:bg-emerald-950 border-slate-200 dark:border-emerald-800 text-slate-800 dark:text-amber-100'
                  }`}
                >
                  <h4 className="text-xs sm:text-sm font-bold truncate">{preset.title}</h4>
                  <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-emerald-950' : 'text-slate-500 dark:text-amber-300/60'}`}>
                    الهدف: {preset.target} مرة
                  </span>
                </button>
              );
            })}
          </div>

          {/* Interactive Digital Tasbeeh Dial */}
          <div className="bg-gradient-to-b from-emerald-950 via-[#032920] to-emerald-950 border-2 border-amber-400/40 rounded-3xl p-8 sm:p-12 text-center shadow-2xl gold-glow flex flex-col items-center justify-center space-y-6">
            
            <div className="space-y-1">
              <span className="text-xs text-amber-300/80 bg-emerald-900/60 px-3 py-1 rounded-full border border-amber-500/20">
                الذكر الحالي المحدد
              </span>
              <h2 className="font-quran text-2xl sm:text-3xl font-bold text-amber-200 mt-2">
                {selectedPreset.title}
              </h2>
              <p className="text-xs text-amber-100/70">{selectedPreset.meaning}</p>
            </div>

            {/* Tap Button Ring */}
            <button
              onClick={handleTasbeehClick}
              className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 border-4 border-amber-300 text-emerald-950 flex flex-col items-center justify-center shadow-2xl gold-glow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <span className="text-4xl sm:text-5xl font-black font-mono">
                {tasbeehCount}
              </span>
              <span className="text-xs font-bold text-emerald-950/80 mt-1">
                الهدف: {selectedPreset.target}
              </span>
              <span className="text-[11px] font-semibold text-emerald-950/70 mt-2">
                انقر للتسبيح 👆
              </span>
            </button>

            {/* Session Stats & Reset */}
            <div className="flex items-center gap-4 text-xs text-amber-200">
              <span>إجمالي تسبيح الجلسة: <strong className="font-mono text-amber-400 text-sm">{totalTasbeehSession}</strong></span>
              <button
                onClick={handleResetTasbeeh}
                className="flex items-center gap-1 bg-emerald-900/80 hover:bg-emerald-800 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-xl transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة تصفير</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
