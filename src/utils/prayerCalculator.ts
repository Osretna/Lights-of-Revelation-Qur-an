import { PrayerTimeData } from '../types/quran';

export interface CityLocation {
  name: string;
  country: string;
  lat: number;
  lng: number;
  timezone: number;
}

export const POPULAR_CITIES: CityLocation[] = [
  { name: 'مكة المكرمة', country: 'السعودية', lat: 21.4225, lng: 39.8262, timezone: 3 },
  { name: 'المدينة المنورة', country: 'السعودية', lat: 24.5247, lng: 39.5692, timezone: 3 },
  { name: 'الرياض', country: 'السعودية', lat: 24.7136, lng: 46.6753, timezone: 3 },
  { name: 'القاهرة', country: 'مصر', lat: 30.0444, lng: 31.2357, timezone: 2 },
  { name: 'الإسكندرية', country: 'مصر', lat: 31.2001, lng: 29.9187, timezone: 2 },
  { name: 'القدس الشريف', country: 'فلسطين', lat: 31.7683, lng: 35.2137, timezone: 2 },
  { name: 'دبي', country: 'الإمارات', lat: 25.2048, lng: 55.2708, timezone: 4 },
  { name: 'أبوظبي', country: 'الإمارات', lat: 24.4539, lng: 54.3773, timezone: 4 },
  { name: 'الكويت', country: 'الكويت', lat: 29.3759, lng: 47.9774, timezone: 3 },
  { name: 'الدوحة', country: 'قطر', lat: 25.2854, lng: 51.5310, timezone: 3 },
  { name: 'مسقط', country: 'عمان', lat: 23.5880, lng: 58.3829, timezone: 4 },
  { name: 'المنامة', country: 'البحرين', lat: 26.2285, lng: 50.5860, timezone: 3 },
  { name: 'عمّان', country: 'الأردن', lat: 31.9454, lng: 35.9284, timezone: 3 },
  { name: 'بيروت', country: 'لبنان', lat: 33.8938, lng: 35.5018, timezone: 2 },
  { name: 'دمشق', country: 'سوريا', lat: 33.5138, lng: 36.2765, timezone: 3 },
  { name: 'بغداد', country: 'العراق', lat: 33.3152, lng: 44.3661, timezone: 3 },
  { name: 'صنعاء', country: 'اليمن', lat: 15.3694, lng: 44.1910, timezone: 3 },
  { name: 'الخرطوم', country: 'السودان', lat: 15.5007, lng: 32.5599, timezone: 2 },
  { name: 'طرابلس', country: 'ليبيا', lat: 32.8872, lng: 13.1913, timezone: 2 },
  { name: 'تونس', country: 'تونس', lat: 36.8065, lng: 10.1815, timezone: 1 },
  { name: 'الجزائر', country: 'الجزائر', lat: 36.7538, lng: 3.0588, timezone: 1 },
  { name: 'الرباط', country: 'المغرب', lat: 34.0209, lng: -6.8416, timezone: 1 },
  { name: 'الدار البيضاء', country: 'المغرب', lat: 33.5731, lng: -7.5898, timezone: 1 },
  { name: 'إسطنبول', country: 'تركيا', lat: 41.0082, lng: 28.9784, timezone: 3 },
  { name: 'جاكرتا', country: 'إندونيسيا', lat: -6.2088, lng: 106.8456, timezone: 7 },
  { name: 'كوالالمبور', country: 'ماليزيا', lat: 3.1390, lng: 101.6869, timezone: 8 },
  { name: 'لندن', country: 'بريطانيا', lat: 51.5074, lng: -0.1278, timezone: 0 },
  { name: 'باريس', country: 'فرنسا', lat: 48.8566, lng: 2.3522, timezone: 1 },
  { name: 'نيويورك', country: 'الولايات المتحدة', lat: 40.7128, lng: -74.0060, timezone: -5 }
];

const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

// Angle conversions
const rad = (d: number) => (d * Math.PI) / 180.0;
const deg = (r: number) => (r * 180.0) / Math.PI;

// Qibla direction bearing
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

// Distance to Kaaba in kilometers
export function calculateDistanceToKaaba(userLat: number, userLng: number): number {
  const R = 6371;
  const dLat = rad(KAABA_LAT - userLat);
  const dLng = rad(KAABA_LNG - userLng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(userLat)) * Math.cos(rad(KAABA_LAT)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Reverse Geocoding Helper
export async function reverseGeocode(lat: number, lng: number): Promise<{ city: string; country: string; fullName: string }> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=ar`
    );
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision || '';
      const country = data.countryName || '';
      if (city || country) {
        const fullName = city && country ? `${city}، ${country}` : city || country;
        return { city: city || country, country, fullName };
      }
    }
  } catch (e) {
    console.warn('BigDataCloud geocode failed, trying fallback', e);
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
      if (city || country) {
        const fullName = city && country ? `${city}، ${country}` : city || country;
        return { city: city || country, country, fullName };
      }
    }
  } catch (e) {
    console.warn('OSM geocode fallback failed', e);
  }

  // Nearest city from POPULAR_CITIES
  let closest = POPULAR_CITIES[0];
  let minD = Infinity;
  for (const c of POPULAR_CITIES) {
    const d = Math.hypot(c.lat - lat, c.lng - lng);
    if (d < minD) {
      minD = d;
      closest = c;
    }
  }
  return { city: closest.name, country: closest.country, fullName: `${closest.name}، ${closest.country}` };
}

// Aladhan Online API
export async function fetchLiveAladhanTimings(
  lat: number,
  lng: number,
  methodName: string = 'Makkah'
): Promise<PrayerTimeData | null> {
  try {
    let methodId = 4; // Umm al-Qura, Makkah
    if (methodName === 'Egypt') methodId = 5;
    else if (methodName === 'MWL') methodId = 3;
    else if (methodName === 'ISNA') methodId = 2;
    else if (methodName === 'Karachi') methodId = 1;

    const today = new Date();
    const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
    const res = await fetch(
      `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=${methodId}`
    );
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

        return {
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
      }
    }
  } catch (e) {
    console.warn('Online Aladhan fetch failed, falling back to local algorithm', e);
  }
  return null;
}

// Offline Astronomical Prayer Times Calculation
export function calculatePrayerTimes(
  date: Date,
  lat: number,
  lng: number,
  method: 'MWL' | 'ISNA' | 'Egypt' | 'Makkah' | 'Karachi' = 'Makkah',
  juristic: 'shafii' | 'hanafi' = 'shafii'
): PrayerTimeData {
  let fajrAngle = 18.5;
  let ishaAngle = 17.5;
  let ishaFixedMinutes = 0;

  switch (method) {
    case 'MWL':
      fajrAngle = 18.0;
      ishaAngle = 17.0;
      break;
    case 'ISNA':
      fajrAngle = 15.0;
      ishaAngle = 15.0;
      break;
    case 'Egypt':
      fajrAngle = 19.5;
      ishaAngle = 17.5;
      break;
    case 'Karachi':
      fajrAngle = 18.0;
      ishaAngle = 18.0;
      break;
    case 'Makkah':
    default:
      fajrAngle = 18.5;
      ishaFixedMinutes = 90;
      break;
  }

  const asrFactor = juristic === 'hanafi' ? 2 : 1;

  // Day of year calculation
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime() + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Solar declination & equation of time (standard Meeus approximations)
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
  const sunriseHA = getHourAngle(-0.833);
  const sunriseHours = solarNoon - sunriseHA / 15;
  const sunsetHours = solarNoon + sunriseHA / 15;

  // Fajr (-fajrAngle below horizon)
  const fajrHA = getHourAngle(-fajrAngle);
  const fajrHours = solarNoon - fajrHA / 15;

  // Dhuhr (solar noon + slight buffer e.g. 1 min)
  const dhuhrHours = solarNoon + (1 / 60);

  // Asr: Altitude angle is POSITIVE above horizon:
  // tan(altitude) = 1 / (asrFactor + tan(|lat - dec|))
  const asrAltitude = deg(Math.atan(1 / (asrFactor + Math.tan(Math.abs(lat_rad - dec_rad)))));
  const asrHA = getHourAngle(asrAltitude);
  const asrHours = solarNoon + asrHA / 15;

  // Maghrib: sunset + ~2.5 mins
  const maghribHours = sunsetHours + (2.5 / 60);

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

  return {
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
