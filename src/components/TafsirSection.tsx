import React, { useState } from 'react';
import {
  BookMarked,
  Search,
  BookOpen,
  Play,
  Copy,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Check
} from 'lucide-react';
import { useQuran } from '../context/QuranContext';
import { SURAH_LIST } from '../data/surahList';
import { TAFSIR_SCHOLARS, getTafsirForAyah } from '../data/tafsirData';
import { TafsirScholar } from '../types/quran';

export const TafsirSection: React.FC = () => {
  const { playAyahAudio, showToast } = useQuran();

  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [selectedAyah, setSelectedAyah] = useState<number>(1);
  const [activeScholar, setActiveScholar] = useState<TafsirScholar>('saadi');
  const [copied, setCopied] = useState<boolean>(false);

  const currentSurahMeta = SURAH_LIST.find(s => s.number === selectedSurah) || SURAH_LIST[0];
  const currentScholar = TAFSIR_SCHOLARS.find(s => s.id === activeScholar) || TAFSIR_SCHOLARS[0];
  const tafsirText = getTafsirForAyah(selectedSurah, selectedAyah, activeScholar);

  const handleNextAyah = () => {
    if (selectedAyah < currentSurahMeta.numberOfAyahs) {
      setSelectedAyah(selectedAyah + 1);
    }
  };

  const handlePrevAyah = () => {
    if (selectedAyah > 1) {
      setSelectedAyah(selectedAyah - 1);
    }
  };

  const handleCopyTafsir = () => {
    const text = `تفسير سورة ${currentSurahMeta.name} (آية ${selectedAyah}) - ${currentScholar.name}:\n\n${tafsirText}\n\n- عبر تطبيق أنوار الوحي للقرآن الكريم`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('تم نسخ التفسير إلى الحافظة ✨');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-28 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border border-amber-500/30 rounded-3xl p-6 text-amber-50 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BookMarked className="w-6 h-6 text-amber-400" />
              <h1 className="font-arabic-title text-2xl sm:text-3xl font-bold text-amber-200">
                موسوعة التفاسير القرآنية المعتمدة
              </h1>
            </div>
            <p className="text-sm text-amber-100/80 mt-1 max-w-xl">
              تصفح وقارن بين أمهات كتب التفسير: تفسير السعدي، ابن كثير، الطبري، القرطبي والتفسير الميسر.
            </p>
          </div>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white dark:bg-emerald-950 border border-slate-200 dark:border-amber-500/20 rounded-3xl p-4 sm:p-5 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
        {/* Surah Selector */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-amber-200 block mb-1.5">
            اختر السورة:
          </label>
          <select
            value={selectedSurah}
            onChange={e => {
              setSelectedSurah(Number(e.target.value));
              setSelectedAyah(1);
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-emerald-900/60 border border-slate-200 dark:border-emerald-800 text-slate-800 dark:text-amber-100 text-sm font-semibold focus:outline-none focus:border-amber-500"
          >
            {SURAH_LIST.map(s => (
              <option key={s.number} value={s.number}>
                {s.number}. سورة {s.name} ({s.numberOfAyahs} آية)
              </option>
            ))}
          </select>
        </div>

        {/* Ayah Selector */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-amber-200 block mb-1.5">
            رقم الآية (من 1 إلى {currentSurahMeta.numberOfAyahs}):
          </label>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevAyah}
              disabled={selectedAyah <= 1}
              className="p-2 rounded-xl bg-slate-100 dark:bg-emerald-900/50 text-slate-700 dark:text-amber-200 disabled:opacity-30 hover:bg-emerald-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <input
              type="number"
              min={1}
              max={currentSurahMeta.numberOfAyahs}
              value={selectedAyah}
              onChange={e => {
                const val = Math.max(1, Math.min(currentSurahMeta.numberOfAyahs, Number(e.target.value)));
                setSelectedAyah(val);
              }}
              className="w-full py-2 px-3 text-center rounded-xl bg-slate-50 dark:bg-emerald-900/60 border border-slate-200 dark:border-emerald-800 text-slate-800 dark:text-amber-100 text-sm font-bold focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleNextAyah}
              disabled={selectedAyah >= currentSurahMeta.numberOfAyahs}
              className="p-2 rounded-xl bg-slate-100 dark:bg-emerald-900/50 text-slate-700 dark:text-amber-200 disabled:opacity-30 hover:bg-emerald-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-end gap-2 pt-2 sm:pt-0">
          <button
            onClick={() => playAyahAudio(selectedSurah, selectedAyah)}
            className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm gold-glow transition-all"
          >
            <Play className="w-4 h-4 fill-emerald-950" />
            <span>استماع لتلاوة الآية</span>
          </button>

          <button
            onClick={handleCopyTafsir}
            title="نسخ التفسير"
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-emerald-900/50 text-slate-700 dark:text-amber-200 hover:border-amber-400 border border-slate-200 dark:border-emerald-800 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Scholar Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {TAFSIR_SCHOLARS.map(scholar => {
          const isCurrent = activeScholar === scholar.id;
          return (
            <button
              key={scholar.id}
              onClick={() => setActiveScholar(scholar.id)}
              className={`p-3.5 rounded-2xl border text-center transition-all ${
                isCurrent
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 border-amber-400 font-bold shadow-md gold-glow'
                  : 'bg-white dark:bg-emerald-950 border-slate-200 dark:border-emerald-800 text-slate-800 dark:text-amber-100 hover:border-amber-400'
              }`}
            >
              <h4 className="text-xs sm:text-sm font-bold">{scholar.name}</h4>
              <span className={`text-[10px] block mt-0.5 ${isCurrent ? 'text-emerald-950/80' : 'text-slate-500 dark:text-amber-300/60'}`}>
                {scholar.era}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tafsir Body Card */}
      <div className="bg-white dark:bg-emerald-950 border border-slate-200 dark:border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-200 dark:border-emerald-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-amber-200">
                {currentScholar.bookTitle}
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-amber-300/70 mt-0.5">
              سورة {currentSurahMeta.name} • الآية {selectedAyah}
            </p>
          </div>

          <span className="text-xs bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-amber-300 px-3 py-1 rounded-full border border-emerald-300 dark:border-amber-500/30">
            {currentScholar.name}
          </span>
        </div>

        {/* Tafsir text body */}
        <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/40 dark:bg-emerald-900/30 border border-amber-200/60 dark:border-emerald-800">
          <p className="text-base sm:text-lg text-slate-800 dark:text-amber-100 leading-loose text-justify font-arabic-title">
            {tafsirText}
          </p>
        </div>

        {/* Scholar Bio Info */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800/60 text-xs text-slate-600 dark:text-amber-200/70 space-y-1">
          <p>
            <strong className="text-slate-800 dark:text-amber-300">عن هذا التفسير: </strong>
            {currentScholar.description}
          </p>
        </div>
      </div>
    </div>
  );
};
