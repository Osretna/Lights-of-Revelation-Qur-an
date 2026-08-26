import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Compass, MapPin, Navigation, Sparkles, RotateCw, AlertCircle } from 'lucide-react';
import { useQuran } from '../context/QuranContext';
import { calculateQiblaDirection, calculateDistanceToKaaba } from '../utils/prayerCalculator';

export const QiblaCompass: React.FC = () => {
  const { settings, showToast } = useQuran();

  const [heading, setHeading] = useState<number>(0);
  const [hasCompassSensor, setHasCompassSensor] = useState<boolean>(false);

  // Exact math calculation from current coordinates to Holy Kaaba
  const qiblaAngle = calculateQiblaDirection(settings.lat, settings.lng);
  const distanceKm = calculateDistanceToKaaba(settings.lat, settings.lng);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const anyEvent = e as unknown as { webkitCompassHeading?: number; alpha: number | null };
      if (anyEvent.webkitCompassHeading !== undefined && anyEvent.webkitCompassHeading !== null) {
        // iOS
        setHeading(anyEvent.webkitCompassHeading);
        setHasCompassSensor(true);
      } else if (anyEvent.alpha !== null) {
        // Android
        setHeading(360 - anyEvent.alpha);
        setHasCompassSensor(true);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  const relativeQiblaAngle = (qiblaAngle - heading + 360) % 360;
  const isAligned = Math.abs(relativeQiblaAngle) < 4 || Math.abs(relativeQiblaAngle - 360) < 4;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 pb-28 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border border-amber-500/30 rounded-3xl p-6 text-amber-50 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-6 h-6 text-amber-400" />
              <h1 className="font-arabic-title text-2xl sm:text-3xl font-bold text-amber-200">
                بوصلة القبلة المشرفة
              </h1>
            </div>
            <p className="text-sm text-amber-100/80 mt-1">
              تحديد دقيق لاتجاه الكعبة المشرفة بمكة المكرمة مع حساب المسافة الفلكية بالكيلومتر.
            </p>
          </div>

          <div className="bg-emerald-950/80 border border-amber-500/30 px-3.5 py-1.5 rounded-xl text-xs text-amber-200 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{settings.locationCity}</span>
          </div>
        </div>
      </div>

      {/* Main 3D Compass Dial */}
      <div className="bg-gradient-to-b from-emerald-950 via-[#032920] to-emerald-950 border-2 border-amber-400/40 rounded-3xl p-6 sm:p-10 text-center shadow-2xl gold-glow flex flex-col items-center justify-center space-y-6">
        
        {/* Status indicator badge */}
        <div className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
          isAligned
            ? 'bg-emerald-500 text-white border-emerald-300 animate-pulse shadow-lg'
            : 'bg-emerald-900/80 text-amber-300 border-amber-500/30'
        }`}>
          {isAligned ? '✨ أنت الآن في اتجاه القبلة تماماً! ✨' : `قم بتدوير الهاتف نحو زاوية ${Math.round(qiblaAngle)}°`}
        </div>

        {/* 3D Compass Housing */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
          {/* Outer Ring Dial */}
          <div
            className="w-full h-full rounded-full border-4 border-amber-400/60 bg-gradient-to-tr from-emerald-900 via-emerald-950 to-emerald-900 shadow-2xl flex items-center justify-center relative transition-transform duration-300"
            style={{ transform: `rotate(${-heading}deg)` }}
          >
            {/* North Indicator */}
            <div className="absolute top-2 text-rose-500 font-extrabold text-sm tracking-wider">
              N (الشمال)
            </div>
            {/* South Indicator */}
            <div className="absolute bottom-2 text-amber-200/60 font-bold text-xs">
              S (الجنوب)
            </div>
            {/* East Indicator */}
            <div className="absolute right-2 text-amber-200/60 font-bold text-xs">
              E (الشرق)
            </div>
            {/* West Indicator */}
            <div className="absolute left-2 text-amber-200/60 font-bold text-xs">
              W (الغرب)
            </div>

            {/* Inner Ring with degree ticks */}
            <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full border border-amber-400/20 flex items-center justify-center pointer-events-none" />

            {/* Golden Kaaba Pointer Needle */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-start pointer-events-none"
              style={{ transform: `rotate(${qiblaAngle}deg)` }}
            >
              {/* Kaaba Marker Icon */}
              <div className="mt-1 flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-black border-2 border-amber-400 flex items-center justify-center shadow-lg gold-glow">
                  <span className="text-amber-300 text-xs font-bold">🕋</span>
                </div>
                <div className="w-1.5 h-16 sm:h-24 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full shadow-md" />
              </div>
            </div>
          </div>

          {/* Compass Center Pivot */}
          <div className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-emerald-950 flex items-center justify-center shadow-lg z-10 font-bold text-emerald-950 text-xs">
            {Math.round(qiblaAngle)}°
          </div>
        </div>

        {/* Data Cards (Angle & Distance to Makkah) */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-md pt-2">
          <div className="bg-emerald-900/60 border border-amber-500/30 p-3.5 rounded-2xl text-center">
            <span className="text-[11px] text-amber-200/70 block">زاوية اتجاه القبلة:</span>
            <span className="text-lg font-bold font-mono text-amber-300">{Math.round(qiblaAngle)}° من الشمال</span>
          </div>

          <div className="bg-emerald-900/60 border border-amber-500/30 p-3.5 rounded-2xl text-center">
            <span className="text-[11px] text-amber-200/70 block">المسافة إلى مكة المكرمة:</span>
            <span className="text-lg font-bold font-mono text-amber-300">{distanceKm.toLocaleString('ar-EG')} كم</span>
          </div>
        </div>

        {/* Manual Calibration Slider */}
        <div className="w-full max-w-md bg-emerald-900/40 p-4 rounded-2xl border border-emerald-800 space-y-2">
          <div className="flex justify-between text-xs text-amber-200/80">
            <span>محاكاة تدوير الهاتف (المعايرة اليدوية):</span>
            <span className="font-mono text-amber-300">{Math.round(heading)}°</span>
          </div>
          <input
            type="range"
            min={0}
            max={360}
            value={heading}
            onChange={e => setHeading(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Instruction Note */}
        <p className="text-xs text-amber-200/60 max-w-md text-center">
          للحصول على أدق نتيجة، تأكد من وضع الهاتف أفقياً بعيداً عن المجالات المغناطيسية والأجهزة الإلكترونية.
        </p>
      </div>
    </div>
  );
};
