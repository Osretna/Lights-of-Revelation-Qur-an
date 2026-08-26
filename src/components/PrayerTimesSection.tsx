import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  Volume2,
  VolumeX,
  Play,
  Pause,
  MapPin,
  Calendar,
  Compass,
  Sparkles,
  ChevronLeft,
  Navigation
} from 'lucide-react';
import { useQuran } from '../context/QuranContext';
import { MUADHINS_LIST, playIslamicTone, MuadhinOption } from '../utils/adhanAudio';

export const PrayerTimesSection: React.FC = () => {
  const {
    prayerTimes,
    nextPrayer,
    settings,
    updateSettings,
    setActiveTab,
    showToast
  } = useQuran();

  const [selectedMuadhin, setSelectedMuadhin] = useState<string>(MUADHINS_LIST[0].id);
  const [isPlayingAdhan, setIsPlayingAdhan] = useState<boolean>(false);
  const [showCityPicker, setShowCityPicker] = useState<boolean>(false);
  const [adhanAudioElement, setAdhanAudioElement] = useState<HTMLAudioElement | null>(null);

  const CITIES_LIST = [
    { city: 'مكة المكرمة', country: 'السعودية', lat: 21.4225, lng: 39.8262 },
    { city: 'المدينة المنورة', country: 'السعودية', lat: 24.4672, lng: 39.6111 },
    { city: 'القاهرة', country: 'مصر', lat: 30.0444, lng: 31.2357 },
    { city: 'الرياض', country: 'السعودية', lat: 24.7136, lng: 46.6753 },
    { city: 'القدس الشريف', country: 'فلسطين', lat: 31.7683, lng: 35.2137 },
    { city: 'دبي', country: 'الإمارات', lat: 25.2048, lng: 55.2708 },
    { city: 'الكويت', country: 'الكويت', lat: 29.3759, lng: 47.9774 },
    { city: 'عمّان', country: 'الأردن', lat: 31.9454, lng: 35.9284 },
    { city: 'الدوحة', country: 'قطر', lat: 25.2854, lng: 51.5310 },
    { city: 'الرباط', country: 'المغرب', lat: 34.0209, lng: -6.8416 }
  ];

  const handleSelectCity = (c: typeof CITIES_LIST[0]) => {
    updateSettings({
      locationCity: `${c.city} - ${c.country}`,
      lat: c.lat,
      lng: c.lng
    });
    setShowCityPicker(false);
    showToast(`تم تغيير المدينة إلى: ${c.city}`);
  };

  const handleGPSLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          updateSettings({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            locationCity: 'الموقع الحالي (GPS)'
          });
          setShowCityPicker(false);
          showToast('تم تحديد موقعك بدقة عبر GPS 📍');
        },
        () => {
          showToast('يرجى السماح بالوصول للموقع لتحديد القبلة والمواقيت تلقائياً');
        }
      );
    }
  };

  const handlePlayAdhan = () => {
    if (isPlayingAdhan && adhanAudioElement) {
      adhanAudioElement.pause();
      setIsPlayingAdhan(false);
      return;
    }

    const muadhin = MUADHINS_LIST.find(m => m.id === selectedMuadhin) || MUADHINS_LIST[0];
    const audio = new Audio(muadhin.audioUrl);
    setAdhanAudioElement(audio);
    setIsPlayingAdhan(true);
    showToast(`جاري تشغيل: ${muadhin.name} 🕌`);

    audio.play().catch(() => {
      // Fallback serene Islamic synthesizer tone if offline/blocked
      playIslamicTone();
    });

    audio.onended = () => {
      setIsPlayingAdhan(false);
    };
  };

  const prayers = [
    { key: 'fajr', name: 'الفجر', time: prayerTimes.fajr, icon: '🌅' },
    { key: 'sunrise', name: 'الشروق', time: prayerTimes.sunrise, icon: '☀️' },
    { key: 'dhuhr', name: 'الظهر', time: prayerTimes.dhuhr, icon: '🌞' },
    { key: 'asr', name: 'العصر', time: prayerTimes.asr, icon: '🌤️' },
    { key: 'maghrib', name: 'المغرب', time: prayerTimes.maghrib, icon: '🌇' },
    { key: 'isha', name: 'العشاء', time: prayerTimes.isha, icon: '🌙' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 pb-28 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border border-amber-500/30 rounded-3xl p-6 text-amber-50 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-amber-400" />
              <h1 className="font-arabic-title text-2xl sm:text-3xl font-bold text-amber-200">
                مواقيت الصلاة والأذان
              </h1>
            </div>
            <p className="text-sm text-amber-100/80 mt-1">
              حساب فلكي دقيق لأوقات الصلاة في أي مكان بالعالم بدون الحاجة للإنترنت.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCityPicker(true)}
              className="flex items-center gap-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-amber-500/40 text-amber-200 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>{settings.locationCity}</span>
            </button>

            <button
              onClick={() => setActiveTab('qibla')}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-emerald-950 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Compass className="w-4 h-4" />
              <span>اتجاه القبلة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Countdown Card */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-emerald-900 border-2 border-amber-400/40 rounded-3xl p-6 sm:p-8 text-amber-50 shadow-xl gold-glow relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-amber-300/80 bg-emerald-950/80 px-3 py-1 rounded-full border border-amber-500/30">
            الصلاة القادمة
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-amber-200 my-2">
            صلاة {nextPrayer.nameArabic}
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/80">
            موعد الأذان: <strong className="text-amber-300 font-mono text-base">{nextPrayer.timeString}</strong>
          </p>
          <p className="text-xs text-emerald-300/80 mt-1">
            متبقي حتى موعد الأذان: <span className="font-mono font-bold text-amber-400 text-sm">{nextPrayer.formattedCountdown}</span>
          </p>
        </div>

        {/* Adhan Listen Primary Button */}
        <button
          onClick={handlePlayAdhan}
          className="w-full md:w-auto py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-lg gold-glow transition-all active:scale-95 cursor-pointer"
        >
          {isPlayingAdhan ? (
            <>
              <Pause className="w-5 h-5 fill-emerald-950" />
              <span>إيقاف صوت الأذان</span>
            </>
          ) : (
            <>
              <Volume2 className="w-5 h-5" />
              <span>الاستماع لصوت الأذان الآن</span>
            </>
          )}
        </button>
      </div>

      {/* Prayers 6 Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {prayers.map(p => {
          const isNext = nextPrayer.nameArabic === p.name;
          return (
            <div
              key={p.key}
              className={`p-4 rounded-3xl border text-center transition-all flex flex-col justify-between ${
                isNext
                  ? 'bg-gradient-to-b from-amber-500 to-amber-600 text-emerald-950 border-amber-300 font-bold shadow-lg gold-glow scale-105'
                  : 'bg-white dark:bg-emerald-950 border-slate-200 dark:border-emerald-800 text-slate-800 dark:text-amber-100'
              }`}
            >
              <div>
                <span className="text-2xl block mb-1">{p.icon}</span>
                <h4 className="text-base font-bold">{p.name}</h4>
              </div>

              <div className="my-2">
                <span className={`text-xl font-bold font-mono ${isNext ? 'text-emerald-950' : 'text-amber-600 dark:text-amber-300'}`}>
                  {p.time}
                </span>
              </div>

              <span className={`text-[10px] px-2 py-0.5 rounded-full ${isNext ? 'bg-emerald-950 text-amber-300' : 'bg-slate-100 dark:bg-emerald-900/60 text-slate-500 dark:text-amber-300/60'}`}>
                {isNext ? 'الصلاة القادمة' : 'مؤكد'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Muadhin Voice Selector & Calculation Method */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Adhan Voice Selector */}
        <div className="bg-white dark:bg-emerald-950 border border-slate-200 dark:border-amber-500/20 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-amber-100">
              صوت المؤذن المعتمد:
            </h3>
          </div>

          <div className="space-y-2">
            {MUADHINS_LIST.map(voice => (
              <button
                key={voice.id}
                onClick={() => {
                  setSelectedMuadhin(voice.id);
                  showToast(`تم اختيار: ${voice.name}`);
                }}
                className={`w-full p-3 rounded-2xl border text-right flex items-center justify-between transition-all ${
                  selectedMuadhin === voice.id
                    ? 'bg-amber-500/20 border-amber-500 text-emerald-950 dark:text-amber-300 font-bold'
                    : 'bg-slate-50 dark:bg-emerald-900/30 border-slate-200 dark:border-emerald-800 text-slate-700 dark:text-amber-100'
                }`}
              >
                <div>
                  <h4 className="text-xs sm:text-sm font-bold">{voice.name}</h4>
                  <span className="text-[10px] text-slate-500 dark:text-amber-200/60">{voice.location}</span>
                </div>
                {selectedMuadhin === voice.id && (
                  <span className="text-xs bg-amber-500 text-emerald-950 px-2 py-0.5 rounded font-bold">
                    محدد ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Calculation method & Hijri Calendar Card */}
        <div className="bg-white dark:bg-emerald-950 border border-slate-200 dark:border-amber-500/20 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-amber-100">
                التقويم وطريقة الحساب الفلكي:
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 space-y-1.5">
              <div className="flex justify-between text-xs text-slate-700 dark:text-amber-200">
                <span>التاريخ الهجري:</span>
                <strong className="text-amber-700 dark:text-amber-300">{prayerTimes.hijriDate}</strong>
              </div>
              <div className="flex justify-between text-xs text-slate-700 dark:text-amber-200">
                <span>التاريخ الميلادي:</span>
                <span>{new Date().toLocaleDateString('ar-EG', { dateStyle: 'full' })}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-amber-200/80">
                طريقة الحساب:
              </label>
              <select
                value={settings.prayerCalcMethod}
                onChange={e => updateSettings({ prayerCalcMethod: e.target.value as any })}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-emerald-900/60 border border-slate-200 dark:border-emerald-800 text-slate-800 dark:text-amber-100 text-xs font-semibold focus:outline-none focus:border-amber-500"
              >
                <option value="Makkah">جامعة أم القرى - مكة المكرمة</option>
                <option value="MWL">رابطة العالم الإسلامي (Muslim World League)</option>
                <option value="Egypt">الهيئة العامة المصرية للمساحة</option>
                <option value="ISNA">الجمعية الإسلامية لأمريكا الشمالية (ISNA)</option>
              </select>
            </div>
          </div>

          <div className="text-xs text-slate-500 dark:text-amber-200/60 text-center">
            تطبيق أنوار الوحي يعتمد خوارزميات فلكية عالية الدقة متوافقة مع التقويم المعتمد.
          </div>
        </div>
      </div>

      {/* City Selector Modal */}
      <AnimatePresence>
        {showCityPicker && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-emerald-950 border border-amber-500/40 rounded-3xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-slate-200 dark:border-emerald-800 flex justify-between items-center bg-emerald-950 text-amber-50">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-base text-amber-200">اختر مدينتك لحساب المواقيت</h3>
                </div>
                <button
                  onClick={() => setShowCityPicker(false)}
                  className="p-1 rounded-lg bg-emerald-900 text-amber-300 hover:bg-emerald-800"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 space-y-3 overflow-y-auto flex-1">
                {/* GPS Auto Button */}
                <button
                  onClick={handleGPSLocation}
                  className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Navigation className="w-4 h-4" />
                  <span>تحديد موقعي التلقائي عبر GPS</span>
                </button>

                <div className="space-y-1.5 pt-2">
                  {CITIES_LIST.map(c => (
                    <button
                      key={c.city}
                      onClick={() => handleSelectCity(c)}
                      className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-emerald-900/40 border border-slate-200 dark:border-emerald-800 hover:border-amber-400 text-right flex items-center justify-between text-xs transition-colors"
                    >
                      <span className="font-bold text-slate-800 dark:text-amber-100">{c.city}</span>
                      <span className="text-slate-500 dark:text-amber-300/60">{c.country}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
