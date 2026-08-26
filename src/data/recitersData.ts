import { Reciter } from '../types/quran';

export const RECITERS_LIST: Reciter[] = [
  {
    id: 'abdul_basit_murattal',
    name: 'عبد الباسط عبد الصمد',
    style: 'مرتل',
    bitrate: '192 kbps',
    serverUrl: 'https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/',
    photo: 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?w=150&auto=format&fit=crop&q=80',
    surahAudioUrlPattern: (surahNum: number) => {
      const padded = surahNum.toString().padStart(3, '0');
      return `https://server7.mp3quran.net/basit/${padded}.mp3`;
    },
    ayahAudioUrlPattern: (surahNum: number, ayahNum: number) => {
      const s = surahNum.toString().padStart(3, '0');
      const a = ayahNum.toString().padStart(3, '0');
      return `https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/${s}${a}.mp3`;
    }
  },
  {
    id: 'alafasy',
    name: 'مشاري راشد العفاسي',
    style: 'مرتل',
    bitrate: '128 kbps',
    serverUrl: 'https://everyayah.com/data/Alafasy_128kbps/',
    surahAudioUrlPattern: (surahNum: number) => {
      const padded = surahNum.toString().padStart(3, '0');
      return `https://server8.mp3quran.net/afs/${padded}.mp3`;
    },
    ayahAudioUrlPattern: (surahNum: number, ayahNum: number) => {
      const s = surahNum.toString().padStart(3, '0');
      const a = ayahNum.toString().padStart(3, '0');
      return `https://everyayah.com/data/Alafasy_128kbps/${s}${a}.mp3`;
    }
  },
  {
    id: 'minshawy_murattal',
    name: 'محمد صديق المنشاوي',
    style: 'مرتل',
    bitrate: '128 kbps',
    serverUrl: 'https://everyayah.com/data/Minshawy_Murattal_128kbps/',
    surahAudioUrlPattern: (surahNum: number) => {
      const padded = surahNum.toString().padStart(3, '0');
      return `https://server10.mp3quran.net/minsh/${padded}.mp3`;
    },
    ayahAudioUrlPattern: (surahNum: number, ayahNum: number) => {
      const s = surahNum.toString().padStart(3, '0');
      const a = ayahNum.toString().padStart(3, '0');
      return `https://everyayah.com/data/Minshawy_Murattal_128kbps/${s}${a}.mp3`;
    }
  },
  {
    id: 'muaiqly',
    name: 'ماهر المعيقلي',
    style: 'مرتل',
    bitrate: '128 kbps',
    serverUrl: 'https://everyayah.com/data/MaherAlMuaiqly128kbps/',
    surahAudioUrlPattern: (surahNum: number) => {
      const padded = surahNum.toString().padStart(3, '0');
      return `https://server12.mp3quran.net/maher/${padded}.mp3`;
    },
    ayahAudioUrlPattern: (surahNum: number, ayahNum: number) => {
      const s = surahNum.toString().padStart(3, '0');
      const a = ayahNum.toString().padStart(3, '0');
      return `https://everyayah.com/data/MaherAlMuaiqly128kbps/${s}${a}.mp3`;
    }
  },
  {
    id: 'sudais',
    name: 'عبد الرحمن السديس',
    style: 'مرتل',
    bitrate: '192 kbps',
    serverUrl: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/',
    surahAudioUrlPattern: (surahNum: number) => {
      const padded = surahNum.toString().padStart(3, '0');
      return `https://server11.mp3quran.net/sds/${padded}.mp3`;
    },
    ayahAudioUrlPattern: (surahNum: number, ayahNum: number) => {
      const s = surahNum.toString().padStart(3, '0');
      const a = ayahNum.toString().padStart(3, '0');
      return `https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/${s}${a}.mp3`;
    }
  },
  {
    id: 'dossari',
    name: 'ياسر الدوسري',
    style: 'مرتل',
    bitrate: '128 kbps',
    serverUrl: 'https://everyayah.com/data/Yasser_Ad-Dussary_128kbps/',
    surahAudioUrlPattern: (surahNum: number) => {
      const padded = surahNum.toString().padStart(3, '0');
      return `https://server11.mp3quran.net/yasser/${padded}.mp3`;
    },
    ayahAudioUrlPattern: (surahNum: number, ayahNum: number) => {
      const s = surahNum.toString().padStart(3, '0');
      const a = ayahNum.toString().padStart(3, '0');
      return `https://everyayah.com/data/Yasser_Ad-Dussary_128kbps/${s}${a}.mp3`;
    }
  },
  {
    id: 'husary_murattal',
    name: 'محمود خليل الحصري',
    style: 'مرتل',
    bitrate: '128 kbps',
    serverUrl: 'https://everyayah.com/data/Husary_128kbps/',
    surahAudioUrlPattern: (surahNum: number) => {
      const padded = surahNum.toString().padStart(3, '0');
      return `https://server13.mp3quran.net/husr/${padded}.mp3`;
    },
    ayahAudioUrlPattern: (surahNum: number, ayahNum: number) => {
      const s = surahNum.toString().padStart(3, '0');
      const a = ayahNum.toString().padStart(3, '0');
      return `https://everyayah.com/data/Husary_128kbps/${s}${a}.mp3`;
    }
  },
  {
    id: 'ghamadi',
    name: 'سعد الغامدي',
    style: 'مرتل',
    bitrate: '128 kbps',
    serverUrl: 'https://everyayah.com/data/Ghamadi_40kbps/',
    surahAudioUrlPattern: (surahNum: number) => {
      const padded = surahNum.toString().padStart(3, '0');
      return `https://server7.mp3quran.net/s_gmd/${padded}.mp3`;
    },
    ayahAudioUrlPattern: (surahNum: number, ayahNum: number) => {
      const s = surahNum.toString().padStart(3, '0');
      const a = ayahNum.toString().padStart(3, '0');
      return `https://everyayah.com/data/Ghamadi_40kbps/${s}${a}.mp3`;
    }
  },
  {
    id: 'abdul_basit_mujawwad',
    name: 'عبد الباسط عبد الصمد',
    style: 'مجود',
    bitrate: '192 kbps',
    serverUrl: 'https://everyayah.com/data/Abdul_Basit_Mujawwad_128kbps/',
    surahAudioUrlPattern: (surahNum: number) => {
      const padded = surahNum.toString().padStart(3, '0');
      return `https://server7.mp3quran.net/basit/Mujawwad/${padded}.mp3`;
    },
    ayahAudioUrlPattern: (surahNum: number, ayahNum: number) => {
      const s = surahNum.toString().padStart(3, '0');
      const a = ayahNum.toString().padStart(3, '0');
      return `https://everyayah.com/data/Abdul_Basit_Mujawwad_128kbps/${s}${a}.mp3`;
    }
  },
  {
    id: 'minshawy_mujawwad',
    name: 'محمد صديق المنشاوي',
    style: 'مجود',
    bitrate: '128 kbps',
    serverUrl: 'https://everyayah.com/data/Minshawy_Mujawwad_192kbps/',
    surahAudioUrlPattern: (surahNum: number) => {
      const padded = surahNum.toString().padStart(3, '0');
      return `https://server10.mp3quran.net/minsh/Mujawwad/${padded}.mp3`;
    },
    ayahAudioUrlPattern: (surahNum: number, ayahNum: number) => {
      const s = surahNum.toString().padStart(3, '0');
      const a = ayahNum.toString().padStart(3, '0');
      return `https://everyayah.com/data/Minshawy_Mujawwad_192kbps/${s}${a}.mp3`;
    }
  }
];
