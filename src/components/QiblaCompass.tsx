import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  MapPin,
  Navigation,
  Sparkles,
  RotateCw,
  Sun,
  ShieldCheck,
  Smartphone,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useQuran } from '../context/QuranContext';
import {
  calculateQiblaDirection,
  calculateDistanceToKaaba,
  calculateSunPosition,
  POPULAR_CITIES,
  CityLocation
} from '../utils/prayerCalculator';
import { playIslamicTone } from '../utils/adhanAudio';

export const QiblaCompass: React.FC = () => {
  const { settings, updateSettings, refreshLocation, showToast } = useQuran();

  const [heading, setHeading] = useState<number>(0);
  const [hasCompassSensor, setHasCompassSensor] = useState<boolean>(false);
  const [needsPermission, setNeedsPermission] = useState<boolean>(false);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const [showCityPicker, setShowCityPicker] = useState<boolean>(false);
  const [hasTriggeredAlignedFeedback, setHasTriggeredAlignedFeedback] = useState<boolean>(false);

  // Math calculation from coordinates to Kaaba
  const qiblaAngle = calculateQiblaDirection(settings.lat, settings.lng);
  const distanceKm = calculateDistanceToKaaba(settings.lat, settings.lng);

  // Live Sun calculation for daytime physical verification
  const [sunData, setSunData] = useState(() => calculateSunPosition(new Date(), settings.lat, settings.lng));

  useEffect(() => {
    const timer = setInterval(() => {
      setSunData(calculateSunPosition(new Date(), settings.lat, settings.lng));
    }, 60000);
    return () => clearInterval(timer);
  }, [settings.lat, settings.lng]);

  // Request iOS Sensor Permissions
  const requestCompassPermission = async () => {
    try {
      const DeviceOrientationEventAny = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };
      if (typeof DeviceOrientationEventAny.requestPermission === 'function') {
        const response = await DeviceOrientationEventAny.requestPermission();
        if (response === 'granted') {
          setNeedsPermission(false);
          setHasCompassSensor(true);
          showToast('تم تفعيل مستشعر البوصلة المغناطيسي بنجاح 🧭');
        } else {
          showToast('تم رفض إذن مستشعر البوصلة، يمكنك استخدام المحاذاة اليدوية.');
        }
      }
    } catch (err) {
      console.warn('iOS orientation permission error:', err);
    }
  };

  // High precision GPS Watch
  useEffect(() => {
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        pos => {
          setGpsAccuracy(Math.round(pos.coords.accuracy));
        },
        err => {
          console.warn('GPS Watch error', err);
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // Sensor Listener with Exponential Moving Average (Dampening)
  const headingRef = useRef<number>(0);
  useEffect(() => {
    const DeviceOrientationEventAny = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };
    if (typeof DeviceOrientationEventAny.requestPermission === 'function') {
      setNeedsPermission(true);
    }

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const anyEvent = e as unknown as { webkitCompassHeading?: number; alpha: number | null };
      let newHeading: number | null = null;

      if (anyEvent.webkitCompassHeading !== undefined && anyEvent.webkitCompassHeading !== null) {
        // iOS True Compass Heading
        newHeading = anyEvent.webkitCompassHeading;
        setHasCompassSensor(true);
      } else if (anyEvent.alpha !== null) {
        // Android Magnetometer / Gyro
        newHeading = (360 - anyEvent.alpha) % 360;
        setHasCompassSensor(true);
      }

      if (newHeading !== null) {
        // Smooth transition over 0/360 boundary
        const prev = headingRef.current;
        let diff = newHeading - prev;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        const smoothed = (prev + diff * 0.35 + 360) % 360;
        headingRef.current = smoothed;
        setHeading(Math.round(smoothed));
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  // Compute alignment
  const relativeQiblaAngle = (qiblaAngle - heading + 360) % 360;
  const isAligned = Math.abs(relativeQiblaAngle) < 3.0 || Math.abs(relativeQiblaAngle - 360) < 3.0;

  // Haptic and Sound trigger when aligned
  useEffect(() => {
    if (isAligned && !hasTriggeredAlignedFeedback) {
      setHasTriggeredAlignedFeedback(true);
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([40, 50, 40]);
        } catch {}
      }
    } else if (!isAligned && hasTriggeredAlignedFeedback) {
      setHasTriggeredAlignedFeedback(false);
    }
  }, [isAligned, hasTriggeredAlignedFeedback]);

  const handleSelectCity = (c: CityLocation) => {
    updateSettings({
      locationCity: `${c.name} - ${c.country}`,
      lat: c.lat,
      lng: c.lng,
      prayerCalcMethod: c.defaultMethod,
      autoDetectLocation: false
    });
    setShowCityPicker(false);
    showToast(`تم تحديث اتجاه القبلة لمدينة: ${c.name} (${c.country}) 🧭`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 pb-28 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#063321] via-[#042118] to-[#063321] border-2 border-[#d4af37]/30 rounded-3xl p-6 text-[#f5f2ed] shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-6 h-6 text-[#d4af37]" />
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#d4af37]">
                بوصلة القبلة الفلكية عالية الدقة
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#f5f2ed]/80 mt-1">
              تحديد فلكي دقيق لاتجاه الكعبة المشرفة بمكة المكرمة بالاستعانة بمستشعرات البوصلة وموقع الشمس الفعلي.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => refreshLocation()}
              className="bg-[#d4af37] hover:bg-[#c19b2e] text-[#042118] px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="إعادة فحص وتحديث إحداثيات الـ GPS"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>تحديث GPS</span>
            </button>

            <button
              onClick={() => setShowCityPicker(true)}
              className="bg-[#084d32] border border-[#d4af37]/30 px-3.5 py-1.5 rounded-xl text-xs text-[#d4af37] flex items-center gap-1.5 hover:bg-[#063321] transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{settings.locationCity}</span>
            </button>
          </div>
        </div>

        {/* GPS & Sensor Meta Bar */}
        <div className="mt-4 pt-3 border-t border-[#d4af37]/20 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-3">
            <span className="text-slate-300">
              إحداثياتك: <strong className="text-[#d4af37] font-mono">{settings.lat.toFixed(4)}°N, {settings.lng.toFixed(4)}°E</strong>
            </span>
            {gpsAccuracy !== null && (
              <span className="bg-[#042118] px-2 py-0.5 rounded text-emerald-400 border border-emerald-500/30">
                دقة الـ GPS: ±{gpsAccuracy} م
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              hasCompassSensor
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}>
              {hasCompassSensor ? 'المستشعر المغناطيسي: متصل ✓' : 'المحاذاة اليدوية / بدون مستشعر'}
            </span>
          </div>
        </div>
      </div>

      {/* iOS Permission Prompt */}
      {needsPermission && (
        <div className="bg-[#084d32] border-2 border-[#d4af37] p-4 rounded-3xl text-center space-y-2 shadow-xl">
          <div className="flex items-center justify-center gap-2 text-[#d4af37] font-bold text-sm">
            <Smartphone className="w-5 h-5" />
            <span>يتطلب iPhone تفعيل مستشعر البوصلة</span>
          </div>
          <p className="text-xs text-slate-200">
            اضغط على الزر أدناه للسماح بقراءة الاتجاه التلقائي لحركة الهاتف.
          </p>
          <button
            onClick={requestCompassPermission}
            className="px-6 py-2.5 bg-[#d4af37] text-[#042118] font-bold text-xs rounded-xl shadow-lg hover:bg-[#c19b2e] cursor-pointer"
          >
            تفعيل مستشعر الاتجاه (iOS) 🧭
          </button>
        </div>
      )}

      {/* Main Compass Housing */}
      <div className={`bg-gradient-to-b from-[#063321] via-[#042118] to-[#063321] border-2 rounded-3xl p-6 sm:p-10 text-center shadow-2xl transition-all flex flex-col items-center justify-center space-y-6 ${
        isAligned ? 'border-emerald-400 shadow-emerald-500/20 shadow-2xl' : 'border-[#d4af37]/40'
      }`}>
        
        {/* Status Indicator Banner */}
        <div className={`px-5 py-2 rounded-2xl text-xs sm:text-sm font-bold border transition-all flex items-center justify-center gap-2 shadow-lg ${
          isAligned
            ? 'bg-emerald-500 text-white border-emerald-300 animate-bounce'
            : 'bg-[#042118] text-[#d4af37] border-[#d4af37]/40'
        }`}>
          {isAligned ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>✨ أنت الآن في اتجاه القبلة تماماً! (تقبل الله طاعتكم) ✨</span>
            </>
          ) : (
            <>
              <RotateCw className="w-4 h-4 text-[#d4af37] animate-spin" style={{ animationDuration: '6s' }} />
              <span>
                قم بتدوير الهاتف حتى يتطابق السهم الذهبي مع الكعبة (زاوية {Math.round(qiblaAngle)}°)
              </span>
            </>
          )}
        </div>

        {/* 3D Compass Circular Dial */}
        <div className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center select-none">
          {/* Compass Dial Outer Ring */}
          <div
            className="w-full h-full rounded-full border-4 border-[#d4af37] bg-gradient-to-tr from-[#042118] via-[#063321] to-[#042118] shadow-2xl flex items-center justify-center relative transition-transform duration-200 ease-out"
            style={{ transform: `rotate(${-heading}deg)` }}
          >
            {/* North (شمال) */}
            <div className="absolute top-2 text-rose-500 font-extrabold text-xs tracking-wider flex flex-col items-center">
              <span>▲</span>
              <span className="font-mono text-[11px]">N (الشمال)</span>
            </div>

            {/* South (جنوب) */}
            <div className="absolute bottom-2 text-[#d4af37]/70 font-bold text-[11px] flex flex-col items-center">
              <span className="font-mono">S (الجنوب)</span>
              <span>▼</span>
            </div>

            {/* East (شرق) */}
            <div className="absolute right-2 text-[#d4af37]/70 font-bold text-[11px] flex items-center gap-0.5">
              <span className="font-mono">E (الشرق)</span>
              <span>►</span>
            </div>

            {/* West (غرب) */}
            <div className="absolute left-2 text-[#d4af37]/70 font-bold text-[11px] flex items-center gap-0.5">
              <span>◄</span>
              <span className="font-mono">W (الغرب)</span>
            </div>

            {/* Degree Marks */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(degVal => (
              <div
                key={degVal}
                className="absolute inset-0 flex flex-col items-center pointer-events-none"
                style={{ transform: `rotate(${degVal}deg)` }}
              >
                <div className={`w-0.5 ${degVal % 90 === 0 ? 'h-3 bg-[#d4af37]' : 'h-1.5 bg-[#d4af37]/40'}`} />
              </div>
            ))}

            {/* Daytime Sun Physical Reference Position Marker */}
            {sunData.isDay && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-start pointer-events-none"
                style={{ transform: `rotate(${sunData.azimuth}deg)` }}
                title={`موقع قرص الشمس الفعلي في السماء (${Math.round(sunData.azimuth)}°)`}
              >
                <div className="mt-7 flex flex-col items-center">
                  <div className="w-5 h-5 rounded-full bg-amber-400 border border-amber-200 flex items-center justify-center shadow-lg animate-pulse">
                    <Sun className="w-3.5 h-3.5 text-amber-950" />
                  </div>
                  <span className="text-[9px] text-amber-300 font-bold mt-0.5 bg-[#042118]/80 px-1 rounded">الشمس</span>
                </div>
              </div>
            )}

            {/* Inner Ring */}
            <div className="w-52 h-52 sm:w-64 sm:h-64 rounded-full border border-[#d4af37]/20 flex items-center justify-center pointer-events-none" />

            {/* Golden Kaaba Pointer Needle */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-start pointer-events-none"
              style={{ transform: `rotate(${qiblaAngle}deg)` }}
            >
              {/* Kaaba Marker Icon */}
              <div className="mt-1 flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-black border-2 border-[#d4af37] flex items-center justify-center shadow-2xl relative">
                  <span className="text-base">🕋</span>
                  <div className="absolute -top-1 w-2 h-2 bg-[#d4af37] rounded-full animate-ping" />
                </div>
                <div className="w-2 h-20 sm:h-28 bg-gradient-to-b from-[#d4af37] via-amber-500 to-transparent rounded-full shadow-lg" />
              </div>
            </div>
          </div>

          {/* Compass Center Pivot */}
          <div className="absolute w-14 h-14 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b38f22] border-4 border-[#042118] flex flex-col items-center justify-center shadow-2xl z-10 font-bold text-[#042118] leading-tight">
            <span className="text-xs font-mono">{Math.round(qiblaAngle)}°</span>
            <span className="text-[9px]">القبلة</span>
          </div>
        </div>

        {/* Real-time Angle & Kaaba Distance Cards */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-md pt-2">
          <div className="bg-[#042118] border border-[#d4af37]/30 p-3.5 rounded-2xl text-center shadow-md">
            <span className="text-[11px] text-slate-300 block">زاوية القبلة من الشمال:</span>
            <span className="text-xl font-bold font-mono text-[#d4af37]">{qiblaAngle.toFixed(1)}°</span>
          </div>

          <div className="bg-[#042118] border border-[#d4af37]/30 p-3.5 rounded-2xl text-center shadow-md">
            <span className="text-[11px] text-slate-300 block">المسافة إلى مكة المكرمة:</span>
            <span className="text-xl font-bold font-mono text-[#d4af37]">{distanceKm.toLocaleString('ar-EG')} كم</span>
          </div>
        </div>

        {/* Manual Heading Slider */}
        <div className="w-full max-w-md bg-[#042118] p-4 rounded-2xl border border-[#d4af37]/25 space-y-2 text-right">
          <div className="flex justify-between items-center text-xs text-[#f5f2ed]">
            <span className="flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>المحاذاة اليدوية لزاوية الهاتف:</span>
            </span>
            <span className="font-mono text-[#d4af37] font-bold">{heading}°</span>
          </div>
          <input
            type="range"
            min={0}
            max={360}
            value={heading}
            onChange={e => setHeading(Number(e.target.value))}
            className="w-full accent-[#d4af37] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0° (شمال)</span>
            <span>90° (شرق)</span>
            <span>180° (جنوب)</span>
            <span>270° (غرب)</span>
            <span>360° (شمال)</span>
          </div>
        </div>

        {/* Sensor Calibration Guide */}
        <div className="w-full max-w-md p-3.5 rounded-2xl bg-[#084d32]/60 border border-[#d4af37]/20 flex items-start gap-2.5 text-right text-xs text-slate-200">
          <Info className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#d4af37] block mb-0.5">نصائح لدقة البوصلة القصوى:</strong>
            <p className="text-[11px] text-slate-300">
              1. ضع الهاتف أفقياً تماماً على راحة يدك أو على سطح مستوٍ.<br />
              2. ابتعد عن الأجهزة الإلكترونية والأسطح المعدنية أو المغناطيسية.<br />
              3. إذا كانت البوصلة غير مستقرة، حرّك الهاتف في الهواء على شكل رقم <strong>(8)</strong> باللغة الإنجليزية لمعايرة الحساس.
            </p>
          </div>
        </div>
      </div>

      {/* City Switcher Modal for Compass */}
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
                  <Compass className="w-5 h-5 text-[#d4af37]" />
                  <h3 className="font-bold text-base text-[#d4af37]">اختر مدينتك لتحديد زاوية القبلة</h3>
                </div>
                <button
                  onClick={() => setShowCityPicker(false)}
                  className="p-1 rounded-lg bg-[#084d32] text-[#d4af37] hover:bg-[#063321] cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 space-y-2 overflow-y-auto flex-1">
                {POPULAR_CITIES.map(c => (
                  <button
                    key={c.name}
                    onClick={() => handleSelectCity(c)}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#063321] border border-slate-200 dark:border-[#d4af37]/20 hover:border-[#d4af37] text-right flex items-center justify-between text-xs transition-colors cursor-pointer"
                  >
                    <div>
                      <span className="font-bold text-slate-800 dark:text-[#f5f2ed]">{c.name}</span>
                      <span className="text-[11px] text-slate-500 dark:text-[#d4af37]/70 block">({c.country})</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#d4af37]">
                      {calculateQiblaDirection(c.lat, c.lng).toFixed(1)}°
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
