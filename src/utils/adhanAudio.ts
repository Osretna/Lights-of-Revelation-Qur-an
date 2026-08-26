export interface MuadhinOption {
  id: string;
  name: string;
  location: string;
  audioUrl: string;
}

export const MUADHINS_LIST: MuadhinOption[] = [
  {
    id: 'makkah',
    name: 'أذان المسجد الحرام (مكة المكرمة)',
    location: 'مكة المكرمة - الشيخ علي أحمد ملا',
    audioUrl: 'https://cdn.aladhan.com/audio/adhans/makkah.mp3'
  },
  {
    id: 'madinah',
    name: 'أذان المسجد النبوي الشريف',
    location: 'المدينة المنورة - الشيخ عصام بخاري',
    audioUrl: 'https://cdn.aladhan.com/audio/adhans/madina.mp3'
  },
  {
    id: 'alaqsa',
    name: 'أذان المسجد الأقصى المبارك',
    location: 'القدس الشريف',
    audioUrl: 'https://cdn.aladhan.com/audio/adhans/alaqsa.mp3'
  },
  {
    id: 'egypt',
    name: 'أذان جمهورية مصر العربية',
    location: 'القاهرة - مسجد الحسين',
    audioUrl: 'https://cdn.aladhan.com/audio/adhans/egypt.mp3'
  },
  {
    id: 'abdul_basit',
    name: 'أذان بصوت الشيخ عبد الباسط عبد الصمد',
    location: 'تسجيل تاريخي نادر',
    audioUrl: 'https://cdn.aladhan.com/audio/adhans/abdulbasit.mp3'
  }
];

// Fallback pleasant notification sound using Web Audio API
export function playIslamicTone() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;
    // Layered serene chime notes
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (serene major chord)
    
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.15);
      
      gain.gain.setValueAtTime(0, now + i * 0.15);
      gain.gain.linearRampToValueAtTime(0.2, now + i * 0.15 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 2.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 2.5);
    });
  } catch {
    // ignore if audio context blocked by browser autoplay policy
  }
}
