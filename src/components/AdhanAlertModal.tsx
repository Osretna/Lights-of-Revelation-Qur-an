import React from 'react';
import { Volume2, VolumeX, Sparkles, X, Check } from 'lucide-react';
import { soundManager } from '../utils/soundManager';

interface AdhanAlertModalProps {
  isOpen: boolean;
  prayerName: string;
  cityName: string;
  onClose: () => void;
}

export const AdhanAlertModal: React.FC<AdhanAlertModalProps> = ({
  isOpen,
  prayerName,
  cityName,
  onClose
}) => {
  if (!isOpen) return null;

  const handleStop = () => {
    soundManager.stopAdhan();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-gradient-to-b from-slate-900 via-slate-850 to-emerald-950/90 border-2 border-emerald-500/50 rounded-3xl w-full max-w-md p-6 shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Animated Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-72 h-72 rounded-full border border-emerald-400 animate-ping"></div>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 mx-auto flex items-center justify-center text-3xl animate-bounce">
            🕌
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
              حان الآن
            </span>
            <h2 className="text-3xl font-extrabold text-white font-cairo pt-1">
              أذان صلاة {prayerName}
            </h2>
            <p className="text-xs text-slate-300">
              بتوقيت مدينة {cityName} وضواحيها
            </p>
          </div>

          {/* Duaa after Adhan */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
            <p className="font-bold text-emerald-300">دعاء ما بعد الأذان:</p>
            <p className="font-quran text-sm leading-relaxed text-slate-100">
              «اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ القَائِمَةِ، آتِ مُحَمَّداً الوَسِيلَةَ وَالفَضِيلَةَ، وَابْعَثْهُ مَقَاماً مَحْمُوداً الَّذِي وَعَدْتَهُ»
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              id="stop-adhan-alert-btn"
              onClick={handleStop}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-950 active:scale-95 transition-all"
            >
              <VolumeX className="w-4 h-4" />
              <span>إيقاف صوت الأذان</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
