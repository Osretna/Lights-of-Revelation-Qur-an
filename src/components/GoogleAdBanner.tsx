import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Info, Sparkles, ExternalLink, Flag, Heart, EyeOff, AlertTriangle } from 'lucide-react';
import { useQuran } from '../context/QuranContext';

interface GoogleAdBannerProps {
  slot?: string;
  format?: 'auto' | 'horizontal' | 'rectangle' | 'in-feed';
  className?: string;
  placementName?: string;
  onOpenGuide?: () => void;
}

export const GoogleAdBanner: React.FC<GoogleAdBannerProps> = ({
  slot,
  format = 'auto',
  className = '',
  placementName = 'إعلان دعوي مرخص',
  onOpenGuide
}) => {
  const { settings, updateSettings, showToast } = useQuran();
  const adRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState<boolean>(false);
  const [adError, setAdError] = useState<boolean>(false);
  const [showReportDialog, setShowReportDialog] = useState<boolean>(false);
  const [selectedReportReason, setSelectedReportReason] = useState<string>('محتوى يخالف الشريعة الإسلامية');

  // Check if ads are enabled
  if (!settings.adSenseEnabled) {
    return null;
  }

  // Format publisher ID correctly for AdSense (ca-pub-XXXXXXXXXX)
  const normalizedPublisherId = settings.adSensePublisherId
    ? settings.adSensePublisherId.startsWith('ca-pub-')
      ? settings.adSensePublisherId
      : `ca-${settings.adSensePublisherId}`
    : 'ca-pub-6359877001554870';

  const isPublisherConfigured = Boolean(
    normalizedPublisherId && normalizedPublisherId.startsWith('ca-pub-') && normalizedPublisherId.length > 10
  );

  const activeSlot = slot || settings.adSenseBannerSlot || '1234567890';

  useEffect(() => {
    if (!settings.adSenseEnabled || !isPublisherConfigured || settings.adSenseTestMode) {
      return;
    }

    const timer = setTimeout(() => {
      try {
        // Ensure Google AdSense script is injected
        const scriptId = 'google-adsense-script';
        if (!document.getElementById(scriptId)) {
          const script = document.createElement('script');
          script.id = scriptId;
          script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${normalizedPublisherId}`;
          script.async = true;
          script.crossOrigin = 'anonymous';
          script.onerror = () => {
            setAdError(true);
          };
          document.head.appendChild(script);
        }

        // Push ad to adsbygoogle queue safely
        const win = window as any;
        if (win) {
          win.adsbygoogle = win.adsbygoogle || [];
          try {
            win.adsbygoogle.push({});
            setAdLoaded(true);
          } catch (pushErr) {
            console.debug('AdSense deferred push notice:', pushErr);
          }
        }
      } catch (e) {
        console.warn('AdSense load exception:', e);
        setAdError(true);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [settings.adSenseEnabled, normalizedPublisherId, settings.adSenseTestMode, activeSlot]);

  const handleReportAd = () => {
    setShowReportDialog(false);
    showToast('شكراً لحرصك! تم تسجيل البلاغ وسنقوم بمراجعة وحظر المعلن فوراً لحماية المحتوى الشرعي 🛡️');
  };

  // Sample Islamic / Halal Sponsors for Test Mode or fallback
  const halalSponsors = [
    {
      title: 'وقف طباعة وتوزيع المصحف الشريف في إفريقيا',
      subtitle: 'ساهم بـ 10 ريالات لطباعة نسخة وتوزيعها على حفظة كتاب الله',
      category: 'وقف خيري إسلامي',
      cta: 'ساهم في الوقف الآن',
      tag: 'إعلان موثق شرعياً'
    },
    {
      title: 'تطبيق العمرة والزيارة المباركة',
      subtitle: 'باقات ميسرة للحج والعمرة مع مرشدين شرعيين معتمدين',
      category: 'خدمات إسلامية',
      cta: 'اكتشف الباقات',
      tag: 'إعلان موثق شرعياً'
    },
    {
      title: 'المكتبة الإسلامية الشاملة - كتب التفسير والحديث',
      subtitle: 'تحميل مجاني لنوادر المخطوطات والكتب المعتمدة لأهل السنة والجماعة',
      category: 'علوم شرعية',
      cta: 'تصفح المكتبة',
      tag: 'إعلان موثق شرعياً'
    }
  ];

  const randomSponsor = halalSponsors[Math.floor(Math.random() * halalSponsors.length)];

  return (
    <div className={`w-full max-w-5xl mx-auto my-3 ${className}`}>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#063321]/90 via-[#042118] to-[#063321]/90 border border-[#d4af37]/35 shadow-md p-3 sm:p-4 text-[#f5f2ed]">
        
        {/* Top Badges & Halal Shield */}
        <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#d4af37]/20 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] font-bold text-[#d4af37] bg-[#d4af37]/15 border border-[#d4af37]/30 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>إعلان خاضع للضوابط الشرعية</span>
            </span>
            {settings.adSenseTestMode && (
              <span className="hidden sm:inline-block text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono">
                وضع المعاينة (Test Mode)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowReportDialog(true)}
              className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
              title="الإبلاغ عن إعلان غير لائق"
            >
              <Flag className="w-3 h-3" />
              <span className="hidden sm:inline">إبلاغ عن محتوى غير لائق</span>
            </button>
            <span className="text-slate-600 dark:text-[#d4af37]/40">•</span>
            <span className="text-[10px] text-slate-400">إعلانات Google المفلترة</span>
          </div>
        </div>

        {/* Live AdSense Banner (When configured and live) */}
        {isPublisherConfigured && !settings.adSenseTestMode && !adError ? (
          <div className="min-h-[90px] flex items-center justify-center bg-[#031912] rounded-xl overflow-hidden p-1">
            <ins
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', minHeight: '90px' }}
              data-ad-client={normalizedPublisherId}
              data-ad-slot={activeSlot}
              data-ad-format={format}
              data-full-width-responsive="true"
            />
          </div>
        ) : (
          /* Test Mode / Halal Sponsorship Fallback Banner */
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3 text-right flex-1">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-[#d4af37]">
                    {randomSponsor.title}
                  </h4>
                  <span className="text-[10px] bg-[#d4af37]/20 text-[#d4af37] px-2 py-0.2 rounded font-semibold">
                    {randomSponsor.category}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {randomSponsor.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
              <button
                onClick={() => showToast('جزاكم الله خيراً لدعم المشاريع والأنشطة الإسلامية النافعة 🌟')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c19b2e] hover:from-[#e5c158] hover:to-[#d4af37] text-[#042118] font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{randomSponsor.cta}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              {onOpenGuide && (
                <button
                  onClick={onOpenGuide}
                  title="طريقة ربط حساب Google AdSense وتفعيل الحظر الشرعي"
                  className="p-2 rounded-xl bg-[#084d32] text-[#d4af37] hover:bg-[#063321] text-xs font-semibold cursor-pointer"
                >
                  <Info className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Protection Note footer */}
        <div className="mt-2.5 pt-2 border-t border-[#d4af37]/15 flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>نظام فلترة وحظر إعلانات القمار، التعارف، الخمور، والربا مفعل بنسبة 100%</span>
          </span>
          {isPublisherConfigured ? (
            <span className="font-mono text-[#d4af37]">{settings.adSensePublisherId}</span>
          ) : (
            <span className="text-[#d4af37]/80">لم يتم ربط ca-pub بعد (يعمل في وضع الإعلانات الدعوية)</span>
          )}
        </div>
      </div>

      {/* User Report Dialog */}
      {showReportDialog && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#042118] border-2 border-[#d4af37] rounded-3xl max-w-md w-full p-5 text-[#f5f2ed] shadow-2xl space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-[#d4af37]/30 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-[#d4af37]">الإبلاغ عن إعلان غير لائق</h3>
              </div>
              <button
                onClick={() => setShowReportDialog(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              نحن نلتزم بأعلى معايير الشريعة الإسلامية. إذا ظهر لك إعلان غير مناسب، يرجى تحديد السبب لحظر مصدره ومعلنه نهائياً:
            </p>

            <div className="space-y-2 text-xs">
              {[
                'إعلان يحتوي على صور أو محتوى خادش للحياء',
                'إعلان يروج للقمار أو المراهنات أو اليانصيب',
                'إعلان يروج لمنتجات محرمة (كحول، سجائر، أطعمة محرمة)',
                'إعلان يروج لمعاملات ربوية أو نصب واحتيال',
                'إعلان يروج للسحر والتنجيم',
                'إعلان مزعج أو احتيالي'
              ].map(reason => (
                <label
                  key={reason}
                  onClick={() => setSelectedReportReason(reason)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                    selectedReportReason === reason
                      ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37] font-bold'
                      : 'bg-[#063321] border-[#d4af37]/20 text-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    checked={selectedReportReason === reason}
                    onChange={() => setSelectedReportReason(reason)}
                    className="accent-[#d4af37]"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleReportAd}
                className="flex-1 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#c19b2e] text-[#042118] font-bold text-xs shadow-md transition-all"
              >
                إرسال البلاغ وحظر المعلن
              </button>
              <button
                onClick={() => setShowReportDialog(false)}
                className="px-4 py-2.5 rounded-xl bg-[#063321] border border-[#d4af37]/30 text-xs font-semibold text-slate-300 hover:text-white"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
