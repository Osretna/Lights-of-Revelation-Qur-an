import { PrayerTimeData, PrayerOffsets, AppSettings } from '../types/quran';

export interface CityLocation {
  name: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  timezone: number;
  defaultMethod: 'Makkah' | 'Egypt' | 'MWL' | 'ISNA' | 'Karachi' | 'Dubai' | 'Qatar' | 'Kuwait' | 'Turkey' | 'Algeria' | 'Tunisia' | 'France';
}

export const POPULAR_CITIES: CityLocation[] = [
  // المملكة العربية السعودية (تقويم أم القرى - مكة المكرمة)
  { name: 'مكة المكرمة', country: 'السعودية', countryCode: 'SA', lat: 21.4225, lng: 39.8262, timezone: 3, defaultMethod: 'Makkah' },
  { name: 'المدينة المنورة', country: 'السعودية', countryCode: 'SA', lat: 24.5247, lng: 39.5692, timezone: 3, defaultMethod: 'Makkah' },
  { name: 'الرياض', country: 'السعودية', countryCode: 'SA', lat: 24.7136, lng: 46.6753, timezone: 3, defaultMethod: 'Makkah' },
  { name: 'جدة', country: 'السعودية', countryCode: 'SA', lat: 21.5433, lng: 39.1728, timezone: 3, defaultMethod: 'Makkah' },
  { name: 'الدمام', country: 'السعودية', countryCode: 'SA', lat: 26.4207, lng: 50.0888, timezone: 3, defaultMethod: 'Makkah' },
  { name: 'الطائف', country: 'السعودية', countryCode: 'SA', lat: 21.2854, lng: 40.4222, timezone: 3, defaultMethod: 'Makkah' },
  { name: 'الخبر', country: 'السعودية', countryCode: 'SA', lat: 26.2172, lng: 50.1971, timezone: 3, defaultMethod: 'Makkah' },
  { name: 'الأحساء / الهفوف', country: 'السعودية', countryCode: 'SA', lat: 25.3833, lng: 49.5833, timezone: 3, defaultMethod: 'Makkah' },
  { name: 'بريدة / القصيم', country: 'السعودية', countryCode: 'SA', lat: 26.3260, lng: 43.9750, timezone: 3, defaultMethod: 'Makkah' },
  { name: 'تبوك', country: 'السعودية', countryCode: 'SA', lat: 28.3835, lng: 36.5662, timezone: 3, defaultMethod: 'Makkah' },
  { name: 'أبها / عسير', country: 'السعودية', countryCode: 'SA', lat: 18.2164, lng: 42.5053, timezone: 3, defaultMethod: 'Makkah' },
  { name: 'خميس مشيط', country: 'السعودية', countryCode: 'SA', lat: 18.3000, lng: 42.7333, timezone: 3, defaultMethod: 'Makkah' },
  { name: 'ينبع', country: 'السعودية', countryCode: 'SA', lat: 24.0891, lng: 38.0637, timezone: 3, defaultMethod: 'Makkah' },
  { name: 'حائل', country: 'السعودية', countryCode: 'SA', lat: 27.5114, lng: 41.7208, timezone: 3, defaultMethod: 'Makkah' },
  { name: 'نجران', country: 'السعودية', countryCode: 'SA', lat: 17.4933, lng: 44.1277, timezone: 3, defaultMethod: 'Makkah' },
  { name: 'جازان', country: 'السعودية', countryCode: 'SA', lat: 16.8892, lng: 42.5511, timezone: 3, defaultMethod: 'Makkah' },
  { name: 'الجبيل', country: 'السعودية', countryCode: 'SA', lat: 27.0174, lng: 49.6225, timezone: 3, defaultMethod: 'Makkah' },

  // جمهورية مصر العربية (الهيئة المصرية العامة للمساحة)
  { name: 'القاهرة', country: 'مصر', countryCode: 'EG', lat: 30.0444, lng: 31.2357, timezone: 2, defaultMethod: 'Egypt' },
  { name: 'الإسكندرية', country: 'مصر', countryCode: 'EG', lat: 31.2001, lng: 29.9187, timezone: 2, defaultMethod: 'Egypt' },
  { name: 'الجيزة', country: 'مصر', countryCode: 'EG', lat: 30.0131, lng: 31.2089, timezone: 2, defaultMethod: 'Egypt' },
  { name: 'المنصورة', country: 'مصر', countryCode: 'EG', lat: 31.0409, lng: 31.3785, timezone: 2, defaultMethod: 'Egypt' },
  { name: 'طنطا', country: 'مصر', countryCode: 'EG', lat: 30.7865, lng: 31.0004, timezone: 2, defaultMethod: 'Egypt' },
  { name: 'بورسعيد', country: 'مصر', countryCode: 'EG', lat: 31.2653, lng: 32.3019, timezone: 2, defaultMethod: 'Egypt' },
  { name: 'السويس', country: 'مصر', countryCode: 'EG', lat: 29.9668, lng: 32.5498, timezone: 2, defaultMethod: 'Egypt' },
  { name: 'أسيوط', country: 'مصر', countryCode: 'EG', lat: 27.1809, lng: 31.1837, timezone: 2, defaultMethod: 'Egypt' },
  { name: 'سوهاج', country: 'مصر', countryCode: 'EG', lat: 26.5569, lng: 31.6948, timezone: 2, defaultMethod: 'Egypt' },
  { name: 'قنا', country: 'مصر', countryCode: 'EG', lat: 26.1551, lng: 32.7160, timezone: 2, defaultMethod: 'Egypt' },
  { name: 'الأقصر', country: 'مصر', countryCode: 'EG', lat: 25.6872, lng: 32.6396, timezone: 2, defaultMethod: 'Egypt' },
  { name: 'أسوان', country: 'مصر', countryCode: 'EG', lat: 24.0889, lng: 32.8998, timezone: 2, defaultMethod: 'Egypt' },

  // العراق (رابطة العالم الإسلامي / بغداد والموصل)
  { name: 'الموصل', country: 'العراق', countryCode: 'IQ', lat: 36.3400, lng: 43.1300, timezone: 3, defaultMethod: 'MWL' },
  { name: 'بغداد', country: 'العراق', countryCode: 'IQ', lat: 33.3152, lng: 44.3661, timezone: 3, defaultMethod: 'MWL' },
  { name: 'البصرة', country: 'العراق', countryCode: 'IQ', lat: 30.5081, lng: 47.7835, timezone: 3, defaultMethod: 'MWL' },
  { name: 'أربيل', country: 'العراق', countryCode: 'IQ', lat: 36.1911, lng: 44.0092, timezone: 3, defaultMethod: 'MWL' },
  { name: 'النجف الأشرف', country: 'العراق', countryCode: 'IQ', lat: 32.0259, lng: 44.3462, timezone: 3, defaultMethod: 'MWL' },
  { name: 'كربلاء المقدسة', country: 'العراق', countryCode: 'IQ', lat: 32.6160, lng: 44.0249, timezone: 3, defaultMethod: 'MWL' },
  { name: 'كركوك', country: 'العراق', countryCode: 'IQ', lat: 35.4681, lng: 44.3922, timezone: 3, defaultMethod: 'MWL' },
  { name: 'السليمانية', country: 'العراق', countryCode: 'IQ', lat: 35.5669, lng: 45.4161, timezone: 3, defaultMethod: 'MWL' },

  // الإمارات العربية المتحدة
  { name: 'دبي', country: 'الإمارات', countryCode: 'AE', lat: 25.2048, lng: 55.2708, timezone: 4, defaultMethod: 'Dubai' },
  { name: 'أبوظبي', country: 'الإمارات', countryCode: 'AE', lat: 24.4539, lng: 54.3773, timezone: 4, defaultMethod: 'Dubai' },
  { name: 'الشارقة', country: 'الإمارات', countryCode: 'AE', lat: 25.3573, lng: 55.4033, timezone: 4, defaultMethod: 'Dubai' },
  { name: 'عجمان', country: 'الإمارات', countryCode: 'AE', lat: 25.4052, lng: 55.5136, timezone: 4, defaultMethod: 'Dubai' },
  { name: 'رأس الخيمة', country: 'الإمارات', countryCode: 'AE', lat: 25.7895, lng: 55.9432, timezone: 4, defaultMethod: 'Dubai' },

  // دول الخليج والشام والمغرب العربي
  { name: 'الكويت', country: 'الكويت', countryCode: 'KW', lat: 29.3759, lng: 47.9774, timezone: 3, defaultMethod: 'Kuwait' },
  { name: 'الدوحة', country: 'قطر', countryCode: 'QA', lat: 25.2854, lng: 51.5310, timezone: 3, defaultMethod: 'Qatar' },
  { name: 'المنامة', country: 'البحرين', countryCode: 'BH', lat: 26.2285, lng: 50.5860, timezone: 3, defaultMethod: 'Makkah' },
  { name: 'مسقط', country: 'عمان', countryCode: 'OM', lat: 23.5880, lng: 58.3829, timezone: 4, defaultMethod: 'Makkah' },
  { name: 'القدس الشريف', country: 'فلسطين', countryCode: 'PS', lat: 31.7683, lng: 35.2137, timezone: 2, defaultMethod: 'MWL' },
  { name: 'غزة', country: 'فلسطين', countryCode: 'PS', lat: 31.5017, lng: 34.4668, timezone: 2, defaultMethod: 'Egypt' },
  { name: 'عمّان', country: 'الأردن', countryCode: 'JO', lat: 31.9454, lng: 35.9284, timezone: 3, defaultMethod: 'MWL' },
  { name: 'دمشق', country: 'سوريا', countryCode: 'SY', lat: 33.5138, lng: 36.2765, timezone: 3, defaultMethod: 'MWL' },
  { name: 'حلب', country: 'سوريا', countryCode: 'SY', lat: 36.2021, lng: 37.1343, timezone: 3, defaultMethod: 'MWL' },
  { name: 'بيروت', country: 'لبنان', countryCode: 'LB', lat: 33.8938, lng: 35.5018, timezone: 2, defaultMethod: 'MWL' },
  { name: 'صنعاء', country: 'اليمن', countryCode: 'YE', lat: 15.3694, lng: 44.1910, timezone: 3, defaultMethod: 'Makkah' },
  { name: 'عدن', country: 'اليمن', countryCode: 'YE', lat: 12.7855, lng: 45.0187, timezone: 3, defaultMethod: 'Makkah' },
  { name: 'الخرطوم', country: 'السودان', countryCode: 'SD', lat: 15.5007, lng: 32.5599, timezone: 2, defaultMethod: 'Egypt' },
  { name: 'طرابلس', country: 'ليبيا', countryCode: 'LY', lat: 32.8872, lng: 13.1913, timezone: 2, defaultMethod: 'MWL' },
  { name: 'تونس', country: 'تونس', countryCode: 'TN', lat: 36.8065, lng: 10.1815, timezone: 1, defaultMethod: 'Tunisia' },
  { name: 'الجزائر', country: 'الجزائر', countryCode: 'DZ', lat: 36.7538, lng: 3.0588, timezone: 1, defaultMethod: 'Algeria' },
  { name: 'الرباط', country: 'المغرب', countryCode: 'MA', lat: 34.0209, lng: -6.8416, timezone: 1, defaultMethod: 'MWL' },
  { name: 'الدار البيضاء', country: 'المغرب', countryCode: 'MA', lat: 33.5731, lng: -7.5898, timezone: 1, defaultMethod: 'MWL' },
  { name: 'مراكش', country: 'المغرب', countryCode: 'MA', lat: 31.6295, lng: -7.9811, timezone: 1, defaultMethod: 'MWL' },

  // عواصم ومدن عالمية وإسلامية
  { name: 'إسطنبول', country: 'تركيا', countryCode: 'TR', lat: 41.0082, lng: 28.9784, timezone: 3, defaultMethod: 'Turkey' },
  { name: 'أنقرة', country: 'تركيا', countryCode: 'TR', lat: 39.9334, lng: 32.8597, timezone: 3, defaultMethod: 'Turkey' },
  { name: 'كراتشي', country: 'باكستان', countryCode: 'PK', lat: 24.8607, lng: 67.0011, timezone: 5, defaultMethod: 'Karachi' },
  { name: 'إسلام آباد', country: 'باكستان', countryCode: 'PK', lat: 33.6844, lng: 73.0479, timezone: 5, defaultMethod: 'Karachi' },
  { name: 'جاكرتا', country: 'إندونيسيا', countryCode: 'ID', lat: -6.2088, lng: 106.8456, timezone: 7, defaultMethod: 'MWL' },
  { name: 'كوالالمبور', country: 'ماليزيا', countryCode: 'MY', lat: 3.1390, lng: 101.6869, timezone: 8, defaultMethod: 'MWL' },
  { name: 'لندن', country: 'المملكة المتحدة', countryCode: 'GB', lat: 51.5074, lng: -0.1278, timezone: 0, defaultMethod: 'MWL' },
  { name: 'باريس', country: 'فرنسا', countryCode: 'FR', lat: 48.8566, lng: 2.3522, timezone: 1, defaultMethod: 'France' },
  { name: 'برلين', country: 'ألمانيا', countryCode: 'DE', lat: 52.5200, lng: 13.4050, timezone: 1, defaultMethod: 'MWL' },
  { name: 'نيويورك', country: 'الولايات المتحدة', countryCode: 'US', lat: 40.7128, lng: -74.0060, timezone: -5, defaultMethod: 'ISNA' },
  { name: 'شيكاغو', country: 'الولايات المتحدة', countryCode: 'US', lat: 41.8781, lng: -87.6298, timezone: -6, defaultMethod: 'ISNA' },
  { name: 'لوس أنجلوس', country: 'الولايات المتحدة', countryCode: 'US', lat: 34.0522, lng: -118.2437, timezone: -8, defaultMethod: 'ISNA' },
  { name: 'تورونتو', country: 'كندا', countryCode: 'CA', lat: 43.6532, lng: -79.3832, timezone: -5, defaultMethod: 'ISNA' }
];

export const CALCULATION_METHODS = [
  {
    id: 'Makkah',
    name: 'جامعة أم القرى - مكة المكرمة',
    country: 'المملكة العربية السعودية والخليج',
    aladhanId: 4,
    fajrAngle: 18.5,
    ishaRule: '90 دقيقة بعد المغرب (120 في رمضان)'
  },
  {
    id: 'Egypt',
    name: 'الهيئة المصرية العامة للمساحة',
    country: 'مصر وشمال إفريقيا والسودان',
    aladhanId: 5,
    fajrAngle: 19.5,
    ishaRule: 'زاوية 17.5°'
  },
  {
    id: 'MWL',
    name: 'رابطة العالم الإسلامي (MWL)',
    country: 'العراق والشام والمغرب وأوروبا',
    aladhanId: 3,
    fajrAngle: 18.0,
    ishaRule: 'زاوية 17.0°'
  },
  {
    id: 'Dubai',
    name: 'دائرة الشؤون الإسلامية بدبي',
    country: 'دولة الإمارات العربية المتحدة',
    aladhanId: 16,
    fajrAngle: 18.2,
    ishaRule: 'زاوية 18.2°'
  },
  {
    id: 'Qatar',
    name: 'وزارة الأوقاف والشؤون الإسلامية',
    country: 'دولة قطر',
    aladhanId: 7,
    fajrAngle: 18.0,
    ishaRule: '90 دقيقة بعد المغرب'
  },
  {
    id: 'Kuwait',
    name: 'وزارة الأوقاف والشؤون الإسلامية',
    country: 'دولة الكويت',
    aladhanId: 9,
    fajrAngle: 18.0,
    ishaRule: 'زاوية 17.5°'
  },
  {
    id: 'Turkey',
    name: 'رئاسة الشؤون الدينية التركية (Diyanet)',
    country: 'تركيا',
    aladhanId: 13,
    fajrAngle: 18.0,
    ishaRule: 'زاوية 17.0°'
  },
  {
    id: 'Karachi',
    name: 'جامعة العلوم الإسلامية بكراتشي',
    country: 'باكستان والهند وبنغلاديش',
    aladhanId: 1,
    fajrAngle: 18.0,
    ishaRule: 'زاوية 18.0°'
  },
  {
    id: 'ISNA',
    name: 'الجمعية الإسلامية لأمريكا الشمالية (ISNA)',
    country: 'الولايات المتحدة وكندا',
    aladhanId: 2,
    fajrAngle: 15.0,
    ishaRule: 'زاوية 15.0°'
  },
  {
    id: 'Algeria',
    name: 'وزارة الشؤون الدينية والأوقاف',
    country: 'الجزائر',
    aladhanId: 18,
    fajrAngle: 18.0,
    ishaRule: 'زاوية 17.0°'
  },
  {
    id: 'Tunisia',
    name: 'وزارة الشؤون الدينية',
    country: 'تونس',
    aladhanId: 19,
    fajrAngle: 18.0,
    ishaRule: 'زاوية 18.0°'
  },
  {
    id: 'France',
    name: 'اتحاد المنظمات الإسلامية بفرنسا (UOIF)',
    country: 'فرنسا وغرب أوروبا (12°)',
    aladhanId: 12,
    fajrAngle: 12.0,
    ishaRule: 'زاوية 12.0°'
  }
];

const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

// Angle conversions
const rad = (d: number) => (d * Math.PI) / 180.0;
const deg = (r: number) => (r * 180.0) / Math.PI;

/**
 * Exact mathematical spherical forward azimuth formula for Holy Kaaba (Qibla).
 * Yields bearing from True North in degrees (0 - 360).
 */
export function calculateQiblaDirection(userLat: number, userLng: number): number {
  const phiK = rad(KAABA_LAT);
  const lambdaK = rad(KAABA_LNG);
  const phi = rad(userLat);
  const lambda = rad(userLng);

  const deltaLambda = lambdaK - lambda;
  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(deltaLambda);
  const qibla = deg(Math.atan2(y, x));
  return (qibla + 360) % 360;
}

/**
 * Accurate Geodesic Distance to Kaaba using Great Circle Distance.
 */
export function calculateDistanceToKaaba(userLat: number, userLng: number): number {
  const R = 6371.0088; // Earth mean radius in km
  const phi1 = rad(userLat);
  const phi2 = rad(KAABA_LAT);
  const deltaPhi = rad(KAABA_LAT - userLat);
  const deltaLambda = rad(KAABA_LNG - userLng);

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Calculates current Sun Azimuth & Altitude for daytime visual compass alignment check.
 */
export function calculateSunPosition(date: Date, lat: number, lng: number): { azimuth: number; altitude: number; isDay: boolean } {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime() + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60000;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  const B = (360 / 365) * (dayOfYear - 81);
  const B_rad = rad(B);
  const eot = 9.87 * Math.sin(2 * B_rad) - 7.53 * Math.cos(B_rad) - 1.5 * Math.sin(B_rad); // minutes
  const declination = 23.45 * Math.sin(rad((360 / 365) * (dayOfYear - 81))); // degrees
  const dec_rad = rad(declination);
  const lat_rad = rad(lat);

  const timezoneOffset = -date.getTimezoneOffset() / 60;
  const currentHours = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
  const solarTime = currentHours - timezoneOffset + lng / 15 + eot / 60;
  const hourAngle = (solarTime - 12) * 15;
  const ha_rad = rad(hourAngle);

  // Altitude
  const sinAlt = Math.sin(lat_rad) * Math.sin(dec_rad) + Math.cos(lat_rad) * Math.cos(dec_rad) * Math.cos(ha_rad);
  const altitude = deg(Math.asin(Math.max(-1, Math.min(1, sinAlt))));

  // Azimuth
  const cosAz = (Math.sin(dec_rad) - Math.sin(lat_rad) * sinAlt) / (Math.cos(lat_rad) * Math.cos(rad(altitude)));
  let azimuth = deg(Math.acos(Math.max(-1, Math.min(1, cosAz))));
  if (Math.sin(ha_rad) > 0) {
    azimuth = 360 - azimuth;
  }

  return {
    azimuth: (azimuth + 360) % 360,
    altitude,
    isDay: altitude > -0.833
  };
}

/**
 * Reverse Geocoding with automatic recommended prayer calculation method detection.
 */
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<{ city: string; country: string; fullName: string; countryCode?: string; recommendedMethod: AppSettings['prayerCalcMethod'] }> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=ar`
    );
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision || '';
      const country = data.countryName || '';
      const countryCode = data.countryCode || '';
      if (city || country) {
        const fullName = city && country ? `${city}، ${country}` : city || country;
        return {
          city: city || country,
          country,
          countryCode,
          fullName,
          recommendedMethod: getRecommendedMethodForCountry(countryCode, country)
        };
      }
    }
  } catch (e) {
    console.warn('BigDataCloud geocode fallback', e);
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const city = addr.city || addr.town || addr.village || addr.state || '';
      const country = addr.country || '';
      const countryCode = (addr.country_code || '').toUpperCase();
      if (city || country) {
        const fullName = city && country ? `${city}، ${country}` : city || country;
        return {
          city: city || country,
          country,
          countryCode,
          fullName,
          recommendedMethod: getRecommendedMethodForCountry(countryCode, country)
        };
      }
    }
  } catch (e) {
    console.warn('OSM geocode fallback', e);
  }

  // Nearest known city
  let closest = POPULAR_CITIES[0];
  let minD = Infinity;
  for (const c of POPULAR_CITIES) {
    const d = Math.hypot(c.lat - lat, c.lng - lng);
    if (d < minD) {
      minD = d;
      closest = c;
    }
  }

  return {
    city: closest.name,
    country: closest.country,
    countryCode: closest.countryCode,
    fullName: `${closest.name}، ${closest.country}`,
    recommendedMethod: closest.defaultMethod
  };
}

export function getRecommendedMethodForCountry(countryCode: string, countryName: string): AppSettings['prayerCalcMethod'] {
  const code = (countryCode || '').toUpperCase();
  const name = countryName || '';

  if (code === 'SA' || name.includes('سعود') || code === 'BH' || code === 'OM' || code === 'YE') return 'Makkah';
  if (code === 'EG' || name.includes('مصر') || code === 'SD') return 'Egypt';
  if (code === 'AE' || name.includes('إمارات')) return 'Dubai';
  if (code === 'QA' || name.includes('قطر')) return 'Qatar';
  if (code === 'KW' || name.includes('كويت')) return 'Kuwait';
  if (code === 'TR' || name.includes('تركيا')) return 'Turkey';
  if (code === 'PK' || code === 'IN' || code === 'BD') return 'Karachi';
  if (code === 'DZ' || name.includes('جزائر')) return 'Algeria';
  if (code === 'TN' || name.includes('تونس')) return 'Tunisia';
  if (code === 'FR' || name.includes('فرنس')) return 'France';
  if (code === 'US' || code === 'CA' || name.includes('أمريك')) return 'ISNA';
  return 'MWL';
}

/**
 * Apply fine-tuned user minute adjustments (+/- minutes) to prayer times.
 */
export function applyOffsetsToPrayerTimes(timings: PrayerTimeData, offsets?: PrayerOffsets): PrayerTimeData {
  if (!offsets) return timings;

  const adjustTimeString = (timeStr: string, offsetMins: number): string => {
    if (!timeStr || !offsetMins) return timeStr;
    const parts = timeStr.split(':').map(Number);
    if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return timeStr;
    let totalMinutes = parts[0] * 60 + parts[1] + offsetMins;
    totalMinutes = (totalMinutes + 1440) % 1440;
    const h = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
    const m = (totalMinutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  return {
    ...timings,
    fajr: adjustTimeString(timings.fajr, offsets.fajr || 0),
    sunrise: adjustTimeString(timings.sunrise, offsets.sunrise || 0),
    dhuhr: adjustTimeString(timings.dhuhr, offsets.dhuhr || 0),
    asr: adjustTimeString(timings.asr, offsets.asr || 0),
    maghrib: adjustTimeString(timings.maghrib, offsets.maghrib || 0),
    isha: adjustTimeString(timings.isha, offsets.isha || 0)
  };
}

/**
 * Live Official Timings from AlAdhan API with fallback and caching.
 */
export async function fetchLiveAladhanTimings(
  lat: number,
  lng: number,
  methodName: AppSettings['prayerCalcMethod'] = 'Makkah',
  juristic: 'shafii' | 'hanafi' = 'shafii',
  offsets?: PrayerOffsets
): Promise<PrayerTimeData | null> {
  try {
    const methodObj = CALCULATION_METHODS.find(m => m.id === methodName);
    const methodId = methodObj?.aladhanId || 4; // Default to Umm Al-Qura
    const school = juristic === 'hanafi' ? 1 : 0;

    const today = new Date();
    const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
    const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=${methodId}&school=${school}`;

    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      if (json.data && json.data.timings) {
        const t = json.data.timings;
        const h = json.data.date?.hijri;
        const cleanTime = (val: string) => {
          if (!val) return '00:00';
          const match = val.match(/^(\d{1,2}:\d{2})/);
          return match ? match[1].padStart(5, '0') : val.slice(0, 5);
        };

        const rawTimings: PrayerTimeData = {
          fajr: cleanTime(t.Fajr),
          sunrise: cleanTime(t.Sunrise),
          dhuhr: cleanTime(t.Dhuhr),
          asr: cleanTime(t.Asr),
          maghrib: cleanTime(t.Maghrib),
          isha: cleanTime(t.Isha),
          date: today.toISOString().split('T')[0],
          hijriDate: h ? `${h.day} ${h.month?.ar || h.month?.en || ''} ${h.year} هـ` : '',
          hijriDay: h?.day?.toString() || '',
          hijriMonth: h?.month?.ar || '',
          hijriYear: h?.year?.toString() || ''
        };

        return applyOffsetsToPrayerTimes(rawTimings, offsets);
      }
    }
  } catch (e) {
    console.warn('Online Aladhan fetch failed, will use high-precision local calculation', e);
  }
  return null;
}

/**
 * Offline Astronomical High-Precision Prayer Times Calculation.
 * Fully calibrated for Umm Al-Qura (Saudi Arabia), Egyptian Survey Authority, MWL, and world methods.
 */
export function calculatePrayerTimes(
  date: Date,
  lat: number,
  lng: number,
  method: AppSettings['prayerCalcMethod'] = 'Makkah',
  juristic: 'shafii' | 'hanafi' = 'shafii',
  offsets?: PrayerOffsets
): PrayerTimeData {
  let fajrAngle = 18.5;
  let ishaAngle = 17.5;
  let ishaFixedMinutes = 0;

  switch (method) {
    case 'Makkah':
      fajrAngle = 18.5;
      ishaFixedMinutes = 90; // Umm Al Qura standard 90 mins after Maghrib
      break;
    case 'Egypt':
      fajrAngle = 19.5;
      ishaAngle = 17.5;
      break;
    case 'MWL':
      fajrAngle = 18.0;
      ishaAngle = 17.0;
      break;
    case 'Dubai':
      fajrAngle = 18.2;
      ishaAngle = 18.2;
      break;
    case 'Qatar':
      fajrAngle = 18.0;
      ishaFixedMinutes = 90;
      break;
    case 'Kuwait':
      fajrAngle = 18.0;
      ishaAngle = 17.5;
      break;
    case 'Turkey':
      fajrAngle = 18.0;
      ishaAngle = 17.0;
      break;
    case 'Karachi':
      fajrAngle = 18.0;
      ishaAngle = 18.0;
      break;
    case 'Algeria':
      fajrAngle = 18.0;
      ishaAngle = 17.0;
      break;
    case 'Tunisia':
      fajrAngle = 18.0;
      ishaAngle = 18.0;
      break;
    case 'France':
      fajrAngle = 12.0;
      ishaAngle = 12.0;
      break;
    case 'ISNA':
      fajrAngle = 15.0;
      ishaAngle = 15.0;
      break;
    default:
      fajrAngle = 18.5;
      ishaFixedMinutes = 90;
      break;
  }

  const asrFactor = juristic === 'hanafi' ? 2 : 1;

  // Day of year calculation
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime() + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60000;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Solar declination & equation of time
  const B = (360 / 365) * (dayOfYear - 81);
  const B_rad = rad(B);
  const eot = 9.87 * Math.sin(2 * B_rad) - 7.53 * Math.cos(B_rad) - 1.5 * Math.sin(B_rad); // in minutes
  const declination = 23.45 * Math.sin(rad((360 / 365) * (dayOfYear - 81))); // in degrees
  const dec_rad = rad(declination);
  const lat_rad = rad(lat);

  // Timezone offset in hours from browser
  const timezoneOffset = -date.getTimezoneOffset() / 60;

  // Solar Noon (hours in local time)
  const solarNoon = 12 + timezoneOffset - lng / 15 - eot / 60;

  // Hour angle helper for sun altitude angle (alpha in degrees)
  const getHourAngle = (alpha: number) => {
    const sinAlpha = Math.sin(rad(alpha));
    const cosHA = (sinAlpha - Math.sin(lat_rad) * Math.sin(dec_rad)) / (Math.cos(lat_rad) * Math.cos(dec_rad));
    if (cosHA > 1) return 0;
    if (cosHA < -1) return 180;
    return deg(Math.acos(cosHA));
  };

  // Sunrise / Sunset (-0.833° for atmospheric refraction and solar disc)
  const sunriseHA = getHourAngle(-0.8333);
  const sunriseHours = solarNoon - sunriseHA / 15;
  const sunsetHours = solarNoon + sunriseHA / 15;

  // Fajr (-fajrAngle below horizon)
  const fajrHA = getHourAngle(-fajrAngle);
  const fajrHours = solarNoon - fajrHA / 15;

  // Dhuhr (solar noon + slight buffer e.g. 1 min for solar transit precaution)
  const dhuhrHours = solarNoon + (1 / 60);

  // Asr: Altitude angle is POSITIVE above horizon:
  // tan(altitude) = 1 / (asrFactor + tan(|lat - dec|))
  const asrAltitude = deg(Math.atan(1 / (asrFactor + Math.tan(Math.abs(lat_rad - dec_rad)))));
  const asrHA = getHourAngle(asrAltitude);
  const asrHours = solarNoon + asrHA / 15;

  // Maghrib: sunset + ~1.5 mins
  const maghribHours = sunsetHours + (1.5 / 60);

  // Isha
  let ishaHours: number;
  if (ishaFixedMinutes > 0) {
    ishaHours = maghribHours + ishaFixedMinutes / 60;
  } else {
    const ishaHA = getHourAngle(-ishaAngle);
    ishaHours = solarNoon + ishaHA / 15;
  }

  const formatTime = (timeInHours: number): string => {
    let normalized = (timeInHours + 24) % 24;
    const h = Math.floor(normalized);
    const m = Math.floor((normalized - h) * 60);
    const hStr = h.toString().padStart(2, '0');
    const mStr = m.toString().padStart(2, '0');
    return `${hStr}:${mStr}`;
  };

  const hijri = getHijriDate(date);

  const rawTimings: PrayerTimeData = {
    fajr: formatTime(fajrHours),
    sunrise: formatTime(sunriseHours),
    dhuhr: formatTime(dhuhrHours),
    asr: formatTime(asrHours),
    maghrib: formatTime(maghribHours),
    isha: formatTime(ishaHours),
    date: date.toISOString().split('T')[0],
    hijriDate: `${hijri.day} ${hijri.monthName} ${hijri.year} هـ`,
    hijriDay: hijri.day.toString(),
    hijriMonth: hijri.monthName,
    hijriYear: hijri.year.toString()
  };

  return applyOffsetsToPrayerTimes(rawTimings, offsets);
}

const HIJRI_MONTHS = [
  'المحرّم',
  'صفر',
  'ربيع الأول',
  'ربيع الآخر',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان المبارك',
  'شوّال',
  'ذو القعدة',
  'ذو الحجة'
];

export function getHijriDate(gregorianDate: Date) {
  const day = gregorianDate.getDate();
  const month = gregorianDate.getMonth();
  const year = gregorianDate.getFullYear();

  let m = month + 1;
  let y = year;
  if (m < 3) {
    y -= 1;
    m += 12;
  }

  let a = Math.floor(y / 100);
  let b = 2 - a + Math.floor(a / 4);
  if (y < 1583) b = 0;
  if (y === 1582) {
    if (m > 10) b = -10;
    if (m === 10) {
      b = 0;
      if (day > 4) b = -10;
    }
  }

  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524;
  const z = jd - 1948440 + 10632;
  const n = Math.floor((z - 1) / 10631);
  const remZ = z - 10631 * n + 354;
  const j =
    Math.floor((10985 - remZ) / 5316) * Math.floor((50 * remZ) / 17719) +
    Math.floor(remZ / 5670) * Math.floor((43 * remZ) / 15238);
  const rem2 =
    remZ -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const hijriMonth = Math.floor((24 * rem2) / 709);
  const hijriDay = rem2 - Math.floor((709 * hijriMonth) / 24);
  const hijriYear = 30 * n + j - 30;

  const safeMonthIndex = Math.max(0, Math.min(11, hijriMonth - 1));

  return {
    day: Math.max(1, Math.min(30, hijriDay)),
    month: hijriMonth,
    monthName: HIJRI_MONTHS[safeMonthIndex] || HIJRI_MONTHS[0],
    year: hijriYear
  };
}

export interface NextPrayerInfo {
  name: string;
  nameArabic: string;
  timeString: string;
  remainingMinutes: number;
  remainingSeconds: number;
  formattedCountdown: string;
  percentage: number;
  currentPrayerName: string;
}

export function getNextPrayer(prayers: PrayerTimeData): NextPrayerInfo {
  const now = new Date();
  const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  const prayerList = [
    { key: 'fajr', nameArabic: 'الفجر', time: prayers.fajr },
    { key: 'sunrise', nameArabic: 'الشروق', time: prayers.sunrise },
    { key: 'dhuhr', nameArabic: 'الظهر', time: prayers.dhuhr },
    { key: 'asr', nameArabic: 'العصر', time: prayers.asr },
    { key: 'maghrib', nameArabic: 'المغرب', time: prayers.maghrib },
    { key: 'isha', nameArabic: 'العشاء', time: prayers.isha }
  ];

  const parsedPrayers = prayerList.map(p => {
    const parts = (p.time || '00:00').split(':').map(Number);
    const h = isNaN(parts[0]) ? 0 : parts[0];
    const m = isNaN(parts[1]) ? 0 : parts[1];
    return { ...p, totalSeconds: h * 3600 + m * 60 };
  });

  // Find next upcoming prayer today
  const next = parsedPrayers.find(p => p.totalSeconds > currentSeconds);

  if (!next) {
    // Current time is after Isha -> Next prayer is tomorrow's Fajr
    const tomorrowFajr = parsedPrayers[0];
    const remainingSec = 86400 - currentSeconds + tomorrowFajr.totalSeconds;
    const hrs = Math.floor(remainingSec / 3600);
    const mins = Math.floor((remainingSec % 3600) / 60);
    const secs = remainingSec % 60;

    return {
      name: tomorrowFajr.key,
      nameArabic: tomorrowFajr.nameArabic,
      timeString: tomorrowFajr.time,
      remainingMinutes: Math.floor(remainingSec / 60),
      remainingSeconds: remainingSec,
      formattedCountdown: `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
      percentage: 20,
      currentPrayerName: 'العشاء'
    };
  }

  const nextIndex = parsedPrayers.indexOf(next);
  const prevIndex = nextIndex === 0 ? parsedPrayers.length - 1 : nextIndex - 1;
  const prevPrayer = parsedPrayers[prevIndex];

  const remainingSec = next.totalSeconds - currentSeconds;
  const hrs = Math.floor(remainingSec / 3600);
  const mins = Math.floor((remainingSec % 3600) / 60);
  const secs = remainingSec % 60;

  const totalWindow = (next.totalSeconds - prevPrayer.totalSeconds + 86400) % 86400;
  const elapsed = (currentSeconds - prevPrayer.totalSeconds + 86400) % 86400;
  const percentage = Math.min(100, Math.max(0, (elapsed / (totalWindow || 1)) * 100));

  return {
    name: next.key,
    nameArabic: next.nameArabic,
    timeString: next.time,
    remainingMinutes: Math.floor(remainingSec / 60),
    remainingSeconds: remainingSec,
    formattedCountdown: `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
    percentage,
    currentPrayerName: prevPrayer.nameArabic
  };
}

/**
 * Converts a 24-hour time string ("14:35") to user-friendly 12-hour or 24-hour format.
 * In 12h mode: "02:35 م" or "05:15 ص"
 */
export function formatPrayerTime(time24: string, format: '12h' | '24h' = '12h'): string {
  if (!time24) return '--:--';
  if (format === '24h') return time24;

  const parts = time24.split(':').map(Number);
  if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return time24;

  let hours = parts[0];
  const minutes = parts[1];
  const period = hours >= 12 ? 'م' : 'ص';

  hours = hours % 12;
  if (hours === 0) hours = 12;

  const hStr = hours.toString().padStart(2, '0');
  const mStr = minutes.toString().padStart(2, '0');

  return `${hStr}:${mStr} ${period}`;
}
