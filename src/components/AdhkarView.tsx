import React, { useState } from 'react';
import { Sparkles, Sun, Moon, CheckCircle2, CloudMoon, RotateCcw, Volume2, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ADHKAR_CATEGORIES, ADHKAR_LIST } from '../data/adhkarData';
import { DhikrItem } from '../types';
import { soundManager } from '../utils/soundManager';

export const AdhkarView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('morning');
  const [adhkarState, setAdhkarState] = useState<DhikrItem[]>(ADHKAR_LIST);
  const [tasbeehCount, setTasbeehCount] = useState<number>(0);
  const [selectedTasbeehZikr, setSelectedTasbeehZikr] = useState<string>('سُبْحَانَ اللَّهِ وَبِحَمْدِهِ');

  const filteredAdhkar = adhkarState.filter(item => item.category === activeCategory);

  const handleIncrementDhikr = (id: string) => {
    soundManager.unlockAudio();
    soundManager.triggerVibration([30]);

    setAdhkarState(prev => prev.map(item => {
      if (item.id === id) {
        const nextCount = item.currentCount + 1;
        if (nextCount === item.count) {
          soundManager.playSuccessChime();
          soundManager.triggerVibration([60, 40, 80]);
        }
        return {
          ...item,
          currentCount: Math.min(item.count, nextCount)
        };
      }
      return item;
    }));
  };

  const handleResetCategory = () => {
    setAdhkarState(prev => prev.map(item => {
      if (item.category === activeCategory) {
        return { ...item, currentCount: 0 };
      }
      return item;
    }));
  };

  const handleTasbeehClick = () => {
    soundManager.unlockAudio();
    soundManager.triggerVibration([35]);
    const next = tasbeehCount + 1;
    setTasbeehCount(next);

    if (next % 33 === 0) {
      soundManager.playSuccessChime();
      soundManager.triggerVibration([50, 50, 100]);
    }
    if (next % 100 === 0) {
      confetti({ particleCount: 40, spread: 50 });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6 pb-24 md:pb-8">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {ADHKAR_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`adhkar-cat-${cat.id}`}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40 scale-105'
                  : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/60'
              }`}
            >
              <span>{cat.title}</span>
            </button>
          );
        })}
      </div>

      {/* Electronic Tasbeeh Mode */}
      {activeCategory === 'tasbeeh' ? (
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-emerald-400 font-cairo">المسبحة الإلكترونية الذكية</h3>
            <p className="text-xs text-slate-400">انقر على الدائرة أو أي مكان للتسبيح مع اهتزاز لمسي</p>
          </div>

          {/* Quick Dhikr Phrases Selector */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
              'سُبْحَانَ اللَّهِ العَظِيمِ',
              'الحَمْدُ لِلَّهِ',
              'لَا إِلَهَ إِلَّا اللَّهُ',
              'اللَّهُ أَكْبَرُ',
              'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
              'اللَّهُمَّ صَلِّ عَلَى نَبِيِّنَا مُحَمَّدٍ'
            ].map((phrase, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedTasbeehZikr(phrase)}
                className={`text-xs px-3 py-1.5 rounded-xl transition-all ${
                  selectedTasbeehZikr === phrase
                    ? 'bg-emerald-500 text-white font-bold'
                    : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-750'
                }`}
              >
                {phrase}
              </button>
            ))}
          </div>

          {/* Selected Dhikr Display */}
          <div className="font-quran text-2xl text-emerald-200 py-3 bg-slate-950/60 rounded-2xl border border-slate-800 px-4">
            {selectedTasbeehZikr}
          </div>

          {/* Big Interactive Tasbeeh Button */}
          <div className="flex justify-center">
            <button
              id="tasbeeh-interactive-button"
              onClick={handleTasbeehClick}
              className="w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 shadow-2xl shadow-emerald-900/60 flex flex-col items-center justify-center text-white border-4 border-emerald-400/40 active:scale-95 transition-all group select-none cursor-pointer"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-100">العدد الحالي</span>
              <span className="text-5xl sm:text-6xl font-mono font-extrabold my-1">{tasbeehCount}</span>
              <span className="text-xs bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-300/30 group-hover:bg-emerald-900">
                اضغط للتسبيح
              </span>
            </button>
          </div>

          {/* Reset Button */}
          <div className="pt-2">
            <button
              onClick={() => setTasbeehCount(0)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 px-4 py-2 rounded-xl mx-auto border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>تصفير العداد</span>
            </button>
          </div>
        </div>
      ) : (
        /* Adhkar Cards List */
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-slate-400">
              اضغط على بطاقة الذكر لاحتساب التكرار
            </p>
            <button
              onClick={handleResetCategory}
              className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة تعيين الأذكار</span>
            </button>
          </div>

          <div className="space-y-3">
            {filteredAdhkar.map((item) => {
              const isCompleted = item.currentCount >= item.count;
              const progress = Math.min(100, Math.round((item.currentCount / item.count) * 100));

              return (
                <div
                  key={item.id}
                  id={`dhikr-card-${item.id}`}
                  onClick={() => handleIncrementDhikr(item.id)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer select-none active:scale-[0.99] ${
                    isCompleted
                      ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md'
                      : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-xs text-emerald-400 font-semibold bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-700">
                      {item.categoryTitle}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-300">
                        {item.currentCount} / {item.count}
                      </span>
                      {isCompleted && (
                        <span className="p-1 rounded-full bg-emerald-500 text-white">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="font-quran text-lg sm:text-xl text-slate-100 leading-relaxed mb-3">
                    {item.text}
                  </p>

                  {item.virtue && (
                    <div className="text-xs text-slate-400 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60 mb-3">
                      <span className="font-semibold text-emerald-400">الفضل: </span>
                      {item.virtue}
                    </div>
                  )}

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-200 ${
                        isCompleted ? 'bg-emerald-400' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
