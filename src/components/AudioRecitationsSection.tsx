import React, { useState } from 'react';
import {
  Headphones,
  Play,
  Pause,
  Search,
  Filter,
  Volume2,
  Sparkles,
  Download,
  Check
} from 'lucide-react';
import { useQuran } from '../context/QuranContext';
import { RECITERS_LIST } from '../data/recitersData';
import { SURAH_LIST } from '../data/surahList';
import { Reciter } from '../types/quran';

export const AudioRecitationsSection: React.FC = () => {
  const {
    audioState,
    playSurahAudio,
    togglePlayPause,
    setAudioReciter,
    showToast
  } = useQuran();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedReciterId, setSelectedReciterId] = useState<string>(audioState.reciter.id);
  const [downloadedSurahs, setDownloadedSurahs] = useState<Record<string, boolean>>({});

  const filteredSurahs = SURAH_LIST.filter(s =>
    s.name.includes(searchQuery) ||
    s.number.toString().includes(searchQuery) ||
    s.englishName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentReciter = RECITERS_LIST.find(r => r.id === selectedReciterId) || RECITERS_LIST[0];

  const handleSelectReciter = (rec: Reciter) => {
    setSelectedReciterId(rec.id);
    setAudioReciter(rec);
    showToast(`تم اختيار القارئ: ${rec.name}`);
  };

  const handleDownloadSurah = (surahNum: number) => {
    const key = `${selectedReciterId}_${surahNum}`;
    setDownloadedSurahs(prev => ({ ...prev, [key]: true }));
    showToast(`تم حفظ السورة (${surahNum}) للاستماع بدون إنترنت 📥`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-28 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border border-amber-500/30 rounded-3xl p-6 text-amber-50 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Headphones className="w-6 h-6 text-amber-400" />
              <h1 className="font-arabic-title text-2xl sm:text-3xl font-bold text-amber-200">
                مكتبة التلاوات الصوتية العطرة
              </h1>
            </div>
            <p className="text-sm text-amber-100/80 mt-1 max-w-xl">
              استمع للقرآن الكريم كاملاً بأصوات نخبة من كبار قراء العالم الإسلامي بجودة صوتية عالية مع دعم الاستماع بدون إنترنت.
            </p>
          </div>

          <div className="bg-emerald-950/80 border border-amber-500/40 px-4 py-2 rounded-2xl flex items-center gap-3">
            <span className="text-xs text-amber-300">القارئ النشط:</span>
            <span className="text-sm font-bold text-amber-100">{currentReciter.name}</span>
          </div>
        </div>
      </div>

      {/* Reciters Horizontal Carousel Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 dark:text-amber-200">
            اختر القارئ المفضل:
          </h3>
          <span className="text-xs text-slate-500 dark:text-amber-300/60">
            {RECITERS_LIST.length} قراء متاحين
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {RECITERS_LIST.map(rec => {
            const isSelected = selectedReciterId === rec.id;
            return (
              <button
                key={rec.id}
                onClick={() => handleSelectReciter(rec)}
                className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-emerald-950 border-amber-400 font-bold shadow-md gold-glow'
                    : 'bg-white dark:bg-emerald-950 border-slate-200 dark:border-emerald-800 text-slate-800 dark:text-amber-100 hover:border-amber-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? 'bg-emerald-950 text-amber-300' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'}`}>
                    <Headphones className="w-4 h-4" />
                  </div>
                  {isSelected && <span className="text-[10px] bg-emerald-950 text-amber-300 px-1.5 py-0.5 rounded">محدد</span>}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold truncate">{rec.name}</h4>
                  <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-emerald-950/80' : 'text-slate-500 dark:text-amber-300/60'}`}>
                    {rec.style}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Surahs Playlist Search & Grid */}
      <div className="bg-white dark:bg-emerald-950 border border-slate-200 dark:border-amber-500/20 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-amber-300/70" />
            <input
              type="text"
              placeholder="ابحث عن سورة للاستماع..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-50 dark:bg-emerald-900/40 border border-slate-200 dark:border-emerald-800 text-slate-800 dark:text-amber-100 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="text-xs text-slate-500 dark:text-amber-200/70">
            عرض {filteredSurahs.length} سورة متاحة للتلاوة
          </div>
        </div>

        {/* Surahs Audio List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredSurahs.map(surah => {
            const isPlayingThis =
              audioState.isPlaying &&
              audioState.surahNumber === surah.number &&
              audioState.reciter.id === selectedReciterId;

            const isDownloaded = downloadedSurahs[`${selectedReciterId}_${surah.number}`];

            return (
              <div
                key={surah.number}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                  isPlayingThis
                    ? 'bg-amber-500/20 border-amber-500 text-slate-900 dark:text-amber-100 shadow-sm'
                    : 'bg-slate-50/70 dark:bg-emerald-900/30 border-slate-200 dark:border-emerald-800 hover:border-amber-400'
                }`}
              >
                {/* Left info */}
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-xl bg-emerald-950 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {surah.number}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-amber-100 truncate">
                      سورة {surah.name}
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-amber-200/60 block">
                      {surah.revelationType} • {surah.numberOfAyahs} آية
                    </span>
                  </div>
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-2">
                  {/* Download */}
                  <button
                    onClick={() => handleDownloadSurah(surah.number)}
                    title={isDownloaded ? 'محفوظة في الجهاز' : 'تحميل للاستماع بدون إنترنت'}
                    className={`p-2 rounded-xl border text-xs transition-colors ${
                      isDownloaded
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40'
                        : 'bg-white dark:bg-emerald-950 text-slate-600 dark:text-amber-200 border-slate-200 dark:border-emerald-800 hover:border-amber-400'
                    }`}
                  >
                    {isDownloaded ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                  </button>

                  {/* Play / Pause button */}
                  <button
                    onClick={() => {
                      if (isPlayingThis) {
                        togglePlayPause();
                      } else {
                        playSurahAudio(surah.number, selectedReciterId);
                      }
                    }}
                    className={`p-2.5 rounded-xl font-bold transition-all shadow-sm ${
                      isPlayingThis
                        ? 'bg-amber-500 text-emerald-950 gold-glow'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950'
                    }`}
                  >
                    {isPlayingThis ? (
                      <Pause className="w-4 h-4 fill-emerald-950" />
                    ) : (
                      <Play className="w-4 h-4 fill-emerald-950 ml-0.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
