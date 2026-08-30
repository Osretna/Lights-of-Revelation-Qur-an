export interface CityLocation {
  city: string;
  arabicCity: string;
  country: string;
  arabicCountry: string;
  latitude: number;
  longitude: number;
  timezone: string;
  method: 'Egyptian' | 'UmmAlQura' | 'MuslimWorldLeague' | 'NorthAmerica' | 'Karachi' | 'Dubai' | 'Kuwait' | 'Qatar' | 'Turkey';
}

export const CITIES_DATABASE: CityLocation[] = [
  // Egypt (مصر)
  { city: 'Cairo', arabicCity: 'القاهرة', country: 'Egypt', arabicCountry: 'مصر', latitude: 30.0444, longitude: 31.2357, timezone: 'Africa/Cairo', method: 'Egyptian' },
  { city: 'Alexandria', arabicCity: 'الإسكندرية', country: 'Egypt', arabicCountry: 'مصر', latitude: 31.2001, longitude: 29.9187, timezone: 'Africa/Cairo', method: 'Egyptian' },
  { city: 'Giza', arabicCity: 'الجيزة', country: 'Egypt', arabicCountry: 'مصر', latitude: 30.0131, longitude: 31.2089, timezone: 'Africa/Cairo', method: 'Egyptian' },
  { city: 'Mansoura', arabicCity: 'المنصورة', country: 'Egypt', arabicCountry: 'مصر', latitude: 31.0409, longitude: 31.3785, timezone: 'Africa/Cairo', method: 'Egyptian' },
  { city: 'Tanta', arabicCity: 'طنطا', country: 'Egypt', arabicCountry: 'مصر', latitude: 30.7865, longitude: 31.0004, timezone: 'Africa/Cairo', method: 'Egyptian' },
  { city: 'Asyut', arabicCity: 'أسيوط', country: 'Egypt', arabicCountry: 'مصر', latitude: 27.1783, longitude: 31.1859, timezone: 'Africa/Cairo', method: 'Egyptian' },
  { city: 'Aswan', arabicCity: 'أسوان', country: 'Egypt', arabicCountry: 'مصر', latitude: 24.0889, longitude: 32.8998, timezone: 'Africa/Cairo', method: 'Egyptian' },
  { city: 'Port Said', arabicCity: 'بورسعيد', country: 'Egypt', arabicCountry: 'مصر', latitude: 31.2653, longitude: 32.3019, timezone: 'Africa/Cairo', method: 'Egyptian' },
  { city: 'Suez', arabicCity: 'السويس', country: 'Egypt', arabicCountry: 'مصر', latitude: 29.9668, longitude: 32.5498, timezone: 'Africa/Cairo', method: 'Egyptian' },
  { city: 'Luxor', arabicCity: 'الأقصر', country: 'Egypt', arabicCountry: 'مصر', latitude: 25.6872, longitude: 32.6396, timezone: 'Africa/Cairo', method: 'Egyptian' },

  // Saudi Arabia (المملكة العربية السعودية)
  { city: 'Makkah', arabicCity: 'مكة المكرمة', country: 'Saudi Arabia', arabicCountry: 'السعودية', latitude: 21.4225, longitude: 39.8262, timezone: 'Asia/Riyadh', method: 'UmmAlQura' },
  { city: 'Madinah', arabicCity: 'المدينة المنورة', country: 'Saudi Arabia', arabicCountry: 'السعودية', latitude: 24.5247, longitude: 39.5692, timezone: 'Asia/Riyadh', method: 'UmmAlQura' },
  { city: 'Riyadh', arabicCity: 'الرياض', country: 'Saudi Arabia', arabicCountry: 'السعودية', latitude: 24.7136, longitude: 46.6753, timezone: 'Asia/Riyadh', method: 'UmmAlQura' },
  { city: 'Jeddah', arabicCity: 'جدة', country: 'Saudi Arabia', arabicCountry: 'السعودية', latitude: 21.5433, longitude: 39.1728, timezone: 'Asia/Riyadh', method: 'UmmAlQura' },
  { city: 'Dammam', arabicCity: 'الدمام', country: 'Saudi Arabia', arabicCountry: 'السعودية', latitude: 26.4207, longitude: 50.0888, timezone: 'Asia/Riyadh', method: 'UmmAlQura' },
  { city: 'Taif', arabicCity: 'الطائف', country: 'Saudi Arabia', arabicCountry: 'السعودية', latitude: 21.2854, longitude: 40.4222, timezone: 'Asia/Riyadh', method: 'UmmAlQura' },

  // UAE (الإمارات العربية المتحدة)
  { city: 'Dubai', arabicCity: 'دبي', country: 'UAE', arabicCountry: 'الإمارات', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai', method: 'Dubai' },
  { city: 'Abu Dhabi', arabicCity: 'أبوظبي', country: 'UAE', arabicCountry: 'الإمارات', latitude: 24.4539, longitude: 54.3773, timezone: 'Asia/Dubai', method: 'Dubai' },
  { city: 'Sharjah', arabicCity: 'الشارقة', country: 'UAE', arabicCountry: 'الإمارات', latitude: 25.3463, longitude: 55.4209, timezone: 'Asia/Dubai', method: 'Dubai' },

  // Palestine & Jordan (فلسطين والأردن)
  { city: 'Jerusalem', arabicCity: 'القدس الشريف', country: 'Palestine', arabicCountry: 'فلسطين', latitude: 31.7683, longitude: 35.2137, timezone: 'Asia/Jerusalem', method: 'MuslimWorldLeague' },
  { city: 'Gaza', arabicCity: 'غزة', country: 'Palestine', arabicCountry: 'فلسطين', latitude: 31.5017, longitude: 34.4668, timezone: 'Asia/Gaza', method: 'Egyptian' },
  { city: 'Amman', arabicCity: 'عمّان', country: 'Jordan', arabicCountry: 'الأردن', latitude: 31.9454, longitude: 35.9284, timezone: 'Asia/Amman', method: 'MuslimWorldLeague' },

  // Kuwait, Qatar, Bahrain, Oman
  { city: 'Kuwait City', arabicCity: 'الكويت', country: 'Kuwait', arabicCountry: 'الكويت', latitude: 29.3759, longitude: 47.9774, timezone: 'Asia/Kuwait', method: 'Kuwait' },
  { city: 'Doha', arabicCity: 'الدوحة', country: 'Qatar', arabicCountry: 'قطر', latitude: 25.2854, longitude: 51.5310, timezone: 'Asia/Qatar', method: 'Qatar' },
  { city: 'Manama', arabicCity: 'المنامة', country: 'Bahrain', arabicCountry: 'البحرين', latitude: 26.2285, longitude: 50.5860, timezone: 'Asia/Bahrain', method: 'UmmAlQura' },
  { city: 'Muscat', arabicCity: 'مسقط', country: 'Oman', arabicCountry: 'عُمان', latitude: 23.5880, longitude: 58.3829, timezone: 'Asia/Muscat', method: 'Dubai' },

  // North Africa (المغرب العربي)
  { city: 'Casablanca', arabicCity: 'الدار البيضاء', country: 'Morocco', arabicCountry: 'المغرب', latitude: 33.5731, longitude: -7.5898, timezone: 'Africa/Casablanca', method: 'MuslimWorldLeague' },
  { city: 'Rabat', arabicCity: 'الرباط', country: 'Morocco', arabicCountry: 'المغرب', latitude: 34.0209, longitude: -6.8416, timezone: 'Africa/Casablanca', method: 'MuslimWorldLeague' },
  { city: 'Algiers', arabicCity: 'الجزائر العاصمة', country: 'Algeria', arabicCountry: 'الجزائر', latitude: 36.7538, longitude: 3.0588, timezone: 'Africa/Algiers', method: 'MuslimWorldLeague' },
  { city: 'Tunis', arabicCity: 'تونس العاصمة', country: 'Tunisia', arabicCountry: 'تونس', latitude: 36.8065, longitude: 10.1815, timezone: 'Africa/Tunis', method: 'MuslimWorldLeague' },
  { city: 'Tripoli', arabicCity: 'طرابلس', country: 'Libya', arabicCountry: 'ليبيا', latitude: 32.8872, longitude: 13.1913, timezone: 'Africa/Tripoli', method: 'Egyptian' },
  { city: 'Khartoum', arabicCity: 'الخرطوم', country: 'Sudan', arabicCountry: 'السودان', latitude: 15.5007, longitude: 32.5599, timezone: 'Africa/Khartoum', method: 'Egyptian' },

  // Levant & Iraq (بلاد الشام والعراق)
  { city: 'Baghdad', arabicCity: 'بغداد', country: 'Iraq', arabicCountry: 'العراق', latitude: 33.3152, longitude: 44.3661, timezone: 'Asia/Baghdad', method: 'MuslimWorldLeague' },
  { city: 'Erbil', arabicCity: 'أربيل', country: 'Iraq', arabicCountry: 'العراق', latitude: 36.1911, longitude: 44.0092, timezone: 'Asia/Baghdad', method: 'MuslimWorldLeague' },
  { city: 'Damascus', arabicCity: 'دمشق', country: 'Syria', arabicCountry: 'سوريا', latitude: 33.5138, longitude: 36.2765, timezone: 'Asia/Damascus', method: 'MuslimWorldLeague' },
  { city: 'Beirut', arabicCity: 'بيروت', country: 'Lebanon', arabicCountry: 'لبنان', latitude: 33.8938, longitude: 35.5018, timezone: 'Asia/Beirut', method: 'MuslimWorldLeague' },

  // Turkey, Europe, America, Asia
  { city: 'Istanbul', arabicCity: 'إسطنبول', country: 'Turkey', arabicCountry: 'تركيا', latitude: 41.0082, longitude: 28.9784, timezone: 'Europe/Istanbul', method: 'Turkey' },
  { city: 'Ankara', arabicCity: 'أنقرة', country: 'Turkey', arabicCountry: 'تركيا', latitude: 39.9334, longitude: 32.8597, timezone: 'Europe/Istanbul', method: 'Turkey' },
  { city: 'London', arabicCity: 'لندن', country: 'UK', arabicCountry: 'بريطانيا', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London', method: 'MuslimWorldLeague' },
  { city: 'Paris', arabicCity: 'باريس', country: 'France', arabicCountry: 'فرنسا', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris', method: 'MuslimWorldLeague' },
  { city: 'Berlin', arabicCity: 'برلين', country: 'Germany', arabicCountry: 'ألمانيا', latitude: 52.5200, longitude: 13.4050, timezone: 'Europe/Berlin', method: 'MuslimWorldLeague' },
  { city: 'New York', arabicCity: 'نيويورك', country: 'USA', arabicCountry: 'أمريكا', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York', method: 'NorthAmerica' },
  { city: 'Toronto', arabicCity: 'تورونتو', country: 'Canada', arabicCountry: 'كندا', latitude: 43.6532, longitude: -79.3832, timezone: 'America/Toronto', method: 'NorthAmerica' },
  { city: 'Karachi', arabicCity: 'كراتشي', country: 'Pakistan', arabicCountry: 'باكستان', latitude: 24.8607, longitude: 67.0011, timezone: 'Asia/Karachi', method: 'Karachi' },
  { city: 'Kuala Lumpur', arabicCity: 'كوالالمبور', country: 'Malaysia', arabicCountry: 'ماليزيا', latitude: 3.1390, longitude: 101.6869, timezone: 'Asia/Kuala_Lumpur', method: 'MuslimWorldLeague' },
  { city: 'Jakarta', arabicCity: 'جاكرتا', country: 'Indonesia', arabicCountry: 'إندونيسيا', latitude: -6.2088, longitude: 106.8456, timezone: 'Asia/Jakarta', method: 'MuslimWorldLeague' }
];

export const CALCULATION_METHODS = [
  { id: 'Egyptian', name: 'الهيئة المصرية العامة للمساحة', region: 'مصر، إفريقيا، الشرق الأوسط' },
  { id: 'UmmAlQura', name: 'جامعة أم القرى - مكة المكرمة', region: 'السعودية والخليج' },
  { id: 'MuslimWorldLeague', name: 'رابطة العالم الإسلامي', region: 'أوروبا وعالمي' },
  { id: 'NorthAmerica', name: 'الجمعية الإسلامية لأمريكا الشمالية (ISNA)', region: 'أمريكا وكندا' },
  { id: 'Karachi', name: 'جامعة العلوم الإسلامية بكراتشي', region: 'باكستان، الهند، بنغلاديش' },
  { id: 'Dubai', name: 'دائرة الشؤون الإسلامية بدبي', region: 'الإمارات' },
  { id: 'Kuwait', name: 'وزارة الأوقاف والشؤون الإسلامية بالكويت', region: 'الكويت' },
  { id: 'Qatar', name: 'وزارة الأوقاف والشؤون الإسلامية بقطر', region: 'قطر' },
  { id: 'Turkey', name: 'رئاسة الشؤون الدينية بتركيا (ديانت)', region: 'تركيا' }
];
