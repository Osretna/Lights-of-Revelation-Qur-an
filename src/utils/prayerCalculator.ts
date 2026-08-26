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
  { name: 'عمان', country: 'الأردن', lat: 31.9454, lng: 35.9284, timezone: 3 },
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

// Convert degrees to radians and vice versa
const rad = (d: number) => (d * Math.PI) / 180.0;
const deg = (r: number) => (r * 180.0) / Math.PI;

// Calculate Qibla bearing from user coordinates
export function calculateQiblaDirection(userLat: number, userLng: number): number {
  const phiK = rad(KAABA_LAT);
  const lambdaK = rad(KAABA_LNG);
  const phi = rad(userLat);
  const lambda = rad(userLng);

  const deltaLambda = lambdaK - lambda;
  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(deltaLambda);
  let qibla = deg(Math.atan2(y, x));
  return (qibla + 360) % 360;
}

// Calculate distance to Kaaba in kilometers
export function calculateDistanceToKaaba(userLat: number, userLng: number): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = rad(KAABA_LAT - userLat);
  const dLng = rad(KAABA_LNG - userLng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(userLat)) * Math.cos(rad(KAABA_LAT)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Calculate prayer times for a given date, coordinates, and calculation method
export function calculatePrayerTimes(
  date: Date,
  lat: number,
  lng: number,
  method: 'MWL' | 'ISNA' | 'Egypt' | 'Makkah' | 'Karachi' = 'Makkah',
  juristic: 'shafii' | 'hanafi' = 'shafii'
): PrayerTimeData {
  // Calculation parameters by method
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

  // Day of year
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime() + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Approximate solar declination & equation of time
  const B = (360 / 365) * (dayOfYear - 81);
  const B_rad = rad(B);
  const eot = 9.87 * Math.sin(2 * B_rad) - 7.53 * Math.cos(B_rad) - 1.5 * Math.sin(B_rad); // in minutes
  const declination = 23.45 * Math.sin(rad((360 / 365) * (dayOfYear - 81))); // in degrees
  const dec_rad = rad(declination);
  const lat_rad = rad(lat);

  // Time zone offset in hours
  const timezoneOffset = -date.getTimezoneOffset() / 60;

  // Solar Noon in local clock time (hours)
  const solarNoon = 12 + timezoneOffset - lng / 15 - eot / 60;

  // Hour angle helper
  const getHourAngle = (angle: number) => {
    const cosHA = (Math.sin(rad(angle)) - Math.sin(lat_rad) * Math.sin(dec_rad)) / (Math.cos(lat_rad) * Math.cos(dec_rad));
    if (cosHA > 1) return 0; // sun never rises that high
    if (cosHA < -1) return 180; // sun never sets that low
    return deg(Math.acos(cosHA));
  };

  // Sunrise / Sunset hour angle (-0.833° for refraction & sun disc)
  const sunriseHA = getHourAngle(-0.833);
  const sunriseHours = solarNoon - sunriseHA / 15;
  const sunsetHours = solarNoon + sunriseHA / 15;

  // Fajr hour angle
  const fajrHA = getHourAngle(-fajrAngle);
  const fajrHours = solarNoon - fajrHA / 15;

  // Asr
  const asrAngle = -deg(Math.atan(1 / (asrFactor + Math.tan(Math.abs(lat_rad - dec_rad)))));
  const asrHA = getHourAngle(asrAngle);
  const asrHours = solarNoon + asrHA / 15;

  // Maghrib
  const maghribHours = sunsetHours + 0.04; // ~2.5 mins after sunset for verification

  // Isha
  let ishaHours: number;
  if (ishaFixedMinutes > 0) {
    ishaHours = maghribHours + ishaFixedMinutes / 60;
  } else {
    const ishaHA = getHourAngle(-ishaAngle);
    ishaHours = solarNoon + ishaHA / 15;
  }

  // Format into HH:MM
  const formatTime = (timeInHours: number): string => {
    let normalized = (timeInHours + 24) % 24;
    const h = Math.floor(normalized);
    const m = Math.floor((normalized - h) * 60);
    const hStr = h.toString().padStart(2, '0');
    const mStr = m.toString().padStart(2, '0');
    return `${hStr}:${mStr}`;
  };

  // Hijri Date estimation
  const hijri = getHijriDate(date);

  return {
    fajr: formatTime(fajrHours),
    sunrise: formatTime(sunriseHours),
    dhuhr: formatTime(solarNoon),
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

// Arabic Hijri months
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
  // Kuwaity algorithm approximation for Hijri
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

  let jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524;
  b = 0;
  if (jd > 2299160) {
    a = Math.floor((jd - 1867216.25) / 36524.25);
    b = 1 + a - Math.floor(a / 4);
  }
  let bb = jd + b + 1524;
  let cc = Math.floor((bb - 122.1) / 365.25);
  let dd = Math.floor(365.25 * cc);
  let ee = Math.floor((bb - dd) / 30.6001);
  day;

  let z = jd - 1948440 + 10632;
  let n = Math.floor((z - 1) / 10631);
  z = z - 10631 * n + 354;
  let j =
    Math.floor((10985 - z) / 5316) * Math.floor((50 * z) / 17719) +
    Math.floor(z / 5670) * Math.floor((43 * z) / 15238);
  z =
    z -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  let hijriMonth = Math.floor((24 * z) / 709);
  let hijriDay = z - Math.floor((709 * hijriMonth) / 24);
  let hijriYear = 30 * n + j - 30;

  // Clamp month index
  const safeMonthIndex = Math.max(0, Math.min(11, hijriMonth - 1));

  return {
    day: hijriDay,
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
}

export function getNextPrayer(prayers: PrayerTimeData): NextPrayerInfo {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

  const prayerList = [
    { key: 'fajr', nameArabic: 'الفجر', time: prayers.fajr },
    { key: 'sunrise', nameArabic: 'الشروق', time: prayers.sunrise },
    { key: 'dhuhr', nameArabic: 'الظهر', time: prayers.dhuhr },
    { key: 'asr', nameArabic: 'العصر', time: prayers.asr },
    { key: 'maghrib', nameArabic: 'المغرب', time: prayers.maghrib },
    { key: 'isha', nameArabic: 'العشاء', time: prayers.isha }
  ];

  const parsedPrayers = prayerList.map(p => {
    const [h, m] = p.time.split(':').map(Number);
    return { ...p, totalMinutes: h * 60 + m };
  });

  let next = parsedPrayers.find(p => p.totalMinutes > currentMinutes);
  let prevIndex = 0;

  if (!next) {
    // Next prayer is tomorrow's Fajr
    next = parsedPrayers[0];
    prevIndex = parsedPrayers.length - 1;
    const diff = 24 * 60 - currentMinutes + next.totalMinutes;
    const remainingSec = Math.floor(diff * 60);
    const hrs = Math.floor(remainingSec / 3600);
    const mins = Math.floor((remainingSec % 3600) / 60);
    const secs = remainingSec % 60;
    return {
      name: next.key,
      nameArabic: next.nameArabic,
      timeString: next.time,
      remainingMinutes: Math.floor(diff),
      remainingSeconds: remainingSec,
      formattedCountdown: `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
      percentage: 25
    };
  }

  const nextIndex = parsedPrayers.indexOf(next);
  prevIndex = nextIndex === 0 ? parsedPrayers.length - 1 : nextIndex - 1;
  const prevTime = parsedPrayers[prevIndex].totalMinutes;
  
  const diff = next.totalMinutes - currentMinutes;
  const remainingSec = Math.floor(diff * 60);
  const hrs = Math.floor(remainingSec / 3600);
  const mins = Math.floor((remainingSec % 3600) / 60);
  const secs = remainingSec % 60;

  const totalWindow = (next.totalMinutes - prevTime + 1440) % 1440;
  const elapsed = (currentMinutes - prevTime + 1440) % 1440;
  const percentage = Math.min(100, Math.max(0, (elapsed / (totalWindow || 1)) * 100));

  return {
    name: next.key,
    nameArabic: next.nameArabic,
    timeString: next.time,
    remainingMinutes: Math.floor(diff),
    remainingSeconds: remainingSec,
    formattedCountdown: `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
    percentage
  };
}
