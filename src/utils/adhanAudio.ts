export interface MuadhinOption {
  id: string;
  name: string;
  location: string;
  audioUrl: string;
  fallbackUrls?: string[];
}

export const MUADHINS_LIST: MuadhinOption[] = [
  {
    id: 'makkah',
    name: 'أذان المسجد الحرام (مكة المكرمة)',
    location: 'مكة المكرمة - صوت ندي خاشع',
    audioUrl: '/adhan-makkah.mp3',
    fallbackUrls: ['https://islamcan.com/audio/adhan/azan1.mp3', 'https://cdn.aladhan.com/audio/adhans/a1.mp3']
  },
  {
    id: 'madinah',
    name: 'أذان المسجد النبوي الشريف',
    location: 'المدينة المنورة - صوت شجي مبارك',
    audioUrl: '/adhan-madinah.mp3',
    fallbackUrls: ['https://islamcan.com/audio/adhan/azan2.mp3', 'https://cdn.aladhan.com/audio/adhans/a2.mp3']
  },
  {
    id: 'abdul_basit',
    name: 'أذان بصوت الشيخ عبد الباسط عبد الصمد',
    location: 'تسجيل تاريخي نادر بصوت الشيخ عبد الباسط',
    audioUrl: '/adhan-abdulbasit.mp3',
    fallbackUrls: ['https://islamcan.com/audio/adhan/azan3.mp3', 'https://cdn.aladhan.com/audio/adhans/a3.mp3']
  },
  {
    id: 'egypt',
    name: 'أذان جمهورية مصر العربية',
    location: 'القاهرة - مسجد الإمام الحسين',
    audioUrl: '/adhan-egypt.mp3',
    fallbackUrls: ['https://islamcan.com/audio/adhan/azan4.mp3', 'https://cdn.aladhan.com/audio/adhans/a1.mp3']
  }
];

// Fallback pleasant notification sound using Web Audio API
export function playIslamicTone() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

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
    // ignore
  }
}

// Play adhan audio with full multi-fallback cascade
export function playAdhanAudio(muadhinId = 'makkah'): Promise<HTMLAudioElement | null> {
  return new Promise((resolve) => {
    const muadhin = MUADHINS_LIST.find(m => m.id === muadhinId) || MUADHINS_LIST[0];
    const candidateUrls = [muadhin.audioUrl, ...(muadhin.fallbackUrls || [])];

    let index = 0;
    const tryNext = () => {
      if (index >= candidateUrls.length) {
        // As a last resort, play the harmonic chime
        playIslamicTone();
        resolve(null);
        return;
      }

      const audio = new Audio(candidateUrls[index]);
      audio.volume = 1.0;
      audio
        .play()
        .then(() => {
          resolve(audio);
        })
        .catch(() => {
          index++;
          tryNext();
        });
    };

    tryNext();
  });
}

// Request Notification Permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  try {
    const perm = await Notification.requestPermission();
    return perm;
  } catch {
    return 'denied';
  }
}

// Send Browser / Service Worker Notification
export async function triggerPrayerNotification(title: string, body: string, icon = '/icon-192.png') {
  if (!('Notification' in window)) return;

  if (Notification.permission !== 'granted') {
    const granted = await requestNotificationPermission();
    if (granted !== 'granted') return;
  }

  // Try Service Worker registration first (standard for PWAs on Android & Desktop)
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && 'showNotification' in reg) {
        await reg.showNotification(title, {
          body,
          icon,
          badge: '/icon-96.png',
          tag: 'prayer-notification',
          data: { url: '/' },
          ...({ vibrate: [200, 100, 200, 100, 300] } as any)
        });
        return;
      }
    } catch {
      // fallback
    }
  }

  // Fallback to standard web notification
  try {
    new Notification(title, {
      body,
      icon,
      badge: '/icon-96.png',
      tag: 'prayer-notification'
    });
  } catch (e) {
    console.warn('Native notification failed:', e);
  }
}
