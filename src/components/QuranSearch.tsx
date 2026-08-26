import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  BookOpen,
  BookMarked,
  Sparkles,
  ArrowLeft,
  X,
  Clock,
  Filter
} from 'lucide-react';
import { useQuran } from '../context/QuranContext';
import { searchInQuran, SearchResult } from '../data/quranSampleData';

interface QuranSearchProps {
  onClose?: () => void;
  isModal?: boolean;
}

const POPULAR_TOPICS = [
  'الصلاة',
  'الصبر',
  'الجنة',
  'الرحمة',
  'التوبة',
  'الوالدين',
  'التقوى',
  'الرزق',
  'النور'
];

export const QuranSearch: React.FC<QuranSearchProps> = ({ onClose, isModal = false }) => {
  const {
    setSelectedSurahNum,
    setSelectedAyahNum,
    setActiveTab,
    saveReadingProgress
  } = useQuran();

  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'الحمد لله',
    'الرحمن الرحيم',
    'إن مع العسر يسرا',
    'الله نور السماوات'
  ]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      const searchRes = await searchInQuran(query);
      setResults(searchRes);
      setLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectResult = (res: SearchResult) => {
    // Add to recent
    if (query.trim() && !recentSearches.includes(query.trim())) {
      setRecentSearches(prev => [query.trim(), ...prev.slice(0, 5)]);
    }

    setSelectedSurahNum(res.surahNumber);
    setSelectedAyahNum(res.ayahNumberInSurah);
    saveReadingProgress(res.surahNumber, res.ayahNumberInSurah, res.page, res.juz);
    setActiveTab('quran');
    if (onClose) onClose();
  };

  const content = (
    <div className="space-y-5">
      {/* Top Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-amber-300/70" />
        <input
          type="text"
          autoFocus
          placeholder="ابحث بأي كلمة أو جزء من آية (مثل: الصابرين، الحمد لله، الجنة)..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pr-12 pl-12 py-3.5 rounded-2xl bg-white dark:bg-emerald-950 border-2 border-slate-200 dark:border-amber-500/30 text-slate-800 dark:text-amber-100 text-base shadow-sm focus:outline-none focus:border-amber-500 transition-all font-medium"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-amber-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Popular Search Topics Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-bold text-slate-600 dark:text-amber-200/80 flex items-center gap-1 ml-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          موضوعات شائعة:
        </span>
        {POPULAR_TOPICS.map(topic => (
          <button
            key={topic}
            onClick={() => setQuery(topic)}
            className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-emerald-900/40 text-slate-700 dark:text-amber-200 text-xs hover:bg-amber-500 hover:text-emerald-950 transition-all border border-slate-200 dark:border-emerald-800"
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Results or Recents */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-amber-500 space-y-2">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-500 dark:text-amber-200/70">جاري البحث في آيات الذكر الحكيم...</span>
        </div>
      ) : query ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-500 dark:text-amber-200/70">
            <span>نتائج البحث عن "{query}":</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {results.length} آية كريمة
            </span>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 dark:bg-emerald-900/20 rounded-2xl border border-slate-200 dark:border-emerald-800">
              <BookOpen className="w-10 h-10 text-slate-300 dark:text-amber-400/40 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-600 dark:text-amber-200">
                لم نجد آيات مطابقة لكلمة البحث "{query}"
              </p>
              <p className="text-xs text-slate-400 dark:text-amber-200/60 mt-1">
                جرب البحث بكلمة مفردة أو جزء من الكلمة بدون زيادات
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[58vh] overflow-y-auto">
              {results.map((res, idx) => (
                <div
                  key={`${res.surahNumber}_${res.ayahNumberInSurah}_${idx}`}
                  onClick={() => handleSelectResult(res)}
                  className="p-4 rounded-2xl bg-white dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 hover:border-amber-400 dark:hover:border-amber-400 transition-all cursor-pointer shadow-xs group"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/30">
                        سورة {res.surahName}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-amber-200/60">
                        الآية {res.ayahNumberInSurah}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 dark:text-amber-200/50">
                      الجزء {res.juz} • صفحة {res.page}
                    </span>
                  </div>

                  <p className="font-quran text-base sm:text-lg text-slate-800 dark:text-amber-100 leading-relaxed text-right">
                    ﴿{res.text}﴾
                  </p>

                  <div className="flex justify-end mt-2 pt-2 border-t border-slate-100 dark:border-emerald-900/60">
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold group-hover:underline flex items-center gap-1">
                      <span>فتح الآية في المصحف</span>
                      <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Recent Searches list */
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-amber-200/80">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>عمليات البحث السابقة:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {recentSearches.map(term => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-emerald-900/40 text-slate-700 dark:text-amber-200 text-xs border border-slate-200 dark:border-emerald-800 hover:border-amber-400 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-emerald-950 border border-amber-500/40 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-emerald-800 flex justify-between items-center bg-emerald-950 text-amber-50">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-base sm:text-lg text-amber-200">
                البحث الذكي في القرآن الكريم
              </h3>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-emerald-900 text-amber-300 hover:bg-emerald-800"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto flex-1">{content}</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 pb-28 space-y-6">
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border border-amber-500/30 rounded-3xl p-6 text-amber-50 shadow-lg">
        <div className="flex items-center gap-2">
          <Search className="w-6 h-6 text-amber-400" />
          <h1 className="font-arabic-title text-2xl sm:text-3xl font-bold text-amber-200">
            محرك البحث القرآني
          </h1>
        </div>
        <p className="text-sm text-amber-100/80 mt-1">
          ابحث في جميع آيات القرآن الكريم بدقة متناهية وسرعة فائقة بدون تشكيل أو بالتشكيل.
        </p>
      </div>

      <div className="bg-white dark:bg-emerald-950 border border-slate-200 dark:border-amber-500/20 rounded-3xl p-5 sm:p-6 shadow-sm">
        {content}
      </div>
    </div>
  );
};
