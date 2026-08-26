import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { useQuran } from '../context/QuranContext';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallBanner: React.FC = () => {
  const { showToast } = useQuran();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Check if already running in standalone mode (installed as PWA on Android/iOS)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Check if device is iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Listen for beforeinstallprompt event on Android/Chromium
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Check if user previously dismissed banner
      const dismissed = localStorage.getItem('anwar_pwa_dismissed');
      if (!dismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
      showToast('تهانينا! تم تثبيت تطبيق أنوار الوحي على جهازك بنجاح 📱✨');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [showToast]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      if (isIOS) {
        showToast('لتثبيت التطبيق على iPhone/iPad: اضغط على زر المشاركة ⎋ ثم "إضافة إلى الشاشة الرئيسية" 📲');
      } else {
        showToast('لتثبيت التطبيق: افتح قائمة خيارات المتصفح (⋮) واختر "تثبيت التطبيق" أو "إضافة للشاشة الرئيسية"');
      }
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        showToast('جاري تثبيت تطبيق أنوار الوحي على هاتفك...');
      }
      setDeferredPrompt(null);
      setShowBanner(false);
    } catch (err) {
      console.warn('Install prompt error:', err);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('anwar_pwa_dismissed', 'true');
  };

  if (isInstalled || !showBanner) return null;

  return (
    <aside
      aria-label="تثبيت تطبيق أنوار الوحي"
      className="fixed bottom-20 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border border-amber-400/50 rounded-2xl p-4 text-amber-50 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 flex-shrink-0">
          <Smartphone className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs sm:text-sm font-bold text-amber-200">
              تثبيت تطبيق أنوار الوحي على هاتفك
            </h4>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold">
              مجاني
            </span>
          </div>
          <p className="text-[11px] text-amber-100/80 mt-1 leading-snug">
            {isIOS
              ? 'احصل على تجربة سريعة تعمل بدون إنترنت مع إمكانية الفتح المباشر من شاشتك الرئيسية.'
              : 'ثبّت التطبيق الآن كبرنامج أندرويد ليعمل بكفاءة عالية وبدون إنترنت بلمسة واحدة.'}
          </p>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تثبيت التطبيق الآن</span>
            </button>
            <button
              onClick={handleDismiss}
              className="px-2.5 py-1.5 rounded-xl text-amber-200/70 hover:text-amber-200 text-xs transition-colors"
            >
              لاحقاً
            </button>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="p-1 text-amber-300/60 hover:text-amber-300 transition-colors"
          title="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
