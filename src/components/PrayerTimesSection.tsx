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
  Navigation,
  Bell,
  BellRing,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useQuran } from '../context/QuranContext';
import { MUADHINS_LIST, playIslamicTone, playAdhanAudio, requestNotificationPermission, triggerPrayerNotification } from '../utils/adhanAudio';
import { POPULAR_CITIES } from '../utils/prayerCalculator';

export const PrayerTimesSection: React.FC = () => {
  const {
    prayerTimes,
    nextPrayer,
    settings,
    updateSettings,
    refreshLocation,
    setActiveTab,
    showToast
  } = useQuran();

  const [isPlayingAdhan, setIsPlayingAdhan] = useState<boolean>(false);
  const [showCityPicker, setShowCityPicker] = useState<boolean>(false);
  const [activeAdhanAudio, setActiveAdhanAudio] = useState<HTMLAudioElement | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const handleSelectCity = (c: typeof POPULAR_CITIES[0]) => {
    updateSettings({
      locationCity: `${c.name} - ${c.country}`,
      lat: c.lat,
      lng: c.lng,
      autoDetectLocation: false
    });
    setShowCityPicker(false);
    showToast(`تم تغيير المدينة إلى: ${c.name} 🕌`);
  };

  const handleGPSLocation = () => {
    setIsLocating(true);
    refreshLocation();
    setShowCityPicker(false);
    setTimeout(() => setIsLocating(false), 2000);
  };

  const handlePlayAdhan = async () => {
    if (isPlayingAdhan && activeAdhanAudio) {
      activeAdhanAudio.pause();
      activeAdhanAudio.currentTime = 0;
      setIsPlayingAdhan(false);
      setActiveAdhanAudio(null);
      return;
    }

    showToast(`جاري تشغيل صوت الأذان 🕌...`);
    setIsPlayingAdhan(true);
    const audio = await playAdhanAudio(settings.adhanMuadhin);
    if (audio) {
      setActiveAdhanAudio(audio);
      audio.onended = () => {
        setIsPlayingAdhan(false);
        setActiveAdhanAudio(null);
      };
      audio.onerror = () => {
        setIsPlayingAdhan(false);
        setActiveAdhanAudio(null);
      };
    } else {
      setIsPlayingAdhan(false);
      setActiveAdhanAudio(null);
    }
  };

  const handleTestNotification = async () => {
    const perm = await requestNotificationPermission();
    if (perm === 'granted') {
      triggerPrayerNotification(
        `اختبار إشعار الأذان 🕌`,
        `حان الآن موعد صلاة ${nextPrayer.nameArabic} - تقبل الله طاعتكم`
      );
      playIslamicTone();
      showToast('تم إرسال إشعار تجريبي بنجاح 🔔');
    } else {
      showToast('يرجى السماح بالإشعارات من إعدادات المتصفح لتفعيل التنبيهات.');
    }
  };

  const togglePrayerNotification = (key: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha') => {
    const current = settings.adhanNotificationPrayers || {
      fajr: true,
      dhuhr: true,
      asr: true,
      maghrib: true,
      isha: true
    };
    updateSettings({
      adhanNotificationPrayers: {
        ...current,
        [key]: !current[key]
      }
    });
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
      <div className="bg-gradient-to-r from-[#063321] via-[#042118] to-[#063321] border-2 border-[#d4af37]/30 rounded-3xl p-6 text-[#f5f2ed] shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-[#d4af37]" />
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#d4af37]">
                مواقيت الصلاة والأذان
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#f5f2ed]/80 mt-1">
              مواقيت صلاة فلكية دقيقة وتنبيهات أذان حية حسب موقعك الجغرافي والبلد المحدد.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Auto GPS Locate Button */}
            <button
              onClick={handleGPSLocation}
              disabled={isLocating}
              className="flex items-center gap-1.5 bg-[#d4af37] hover:bg-[#c19b2e] text-[#042118] px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'جاري التحديد...' : 'تحديد موقعي التلقائي (GPS)'}</span>
            </button>

            <button
              onClick={() => setShowCityPicker(true)}
              className="flex items-center gap-1.5 bg-[#084d32] hover:bg-[#063321] border border-[#d4af37]/40 text-[#d4af37] px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              <span>{settings.locationCity}</span>
            </button>

            <button
              onClick={() => setActiveTab('qibla')}
              className="flex items-center gap-1.5 bg-[#084d32] border border-[#d4af37]/30 hover:border-[#d4af37] text-[#f5f2ed] px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#d4af37]" />
              <span>اتجاه القبلة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Next Prayer Countdown Card */}
      <div className="bg-gradient-to-br from-[#063321] via-[#042118] to-[#063321] border-2 border-[#d4af37]/50 rounded-3xl p-6 sm:p-8 text-[#f5f2ed] shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-[#d4af37] bg-[#042118] px-3 py-1 rounded-full border border-[#d4af37]/40">
            الصلاة القادمة
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#d4af37] my-2">
            صلاة {nextPrayer.nameArabic}
          </h2>
          <p className="text-xs sm:text-sm text-[#f5f2ed]/80">
            موعد الأذان: <strong className="text-[#d4af37] font-mono text-base">{nextPrayer.timeString}</strong>
          </p>
          <p className="text-xs text-emerald-300 mt-1">
            متبقي حتى موعد الأذان: <span className="font-mono font-bold text-[#d4af37] text-base">{nextPrayer.formattedCountdown}</span>
          </p>
        </div>

        {/* Adhan Play & Test Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <button
            onClick={handlePlayAdhan}
            className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-[#d4af37] hover:bg-[#c19b2e] text-[#042118] font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            {isPlayingAdhan ? (
              <>
                <Pause className="w-5 h-5 fill-[#042118]" />
                <span>إيقاف صوت الأذان</span>
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5" />
                <span>الاستماع لصوت الأذان</span>
              </>
            )}
          </button>

          <button
            onClick={handleTestNotification}
            className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-[#084d32] border border-[#d4af37]/40 hover:bg-[#063321] text-[#d4af37] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <BellRing className="w-4 h-4" />
            <span>تجربة الإشعار 🔔</span>
          </button>
        </div>
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
                  ? 'bg-gradient-to-b from-[#d4af37] to-[#c19b2e] text-[#042118] border-[#d4af37] font-bold shadow-lg scale-105'
                  : 'bg-white dark:bg-[#063321] border-slate-200 dark:border-[#d4af37]/20 text-slate-800 dark:text-[#f5f2ed]'
              }`}
            >
              <div>
                <span className="text-2xl block mb-1">{p.icon}</span>
                <h4 className="text-base font-bold">{p.name}</h4>
              </div>

              <div className="my-2">
                <span className={`text-xl font-bold font-mono ${isNext ? 'text-[#042118]' : 'text-[#d4af37]'}`}>
                  {p.time}
                </span>
              </div>

              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  isNext ? 'bg-[#042118] text-[#d4af37]' : 'bg-slate-100 dark:bg-[#042118] text-slate-500 dark:text-[#d4af37]/80'
                }`}
              >
                {isNext ? 'الصلاة القادمة' : 'مؤكد'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Notification & Muadhin Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Adhan Voice Selector */}
        <div className="bg-white dark:bg-[#063321] border border-slate-200 dark:border-[#d4af37]/25 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-[#d4af37]" />
              <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-[#f5f2ed]">
                صوت المؤذن المعتمد:
              </h3>
            </div>
          </div>

          <div className="space-y-2">
            {MUADHINS_LIST.map(voice => (
              <button
                key={voice.id}
                onClick={() => {
                  updateSettings({ adhanMuadhin: voice.id });
                  showToast(`تم اختيار: ${voice.name} 🕌`);
                }}
                className={`w-full p-3 rounded-2xl border text-right flex items-center justify-between transition-all cursor-pointer ${
                  settings.adhanMuadhin === voice.id
                    ? 'bg-[#d4af37]/20 border-[#d4af37] text-slate-900 dark:text-[#d4af37] font-bold shadow-sm'
                    : 'bg-slate-50 dark:bg-[#042118] border-slate-200 dark:border-[#d4af37]/15 text-slate-700 dark:text-[#f5f2ed]'
                }`}
              >
                <div>
                  <h4 className="text-xs sm:text-sm font-bold">{voice.name}</h4>
                  <span className="text-[10px] text-slate-500 dark:text-[#f5f2ed]/60">{voice.location}</span>
                </div>
                {settings.adhanMuadhin === voice.id && (
                  <span className="text-xs bg-[#d4af37] text-[#042118] px-2 py-0.5 rounded-lg font-bold">
                    محدد ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Adhan Notification Settings */}
        <div className="bg-white dark:bg-[#063321] border border-slate-200 dark:border-[#d4af37]/25 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#d4af37]" />
            <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-[#f5f2ed]">
              إعدادات تنبيهات الأذان والإشعارات:
            </h3>
          </div>

          {/* Master Adhan Switch */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#042118] border border-slate-200 dark:border-[#d4af37]/20 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-[#f5f2ed] block">
                تفعيل الإشعارات والأذان
              </span>
              <span className="text-[11px] text-slate-500 dark:text-[#f5f2ed]/60">
                إرسال إشعار وتشغيل الأذان عند دخول وقت الصلاة
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.adhanNotification}
              onChange={e => {
                updateSettings({ adhanNotification: e.target.checked });
                if (e.target.checked) requestNotificationPermission();
              }}
              className="w-5 h-5 accent-[#d4af37] cursor-pointer"
            />
          </div>

          {/* Pre-adhan Reminder selector */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-[#f5f2ed]/80">
              التنبيه المبكر قبل دخول الوقت:
            </label>
            <select
              value={settings.adhanReminderMinutes || 0}
              onChange={e => updateSettings({ adhanReminderMinutes: Number(e.target.value) })}
              className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-[#042118] border border-slate-200 dark:border-[#d4af37]/30 text-xs text-slate-800 dark:text-[#f5f2ed] font-bold focus:outline-none focus:border-[#d4af37]"
            >
              <option value={0}>عند موعد الأذان مباشرة</option>
              <option value={5}>قبل الأذان بـ 5 دقائق</option>
              <option value={10}>قبل الأذان بـ 10 دقائق</option>
              <option value={15}>قبل الأذان بـ 15 دقيقة</option>
            </select>
          </div>

          {/* Per-Prayer Toggles */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-[#f5f2ed]/80">
              تفعيل التنبيه للصلوات المحددة:
            </label>
            <div className="grid grid-cols-5 gap-1.5 text-center">
              {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map(pKey => {
                const names: Record<string, string> = {
                  fajr: 'الفجر',
                  dhuhr: 'الظهر',
                  asr: 'العصر',
                  maghrib: 'المغرب',
                  isha: 'العشاء'
                };
                const isEnabled = settings.adhanNotificationPrayers?.[pKey] ?? true;
                return (
                  <button
                    key={pKey}
                    onClick={() => togglePrayerNotification(pKey)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      isEnabled
                        ? 'bg-[#d4af37] text-[#042118] border-[#d4af37]'
                        : 'bg-slate-100 dark:bg-[#042118] text-slate-400 dark:text-[#f5f2ed]/40 border-slate-300 dark:border-[#d4af37]/20'
                    }`}
                  >
                    {names[pKey]}
                  </button>
                );
              })}
            </div>
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
              className="bg-white dark:bg-[#042118] border-2 border-[#d4af37]/40 rounded-3xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-[#d4af37]/25 flex justify-between items-center bg-[#063321] text-[#f5f2ed]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#d4af37]" />
                  <h3 className="font-bold text-base text-[#d4af37]">اختر مدينتك لحساب المواقيت</h3>
                </div>
                <button
                  onClick={() => setShowCityPicker(false)}
                  className="p-1 rounded-lg bg-[#084d32] text-[#d4af37] hover:bg-[#063321] cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 space-y-3 overflow-y-auto flex-1">
                {/* GPS Auto Button */}
                <button
                  onClick={handleGPSLocation}
                  className="w-full py-3 px-4 rounded-2xl bg-[#d4af37] hover:bg-[#c19b2e] text-[#042118] font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  <span>تحديد موقعي التلقائي والبلد عبر GPS 📍</span>
                </button>

                <div className="space-y-1.5 pt-2">
                  {POPULAR_CITIES.map(c => (
                    <button
                      key={c.name}
                      onClick={() => handleSelectCity(c)}
                      className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#063321] border border-slate-200 dark:border-[#d4af37]/20 hover:border-[#d4af37] text-right flex items-center justify-between text-xs transition-colors cursor-pointer"
                    >
                      <span className="font-bold text-slate-800 dark:text-[#f5f2ed]">{c.name}</span>
                      <span className="text-slate-500 dark:text-[#d4af37]">{c.country}</span>
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
