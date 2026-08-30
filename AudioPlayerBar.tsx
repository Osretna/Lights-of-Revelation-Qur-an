import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Repeat,
  Gauge,
  Headphones,
  Volume2,
  Maximize2,
  Minimize2,
  X,
  Clock,
  ListMusic,
  Loader2
} from 'lucide-react';
import { useQuran } from '../context/QuranContext';
import { SURAH_LIST } from '../data/surahList';
import { RECITERS_LIST } from '../data/recitersData';

export const AudioPlayerBar: React.FC = () => {
  const {
    audioState,
    togglePlayPause,
    skipNextAyah,
    skipPrevAyah,
    setAudioSpeed,
    setAudioRepeatMode,
    setAudioReciter,
    seekAudioTo,
    playSurahAudio,
    showToast
  } = useQuran();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showReciterPicker, setShowReciterPicker] = useState<boolean>(false);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);

  const currentSurah = SURAH_LIST.find(s => s.number === audioState.surahNumber) || SURAH_LIST[0];

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds === 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seekAudioTo(Number(e.target.value));
  };

  const handleSleepTimer = (mins: number) => {
    setSleepTimerMinutes(mins);
    showToast(`تم تفعيل مؤقت النوم: سيتوقف الصوت بعد ${mins} دقيقة ⏱️`);
    setTimeout(() => {
      togglePlayPause();
      setSleepTimerMinutes(null);
      showToast('انتهى مؤقت النوم وتم إيقاف التلاوة');
    }, mins * 60 * 1000);
  };

  return (
    <>
      {/* Persistent Audio Bottom Bar (Floating above BottomNav) */}
      <div className="fixed bottom-16 sm:bottom-18 left-0 right-0 z-30 px-3 sm:px-6 pointer-events-none">
        <div className="max-w-5xl mx-auto pointer-events-auto">
          <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-amber-50 border-2 border-amber-500/50 rounded-2xl p-2.5 sm:p-3 shadow-2xl gold-glow backdrop-blur-xl flex flex-col gap-1.5">
            
            {/* Top Seek Progress Bar */}
            <div className="flex items-center gap-2 px-1">
              <span className="text-[10px] font-mono text-amber-300/80 w-9 text-right">
                {formatTime(audioState.currentTime)}
              </span>
              <input
                type="range"
                min={0}
                max={audioState.duration || 100}
                value={audioState.currentTime || 0}
                onChange={handleSeek}
                className="w-full h-1 bg-emerald-800 accent-amber-400 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] font-mono text-amber-300/80 w-9 text-left">
                {formatTime(audioState.duration)}
              </span>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between gap-2">
              {/* Reciter & Surah Info */}
              <div
                className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                onClick={() => setShowReciterPicker(true)}
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold flex-shrink-0">
                  <Headphones className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-amber-200 truncate">
                    سورة {currentSurah.name} {audioState.ayahNumber > 0 ? `(آية ${audioState.ayahNumber})` : ''}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-amber-300/70 truncate">
                    بصوت: {audioState.reciter.name} ({audioState.reciter.style})
                  </p>
                </div>
              </div>

              {/* Center Playback Buttons */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Prev Ayah */}
                <button
                  onClick={skipPrevAyah}
                  title="الآية السابقة"
                  className="p-1.5 rounded-lg text-amber-200 hover:text-white hover:bg-emerald-800 transition-colors"
                >
                  <SkipForward className="w-4 h-4 rtl:rotate-180" />
                </button>

                {/* Play / Pause Primary */}
                <button
                  id="audio-main-play-btn"
                  onClick={togglePlayPause}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 flex items-center justify-center shadow-lg gold-glow transition-transform active:scale-95"
                >
                  {audioState.isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-950" />
                  ) : audioState.isPlaying ? (
                    <Pause className="w-5 h-5 fill-emerald-950" />
                  ) : (
                    <Play className="w-5 h-5 fill-emerald-950 ml-0.5" />
                  )}
                </button>

                {/* Next Ayah */}
                <button
                  onClick={skipNextAyah}
                  title="الآية التالية"
                  className="p-1.5 rounded-lg text-amber-200 hover:text-white hover:bg-emerald-800 transition-colors"
                >
                  <SkipBack className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>

              {/* Right: Repeat, Speed, Expand */}
              <div className="flex items-center gap-1 sm:gap-1.5">
                {/* Repeat Mode */}
                <button
                  onClick={() => {
                    const nextMode = audioState.repeatMode === 'none' ? 'ayah' : audioState.repeatMode === 'ayah' ? 'surah' : 'none';
                    setAudioRepeatMode(nextMode);
                  }}
                  title={`وضع التكرار: ${audioState.repeatMode === 'none' ? 'بدون' : audioState.repeatMode === 'ayah' ? 'الآية' : 'السورة'}`}
                  className={`p-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1 ${
                    audioState.repeatMode !== 'none'
                      ? 'bg-amber-500 text-emerald-950 border-amber-400'
                      : 'text-amber-200 hover:bg-emerald-800 border-transparent'
                  }`}
                >
                  <Repeat className="w-3.5 h-3.5" />
                  {audioState.repeatMode === 'ayah' && <span className="text-[9px]">آية</span>}
                  {audioState.repeatMode === 'surah' && <span className="text-[9px]">سورة</span>}
                </button>

                {/* Speed toggle */}
                <button
                  onClick={() => {
                    const speeds = [1, 1.25, 1.5, 0.75];
                    const nextIdx = (speeds.indexOf(audioState.playbackSpeed) + 1) % speeds.length;
                    setAudioSpeed(speeds[nextIdx]);
                  }}
                  className="px-2 py-1 rounded-lg bg-emerald-800/80 text-amber-200 hover:bg-emerald-800 text-[11px] font-mono font-bold"
                >
                  {audioState.playbackSpeed}x
                </button>

                {/* Fullscreen Expand */}
                <button
                  onClick={() => setIsExpanded(true)}
                  title="توسيع مشغل التلاوة"
                  className="p-1.5 rounded-lg text-amber-200 hover:text-white hover:bg-emerald-800 transition-colors"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Audio Player Modal */}
      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 z-50 bg-[#042f2e]/95 backdrop-blur-xl text-amber-50 flex flex-col justify-between p-6 sm:p-10 islamic-pattern overflow-y-auto">
            {/* Top Bar */}
            <div className="flex justify-between items-center max-w-2xl mx-auto w-full">
              <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold text-amber-300">مشغل التلاوات الصوتية الشامل</span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 rounded-xl bg-emerald-900 border border-amber-500/30 text-amber-200 hover:bg-emerald-800"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>

            {/* Center Visual Art & Details */}
            <div className="max-w-md mx-auto w-full my-auto text-center space-y-6 py-6">
              {/* Disc Artwork */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto">
                <div className={`w-full h-full rounded-full border-4 border-amber-400/60 bg-gradient-to-tr from-emerald-950 via-emerald-800 to-emerald-950 flex items-center justify-center shadow-2xl gold-glow-lg ${audioState.isPlaying ? 'animate-[spin_12s_linear_infinite]' : ''}`}>
                  <div className="w-20 h-20 rounded-full border-2 border-amber-400/80 bg-emerald-950 flex items-center justify-center">
                    <Headphones className="w-8 h-8 text-amber-400" />
                  </div>
                </div>
              </div>

              {/* Surah & Reciter Text */}
              <div>
                <h2 className="font-arabic-title text-3xl sm:text-4xl font-extrabold text-amber-300">
                  سورة {currentSurah.name}
                </h2>
                <p className="text-sm text-amber-100/80 mt-1">
                  القارئ: {audioState.reciter.name} ({audioState.reciter.style})
                </p>
                <p className="text-xs text-amber-400/80 font-mono mt-0.5">
                  {currentSurah.revelationType} • {currentSurah.numberOfAyahs} آيات • {audioState.reciter.bitrate}
                </p>
              </div>

              {/* Progress Slider */}
              <div className="space-y-1">
                <input
                  type="range"
                  min={0}
                  max={audioState.duration || 100}
                  value={audioState.currentTime || 0}
                  onChange={handleSeek}
                  className="w-full h-2 bg-emerald-900 accent-amber-400 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-xs font-mono text-amber-200/70">
                  <span>{formatTime(audioState.currentTime)}</span>
                  <span>{formatTime(audioState.duration)}</span>
                </div>
              </div>

              {/* Full Primary Controls */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  onClick={skipPrevAyah}
                  className="p-3 rounded-2xl bg-emerald-900/80 border border-amber-500/30 text-amber-200 hover:bg-emerald-800"
                >
                  <SkipForward className="w-6 h-6 rtl:rotate-180" />
                </button>

                <button
                  onClick={togglePlayPause}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 flex items-center justify-center shadow-xl gold-glow active:scale-95 transition-all"
                >
                  {audioState.isLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-950" />
                  ) : audioState.isPlaying ? (
                    <Pause className="w-8 h-8 fill-emerald-950" />
                  ) : (
                    <Play className="w-8 h-8 fill-emerald-950 ml-1" />
                  )}
                </button>

                <button
                  onClick={skipNextAyah}
                  className="p-3 rounded-2xl bg-emerald-900/80 border border-amber-500/30 text-amber-200 hover:bg-emerald-800"
                >
                  <SkipBack className="w-6 h-6 rtl:rotate-180" />
                </button>
              </div>

              {/* Sleep Timer & Speed Hub */}
              <div className="flex justify-center items-center gap-3 pt-4 border-t border-emerald-800/80">
                {/* Sleep Timer */}
                <div className="flex items-center gap-1.5 bg-emerald-900/80 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>مؤقت النوم:</span>
                  {[15, 30, 60].map(m => (
                    <button
                      key={m}
                      onClick={() => handleSleepTimer(m)}
                      className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                        sleepTimerMinutes === m ? 'bg-amber-500 text-emerald-950' : 'bg-emerald-950 text-amber-200'
                      }`}
                    >
                      {m}د
                    </button>
                  ))}
                </div>

                {/* Reciters modal open */}
                <button
                  onClick={() => setShowReciterPicker(true)}
                  className="flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 px-3 py-1.5 rounded-xl text-xs"
                >
                  <ListMusic className="w-3.5 h-3.5" />
                  <span>تغيير القارئ</span>
                </button>
              </div>
            </div>

            {/* Bottom Dismiss */}
            <div className="max-w-md mx-auto w-full text-center">
              <button
                onClick={() => setIsExpanded(false)}
                className="text-xs text-amber-200/60 hover:text-amber-200"
              >
                تصغير المشغل والعودة للتطبيق
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Reciter Selector Modal */}
      <AnimatePresence>
        {showReciterPicker && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-emerald-950 border border-amber-500/40 rounded-3xl w-full max-w-xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-slate-200 dark:border-emerald-800 flex justify-between items-center bg-emerald-950 text-amber-50">
                <div className="flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-base sm:text-lg text-amber-200">
                    اختيار القارئ المفضل للتلاوة
                  </h3>
                </div>
                <button
                  onClick={() => setShowReciterPicker(false)}
                  className="p-1.5 rounded-xl bg-emerald-900 text-amber-300 hover:bg-emerald-800"
                >
                  ✕
                </button>
              </div>

              <div className="overflow-y-auto p-4 space-y-2.5 flex-1">
                {RECITERS_LIST.map(rec => {
                  const isCurrent = audioState.reciter.id === rec.id;
                  return (
                    <button
                      key={rec.id}
                      onClick={() => {
                        setAudioReciter(rec);
                        setShowReciterPicker(false);
                      }}
                      className={`w-full p-3 rounded-2xl border text-right flex items-center justify-between transition-all ${
                        isCurrent
                          ? 'bg-amber-500/20 border-amber-500 text-emerald-950 dark:text-amber-300 font-bold'
                          : 'bg-slate-50 dark:bg-emerald-900/40 border-slate-200 dark:border-emerald-800 hover:border-amber-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-950 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold">
                          <Headphones className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-amber-100">
                            {rec.name}
                          </h4>
                          <span className="text-xs text-slate-500 dark:text-amber-200/60">
                            رواية حفص عن عاصم • {rec.style} • {rec.bitrate}
                          </span>
                        </div>
                      </div>

                      {isCurrent && (
                        <span className="text-xs bg-amber-500 text-emerald-950 px-2.5 py-1 rounded-lg font-bold">
                          القارئ الحالي ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
