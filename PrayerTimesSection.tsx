import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  Volume2,
  MapPin,
  Compass,
  Navigation,
  Bell,
  BellRing,
  Sliders,
  RotateCcw,
  Plus,
  Minus,
  Search,
  BookOpen,
  Info,
  Check,
  CheckCircle2
} from 'lucide-react';
import { useQuran } from '../context/QuranContext';
import { MUADHINS_LIST, playIslamicTone, playAdhanAudio, requestNotificationPermission, triggerPrayerNotification, unlockAudioSystem } from '../utils/adhanAudio';
import { POPULAR_CITIES, CALCULATION_METHODS, CityLocation, formatPrayerTime } from '../utils/prayerCalculator';
import { AppSettings, PrayerOffsets } from '../types/quran';
import { GoogleAdBanner } from './GoogleAdBanner';

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
  const [showOffsetModal, setShowOffsetModal] = useState<boolean>(false);
  const [citySearchQuery, setCitySearchQuery] = useState<string>('');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('الكل');
  const [activeAdhanAudio, setActiveAdhanAudio] = useState<HTMLAudioElement | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Available countries in popular cities
  const countriesList = useMemo(() => {
    const set = new Set(POPULAR_CITIES.map(c => c.country));
    return ['الكل', ...Array.from(set)];
  }, []);

  const filteredCities = useMemo(() => {
    return POPULAR_CITIES.filter(c => {
      const matchSearch =
        c.name.toLowerCase().includes(citySearchQuery.trim().toLowerCase()) ||
        c.country.toLowerCase().includes(citySearchQuery.trim().toLowerCase());
      const matchCountry = selectedCountryFilter === 'الكل' || c.country === selectedCountryFilter;
      return matchSearch && matchCountry;
    });
  }, [citySearchQuery, selectedCountryFilter]);

  const handleSelectCity = (c: CityLocation) => {
    updateSettings({
      locationCity: `${c.name} - ${c.country}`,
      lat: c.lat,
      lng: c.lng,
      prayerCalcMethod: c.defaultMethod,
      autoDetectLocation: false
    });
    setShowCityPicker(false);
    showToast(`تم تغيير المدينة إلى: ${c.name} (${c.country}) وضبط التقويم المعتمد 🕌`);
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
    unlockAudioSystem();
    const perm = await requestNotificationPermission();
    if (perm === 'granted') {
      triggerPrayerNotification(
        `اختبار إشعار الأذان 🕌`,
        `حان الآن موعد صلاة ${nextPrayer.nameArabic} - تقبل الله طاعتكم`
      );
      playIslamicTone();
      showToast('تم إرسال إشعار تجريبي وتنشيط محرك الصوت بنجاح 🔔');
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

  // Adjust minute offset for a specific prayer
  const handleOffsetChange = (prayerKey: keyof PrayerOffsets, delta: number) => {
    const currentOffsets = settings.prayerOffsets || {
      fajr: 0,
      sunrise: 0,
      dhuhr: 0,
      asr: 0,
      maghrib: 0,
      isha: 0
    };
    const newVal = (currentOffsets[prayerKey] || 0) + delta;
    updateSettings({
      prayerOffsets: {
        ...currentOffsets,
        [prayerKey]: newVal
      }
    });
  };

  const handleResetOffsets = () => {
    updateSettings({
      prayerOffsets: {
        fajr: 0,
        sunrise: 0,
        dhuhr: 0,
        asr: 0,
        maghrib: 0,
        isha: 0
      }
    });
    showToast('تمت إعادة ضبط تعديلات الدقائق إلى الصفر (الافتراضي) 🔄');
  };

  const activeMethodObj = CALCULATION_METHODS.find(m => m.id === settings.prayerCalcMethod) || CALCULATION_METHODS[0];

  const prayers = [
    { key: 'fajr' as const, name: 'الفجر', time: prayerTimes.fajr, icon: '🌅', offset: settings.prayerOffsets?.fajr || 0 },
    { key: 'sunrise' as const, name: 'الشروق', time: prayerTimes.sunrise, icon: '☀️', offset: settings.prayerOffsets?.sunrise || 0 },
    { key: 'dhuhr' as const, name: 'الظهر', time: prayerTimes.dhuhr, icon: '🌞', offset: settings.prayerOffsets?.dhuhr || 0 },
    { key: 'asr' as const, name: 'العصر', time: prayerTimes.asr, icon: '🌤️', offset: settings.prayerOffsets?.asr || 0 },
    { key: 'maghrib' as const, name: 'المغرب', time: prayerTimes.maghrib, icon: '🌇', offset: settings.prayerOffsets?.maghrib || 0 },
    { key: 'isha' as const, name: 'العشاء', time: prayerTimes.isha, icon: '🌙', offset: settings.prayerOffsets?.isha || 0 }
  ];

  const totalActiveOffsets = Object.values(settings.prayerOffsets || {}).reduce<number>(
    (acc, v) => acc + (typeof v === 'number' && v !== 0 ? 1 : 0),
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 pb-28 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#063321] via-[#042118] to-[#063321] border-2 border-[#d4af37]/30 rounded-3xl p-6 text-[#f5f2ed] shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-[#d4af37]" />
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#d4af37]">
                مواقيت الصلاة والأذان المعتمدة
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#f5f2ed]/80 mt-1">
              حساب فلكي دقيق ومباشر متوافق مع تقويم أم القرى بالمملكة العربية السعودية وكبرى الهيئات الإسلامية.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-[11px] bg-[#042118] text-[#d4af37] px-2.5 py-0.5 rounded-lg border border-[#d4af37]/30 flex items-center gap-1 font-semibold">
                <BookOpen className="w-3 h-3 text-[#d4af37]" />
                التقويم: {activeMethodObj.name}
              </span>
              <span className="text-[11px] bg-[#042118] text-emerald-300 px-2.5 py-0.5 rounded-lg border border-emerald-500/30 font-semibold">
                المذهب: {settings.juristicMethod === 'shafii' ? 'الجمهور (شافعي/حنبلي/مالكي)' : 'المذهب الحنفي'}
              </span>
              {totalActiveOffsets > 0 && (
                <span className="text-[11px] bg-[#d4af37]/20 text-[#d4af37] px-2 py-0.5 rounded-lg border border-[#d4af37]/40 font-bold animate-pulse">
                  تم تطبيق ضبط يدوي بالدقائق ({totalActiveOffsets} صلوات)
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end">
            {/* Auto GPS Locate Button */}
            <button
              onClick={handleGPSLocation}
              disabled={isLocating}
              className="flex items-center gap-1.5 bg-[#d4af37] hover:bg-[#c19b2e] text-[#042118] px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              title="تحديد الموقع الجغرافي وحساب المواقيت والقبلة بالـ GPS"
            >
              <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'جاري التحديد...' : 'تحديد موقعي التلقائي (GPS)'}</span>
            </button>

            {/* City Selector */}
            <button
              onClick={() => setShowCityPicker(true)}
              className="flex items-center gap-1.5 bg-[#084d32] hover:bg-[#063321] border border-[#d4af37]/40 text-[#d4af37] px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              <span>{settings.locationCity}</span>
            </button>

            {/* Manual Calibration Modal Button */}
            <button
              onClick={() => setShowOffsetModal(true)}
              className="flex items-center gap-1.5 bg-[#084d32] hover:bg-[#063321] border border-[#d4af37]/40 text-[#f5f2ed] hover:text-[#d4af37] px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              title="تعديل وضبط دقائق الصلاة يدوياً لتطابق مسجد حيك تماماً"
            >
              <Sliders className="w-4 h-4 text-[#d4af37]" />
              <span>ضبط الدقائق (+/-)</span>
            </button>

            {/* Qibla Button */}
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
            موعد الأذان: <strong className="text-[#d4af37] font-mono text-base">{formatPrayerTime(nextPrayer.timeString, settings.timeFormat || '12h')}</strong>
          </p>
          <p className="text-xs text-emerald-300 mt-1">
            متبقي حتى موعد الأذان: <span className="font-mono font-bold text-[#d4af37] text-base">{nextPrayer.formattedCountdown}</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            التاريخ الهجري: {prayerTimes.hijriDate || '1448 هـ'}
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
                <Volume2 className="w-5 h-5 fill-[#042118]" />
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

      {/* Prayers 6 Cards Grid with Minute Offsets Display */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {prayers.map(p => {
          const isNext = nextPrayer.nameArabic === p.name;
          const displayTime = formatPrayerTime(p.time, settings.timeFormat || '12h');
          return (
            <div
              key={p.key}
              className={`p-4 rounded-3xl border text-center transition-all flex flex-col justify-between relative group ${
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
                <span className={`text-base sm:text-lg font-bold font-mono ${isNext ? 'text-[#042118]' : 'text-[#d4af37]'}`}>
                  {displayTime}
                </span>
                {p.offset !== 0 && (
                  <span className={`block text-[10px] font-mono font-bold mt-0.5 ${isNext ? 'text-[#042118]/80' : 'text-emerald-400'}`}>
                    ({p.offset > 0 ? `+${p.offset}` : p.offset} دقيقة)
                  </span>
                )}
              </div>

              <div className="flex items-center justify-center gap-1">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isNext ? 'bg-[#042118] text-[#d4af37]' : 'bg-slate-100 dark:bg-[#042118] text-slate-500 dark:text-[#d4af37]/80'
                  }`}
                >
                  {isNext ? 'الصلاة القادمة' : 'مؤكد'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Method and Juristic Settings Bar */}
      <div className="bg-white dark:bg-[#063321] border border-slate-200 dark:border-[#d4af37]/25 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-[#d4af37]/20 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#d4af37]" />
            <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-[#f5f2ed]">
              طريقة الحساب والتقويم الفلكي المعتمد:
            </h3>
          </div>
          <span className="text-xs text-[#d4af37] font-semibold">
            {activeMethodObj.country}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-[#f5f2ed]/80 block">
              التقويم / الهيئة الشرعية:
            </label>
            <select
              value={settings.prayerCalcMethod}
              onChange={e => {
                const newMethod = e.target.value as AppSettings['prayerCalcMethod'];
                updateSettings({ prayerCalcMethod: newMethod });
                showToast(`تم تغيير التقويم إلى: ${CALCULATION_METHODS.find(m => m.id === newMethod)?.name} 🕌`);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-[#042118] border border-slate-200 dark:border-[#d4af37]/30 text-xs text-slate-800 dark:text-[#f5f2ed] font-bold focus:outline-none focus:border-[#d4af37] cursor-pointer"
            >
              {CALCULATION_METHODS.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.country})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 dark:text-[#f5f2ed]/60">
              قاعدة العشاء: {activeMethodObj.ishaRule} • زاوية الفجر: {activeMethodObj.fajrAngle}°
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-[#f5f2ed]/80 block">
              المذهب الفقهي لحساب وقت صلاة العصر:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  updateSettings({ juristicMethod: 'shafii' });
                  showToast('تم اختيار مذهب الجمهور (الشافعي/الحنبلي/المالكي) لصلاة العصر');
                }}
                className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                  settings.juristicMethod === 'shafii'
                    ? 'bg-[#d4af37] text-[#042118] border-[#d4af37] shadow-sm'
                    : 'bg-slate-50 dark:bg-[#042118] border-slate-200 dark:border-[#d4af37]/20 text-slate-700 dark:text-[#f5f2ed]'
                }`}
              >
                الجمهور (ظل مثل واحد)
              </button>
              <button
                onClick={() => {
                  updateSettings({ juristicMethod: 'hanafi' });
                  showToast('تم اختيار المذهب الحنفي لصلاة العصر');
                }}
                className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                  settings.juristicMethod === 'hanafi'
                    ? 'bg-[#d4af37] text-[#042118] border-[#d4af37] shadow-sm'
                    : 'bg-slate-50 dark:bg-[#042118] border-slate-200 dark:border-[#d4af37]/20 text-slate-700 dark:text-[#f5f2ed]'
                }`}
              >
                المذهب الحنفي (ظل مثلين)
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-[#f5f2ed]/60">
              في السعودية ومصر وأغلب الدول يُعتمد مذهب الجمهور افتراضياً.
            </p>
          </div>
        </div>
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
                تفعيل إشعارات الأذان بالنظام
              </span>
              <span className="text-[11px] text-slate-500 dark:text-[#f5f2ed]/60">
                إرسال إشعار للنظام مع الاهتزاز عند دخول وقت الصلاة
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.adhanNotification}
              onChange={e => {
                updateSettings({ adhanNotification: e.target.checked });
                if (e.target.checked) {
                  unlockAudioSystem();
                  requestNotificationPermission();
                }
              }}
              className="w-5 h-5 accent-[#d4af37] cursor-pointer"
            />
          </div>

          {/* Adhan Sound on Time Switch */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#042118] border border-slate-200 dark:border-[#d4af37]/20 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-[#f5f2ed] block">
                تشغيل صوت الأذان كاملاً عند دخول الوقت 🔊
              </span>
              <span className="text-[11px] text-slate-500 dark:text-[#f5f2ed]/60">
                رفع الأذان بصوت المؤذن المختار تلقائياً فور دخول وقت الصلاة
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.playAdhanAudioOnTime}
              onChange={e => {
                updateSettings({ playAdhanAudioOnTime: e.target.checked });
                if (e.target.checked) {
                  unlockAudioSystem();
                  showToast('تم تفعيل رفع صوت الأذان تلقائياً عند دخول الوقت 🕌');
                }
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

      {/* Guide Card: How Azan Works in Background and When Phone is Locked */}
      <div className="bg-gradient-to-r from-[#031c14] to-[#063321] border border-[#d4af37]/30 rounded-3xl p-5 text-[#f5f2ed] shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-[#d4af37]" />
          <h3 className="font-bold text-sm sm:text-base text-[#d4af37]">
            كيف يعمل الأذان والتنبيه عند قفل شاشة الهاتف أو إغلاقه؟ 📱
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs leading-relaxed">
          <div className="p-3 rounded-2xl bg-[#042118]/80 border border-[#d4af37]/20 space-y-1">
            <div className="font-bold text-[#d4af37] flex items-center gap-1.5">
              <span>١. تثبيت التطبيق (PWA)</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              اضغط على خيارات المتصفح (⋮) ثم <strong>«تثبيت التطبيق»</strong> أو <strong>«إضافة إلى الشاشة الرئيسية»</strong> ليعمل التطبيق في خلفية النظام كالتطبيقات الرسمية.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[#042118]/80 border border-[#d4af37]/20 space-y-1">
            <div className="font-bold text-[#d4af37] flex items-center gap-1.5">
              <span>٢. السماح بالإشعارات</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              تأكد من الضغط على <strong>«تجربة الإشعار 🔔»</strong> والموافقة على إذن الإشعارات لتصلك تنبيهات الأذان والاهتزاز حتى والشاشة مغلقة.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[#042118]/80 border border-[#d4af37]/20 space-y-1">
            <div className="font-bold text-[#d4af37] flex items-center gap-1.5">
              <span>٣. إبقاء التطبيق بالخلفية</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              لا تقم بإغلاق التطبيق نهائياً من مدير المهام (Recent Apps)، واستثنه من موفر البطارية لضمان دقة الأذان بالثانية.
            </p>
          </div>
        </div>
      </div>

      {/* Halal Google AdSense Slot */}
      <GoogleAdBanner format="horizontal" placementName="صفحة مواقيت الصلاة والأذان" />

      {/* Manual Minute Offset Calibrator Modal */}
      <AnimatePresence>
        {showOffsetModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#042118] border-2 border-[#d4af37]/40 rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-[#d4af37]/25 flex justify-between items-center bg-[#063321] text-[#f5f2ed]">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#d4af37]" />
                  <div>
                    <h3 className="font-bold text-base text-[#d4af37]">المعايرة الدقيقة لمواقيت الصلاة (+/- دقيقة)</h3>
                    <p className="text-[11px] text-slate-300">عدّل الدقائق لتطابق توقيت أذان المسجد في حيك تماماً</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowOffsetModal(false)}
                  className="p-1.5 rounded-lg bg-[#084d32] text-[#d4af37] hover:bg-[#063321] cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 space-y-4 overflow-y-auto flex-1">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    إذا كان توقيت المسجد أو ساعتك يختلف بمقدار دقيقة أو دقيقتين عن الحساب الفلكي، يمكنك زيادة أو إنقاص الدقائق لكل صلاة بشكل مستقل وسيقوم التطبيق بحفظها فوراً.
                  </span>
                </div>

                <div className="space-y-2.5">
                  {prayers.map(p => (
                    <div
                      key={p.key}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#063321] border border-slate-200 dark:border-[#d4af37]/20 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{p.icon}</span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 dark:text-[#f5f2ed]">{p.name}</h4>
                          <span className="text-xs font-mono font-bold text-[#d4af37]">{p.time}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleOffsetChange(p.key, -1)}
                          className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-[#042118] border border-slate-300 dark:border-[#d4af37]/30 text-slate-800 dark:text-[#f5f2ed] font-bold text-sm flex items-center justify-center hover:bg-rose-500/20 hover:text-rose-400 cursor-pointer active:scale-95 transition-all"
                          title="إنقاص دقيقة (-1)"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <span className={`w-14 text-center text-xs font-mono font-bold ${p.offset !== 0 ? 'text-[#d4af37]' : 'text-slate-500'}`}>
                          {p.offset > 0 ? `+${p.offset}` : p.offset} د
                        </span>

                        <button
                          onClick={() => handleOffsetChange(p.key, 1)}
                          className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-[#042118] border border-slate-300 dark:border-[#d4af37]/30 text-slate-800 dark:text-[#f5f2ed] font-bold text-sm flex items-center justify-center hover:bg-emerald-500/20 hover:text-emerald-400 cursor-pointer active:scale-95 transition-all"
                          title="زيادة دقيقة (+1)"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <button
                    onClick={handleResetOffsets}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#042118] border border-slate-300 dark:border-[#d4af37]/30 text-xs font-bold text-slate-700 dark:text-[#f5f2ed] hover:text-[#d4af37] flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>تصفير التعديلات</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowOffsetModal(false);
                      showToast('تم حفظ تعديلات المواقيت بنجاح ✓');
                    }}
                    className="px-5 py-2 rounded-xl bg-[#d4af37] hover:bg-[#c19b2e] text-[#042118] text-xs font-bold cursor-pointer"
                  >
                    حفظ وإغلاق ✓
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* City Selector Modal with Country Tabs and Search */}
      <AnimatePresence>
        {showCityPicker && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#042118] border-2 border-[#d4af37]/40 rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-[#d4af37]/25 flex justify-between items-center bg-[#063321] text-[#f5f2ed]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#d4af37]" />
                  <h3 className="font-bold text-base text-[#d4af37]">اختر مدينتك (السعودية، مصر، العراق، الخليج، والعالم)</h3>
                </div>
                <button
                  onClick={() => setShowCityPicker(false)}
                  className="p-1.5 rounded-lg bg-[#084d32] text-[#d4af37] hover:bg-[#063321] cursor-pointer"
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
                  <span>تحديد موقعي التلقائي والبلد فورياً عبر GPS 📍</span>
                </button>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                  <input
                    type="text"
                    value={citySearchQuery}
                    onChange={e => setCitySearchQuery(e.target.value)}
                    placeholder="ابحث عن المدينة (مثال: مكة، الرياض، القاهرة، الموصل، دبي...)"
                    className="w-full py-2.5 pr-10 pl-3 rounded-xl bg-slate-50 dark:bg-[#063321] border border-slate-200 dark:border-[#d4af37]/30 text-xs text-slate-800 dark:text-[#f5f2ed] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                {/* Country Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {countriesList.map(country => (
                    <button
                      key={country}
                      onClick={() => setSelectedCountryFilter(country)}
                      className={`px-3 py-1 rounded-full whitespace-nowrap text-[11px] font-bold border transition-colors cursor-pointer ${
                        selectedCountryFilter === country
                          ? 'bg-[#d4af37] text-[#042118] border-[#d4af37]'
                          : 'bg-slate-100 dark:bg-[#063321] text-slate-600 dark:text-[#f5f2ed]/70 border-slate-200 dark:border-[#d4af37]/20'
                      }`}
                    >
                      {country}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5 pt-1">
                  {filteredCities.map(c => {
                    const isSelected = settings.locationCity.includes(c.name);
                    return (
                      <button
                        key={c.name}
                        onClick={() => handleSelectCity(c)}
                        className={`w-full p-3 rounded-2xl border text-right flex items-center justify-between text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37] font-bold'
                            : 'bg-slate-50 dark:bg-[#063321] border-slate-200 dark:border-[#d4af37]/20 hover:border-[#d4af37] text-slate-800 dark:text-[#f5f2ed]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                          <span className="font-bold">{c.name}</span>
                          <span className="text-[10px] text-slate-500 dark:text-[#f5f2ed]/60">({c.country})</span>
                        </div>
                        <span className="text-[10px] text-[#d4af37] font-mono bg-[#042118] px-2 py-0.5 rounded border border-[#d4af37]/20">
                          {c.defaultMethod === 'Makkah' ? 'أم القرى' : c.defaultMethod === 'Egypt' ? 'المساحة المصرية' : c.defaultMethod}
                        </span>
                      </button>
                    );
                  })}
                  {filteredCities.length === 0 && (
                    <div className="text-center py-6 text-xs text-slate-400">
                      لم يتم العثور على نتائج بحث تطابق "{citySearchQuery}". يمكنك استخدام التحديد التلقائي بالـ GPS.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
