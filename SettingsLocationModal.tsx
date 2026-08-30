import React, { useState } from 'react';
import { 
  MapPin, Search, Navigation, Check, Sliders, Globe, 
  Smartphone, Volume2, ShieldCheck, RefreshCw, X, HelpCircle
} from 'lucide-react';
import { LocationData } from '../types';
import { CITIES_DATABASE, CALCULATION_METHODS, CityLocation } from '../data/citiesData';
import { saveLocation } from '../utils/storage';
import { normalizeArabicText } from '../utils/arabicNormalizer';

interface SettingsLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: LocationData;
  onUpdateLocation: (newLoc: LocationData) => void;
}

export const SettingsLocationModal: React.FC<SettingsLocationModalProps> = ({
  isOpen,
  onClose,
  location,
  onUpdateLocation
}) => {
  const [activeTab, setActiveTab] = useState<'location' | 'calculation' | 'adjustments' | 'mobile_help'>('location');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter cities by name in Arabic or English or country
  const filteredCities = CITIES_DATABASE.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = normalizeArabicText(searchQuery.trim());
    const cityNorm = normalizeArabicText(c.arabicCity);
    const countryNorm = normalizeArabicText(c.arabicCountry);
    return (
      cityNorm.includes(q) ||
      countryNorm.includes(q) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Handle choosing a preset city
  const handleSelectCity = (c: CityLocation) => {
    const updated: LocationData = {
      ...location,
      city: c.arabicCity,
      country: c.arabicCountry,
      latitude: c.latitude,
      longitude: c.longitude,
      timezone: c.timezone,
      calculationMethod: c.method,
      isAutoDetected: false
    };
    onUpdateLocation(updated);
    saveLocation(updated);
  };

  // Handle GPS Auto-detection
  const handleAutoDetectGPS = () => {
    if (!navigator.geolocation) {
      setGpsError('خاصية تحديد الموقع غير مدعومة في هذا المتصفح.');
      return;
    }

    setIsDetectingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        let detectedCity = 'موقعي الحالي';
        let detectedCountry = 'تلقائي';
        let recommendedMethod = location.calculationMethod;

        // Try reverse geocoding via OpenStreetMap Nominatim
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=ar`);
          if (res.ok) {
            const data = await res.json();
            const addr = data.address;
            detectedCity = addr.city || addr.town || addr.state_district || addr.state || 'موقعي الحالي';
            detectedCountry = addr.country || 'تلقائي';

            // Auto-select calculation method based on country
            if (detectedCountry.includes('مصر')) recommendedMethod = 'Egyptian';
            else if (detectedCountry.includes('السعودية')) recommendedMethod = 'UmmAlQura';
            else if (detectedCountry.includes('الإمارات')) recommendedMethod = 'Dubai';
            else if (detectedCountry.includes('الكويت')) recommendedMethod = 'Kuwait';
            else if (detectedCountry.includes('قطر')) recommendedMethod = 'Qatar';
            else if (detectedCountry.includes('تركيا')) recommendedMethod = 'Turkey';
            else if (detectedCountry.includes('باكستان')) recommendedMethod = 'Karachi';
          }
        } catch {
          // Keep default city names
        }

        const updated: LocationData = {
          ...location,
          city: detectedCity,
          country: detectedCountry,
          latitude: lat,
          longitude: lon,
          calculationMethod: recommendedMethod,
          isAutoDetected: true
        };

        onUpdateLocation(updated);
        saveLocation(updated);
        setIsDetectingGps(false);
      },
      (err) => {
        setIsDetectingGps(false);
        setGpsError('تعذر الحصول على الموقع الجغرافي. يرجى تفعيل إذن الـ GPS في هاتفك.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Change Calculation Method
  const handleCalculationMethodChange = (methodId: string) => {
    const updated: LocationData = {
      ...location,
      calculationMethod: methodId
    };
    onUpdateLocation(updated);
    saveLocation(updated);
  };

  // Change Asr Madhab
  const handleMadhabChange = (madhab: 'shafi' | 'hanafi') => {
    const updated: LocationData = {
      ...location,
      madhab
    };
    onUpdateLocation(updated);
    saveLocation(updated);
  };

  // Adjust prayer minutes offset
  const handleOffsetChange = (prayerKey: keyof LocationData['manualOffsets'], delta: number) => {
    const currentVal = location.manualOffsets[prayerKey] || 0;
    const updated: LocationData = {
      ...location,
      manualOffsets: {
        ...location.manualOffsets,
        [prayerKey]: currentVal + delta
      }
    };
    onUpdateLocation(updated);
    saveLocation(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100 font-cairo">إعدادات الموقع وتوقيت الأذان</h3>
              <p className="text-xs text-slate-400">يتم حفظ الموقع تلقائياً حتى عند تحديث الصفحة</p>
            </div>
          </div>
          <button
            id="close-settings-modal-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-2 border-b border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('location')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'location'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>اختيار المدينة والموقع</span>
          </button>

          <button
            onClick={() => setActiveTab('calculation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'calculation'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>طريقة الحساب الفلكي</span>
          </button>

          <button
            onClick={() => setActiveTab('adjustments')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'adjustments'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>تعديل الدقائق (+/-)</span>
          </button>

          <button
            onClick={() => setActiveTab('mobile_help')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'mobile_help'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>حلول وتوافق الهاتف</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'location' && (
            <div className="space-y-4">
              {/* GPS Auto Detect Button */}
              <div className="bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/30 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-emerald-300">تحديد موقعي الحالي تلقائياً (GPS)</h4>
                  <p className="text-xs text-slate-400">يجلب إحداثيات مدينتك بدقة عبر قمر الـ GPS</p>
                </div>
                <button
                  id="gps-detect-btn"
                  disabled={isDetectingGps}
                  onClick={handleAutoDetectGPS}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md active:scale-95 disabled:opacity-50"
                >
                  {isDetectingGps ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>جاري التحديد...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4" />
                      <span>تحديد موقعي الآن</span>
                    </>
                  )}
                </button>
              </div>

              {gpsError && (
                <div className="text-xs text-rose-300 bg-rose-950/40 p-3 rounded-xl border border-rose-500/30">
                  {gpsError}
                </div>
              )}

              {/* City Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <input
                  id="city-search-input"
                  type="text"
                  placeholder="ابحث عن مدينتك أو بلدك (مثال: القاهرة، مكة، الرياض، دبي، لندن)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-9 pl-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Current Active Location Indicator */}
              <div className="flex items-center justify-between text-xs bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-slate-400">الموقع المحفوظ حالياً:</span>
                <span className="font-bold text-emerald-400">
                  {location.city}، {location.country} ({location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°)
                </span>
              </div>

              {/* Cities Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
                {filteredCities.map((c, idx) => {
                  const isCurrent = location.city === c.arabicCity && location.country === c.arabicCountry;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectCity(c)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-right transition-all ${
                        isCurrent
                          ? 'bg-emerald-600 text-white border-emerald-400 font-bold shadow-sm'
                          : 'bg-slate-800/50 hover:bg-slate-800 text-slate-200 border-slate-700/60'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-semibold">{c.arabicCity}</div>
                        <div className="text-[10px] text-slate-400">{c.arabicCountry} - {c.city}</div>
                      </div>
                      {isCurrent && <Check className="w-4 h-4 text-emerald-100" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'calculation' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">طريقة حساب مواقيت الصلاة المعتمدة:</label>
                <div className="space-y-2">
                  {CALCULATION_METHODS.map((m) => {
                    const isSelected = location.calculationMethod === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => handleCalculationMethodChange(m.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-sm'
                            : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-slate-100">{m.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{m.region}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Madhab for Asr */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-xs font-bold text-slate-300 block">طريقة حساب وقت صلاة العصر:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleMadhabChange('shafi')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                      location.madhab === 'shafi'
                        ? 'bg-emerald-600 text-white border-emerald-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    جمهور الفقهاء (شافعي / مالكي / حنبلي)
                  </button>
                  <button
                    onClick={() => handleMadhabChange('hanafi')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                      location.madhab === 'hanafi'
                        ? 'bg-emerald-600 text-white border-emerald-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    المذهب الحنفي (ظل الشيء مثليه)
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'adjustments' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                يمكنك تقديم أو تأخير توقيت أي صلاة بعدد من الدقائق لمطابقة المسجد المحلي في منطقتك بدقة:
              </p>

              <div className="space-y-2.5">
                {[
                  { key: 'fajr' as const, name: 'الفجر' },
                  { key: 'sunrise' as const, name: 'الشروق' },
                  { key: 'dhuhr' as const, name: 'الظهر' },
                  { key: 'asr' as const, name: 'العصر' },
                  { key: 'maghrib' as const, name: 'المغرب' },
                  { key: 'isha' as const, name: 'العشاء' }
                ].map((p) => {
                  const offset = location.manualOffsets[p.key] || 0;
                  return (
                    <div
                      key={p.key}
                      className="flex items-center justify-between bg-slate-800/80 p-3 rounded-xl border border-slate-700"
                    >
                      <span className="font-bold text-sm text-slate-200">{p.name}</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleOffsetChange(p.key, -1)}
                          className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold flex items-center justify-center active:scale-95"
                        >
                          -
                        </button>
                        <span className="font-mono text-sm font-bold w-12 text-center text-emerald-400">
                          {offset > 0 ? `+${offset}` : offset} د
                        </span>
                        <button
                          onClick={() => handleOffsetChange(p.key, 1)}
                          className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold flex items-center justify-center active:scale-95"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'mobile_help' && (
            <div className="space-y-4">
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-3">
                <h4 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span>حل مشاكل الهاتف المحمول (Android & iOS)</span>
                </h4>
                
                <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <p className="font-bold text-emerald-300 mb-1">١. مشكلة لفظ الجلالة في تصحيح التلاوة:</p>
                    <p>
                      تم حل هذه المشكلة بالكامل داخل التطبيق! الهواتف كانت تعيد رموزاً مختلفة لـ "الله" و"لله". الآن محرك البحث الصوتي يتعرف على جميع أشكال النطق والتنوين فوراً دون توقف.
                    </p>
                  </div>

                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <p className="font-bold text-emerald-300 mb-1">٢. تشغيل صوت الأذان على الهاتف:</p>
                    <p>
                      متصفحات الهواتف تمنع تشغيل الصوت تلقائياً إلا بعد نقرة واحدة من المستخدم. يرجى الضغط على زر "تفعيل صوت الأذان" في أعلى الشاشة أو الضغط على "تجربة صوت الأذان" لفك حظر الصوت.
                    </p>
                  </div>

                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <p className="font-bold text-emerald-300 mb-1">٣. إشعارات الهاتف:</p>
                    <p>
                      تأكد من الضغط على "تفعيل إشعارات الأذان" والموافقة على إذن المتصفح لتصلك تنبيهات دخول وقت كل صلاة.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end">
          <button
            id="save-close-settings-btn"
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
          >
            حفظ وإغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
