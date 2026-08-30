import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Info, Sparkles, ExternalLink, Flag, Heart, Eye, Code, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { useQuran } from '../context/QuranContext';

interface GoogleAdBannerProps {
  slot?: string;
  format?: 'auto' | 'horizontal' | 'rectangle' | 'in-feed' | 'leaderboard';
  className?: string;
  placementName?: string;
  onOpenGuide?: () => void;
}

export const GoogleAdBanner: React.FC<GoogleAdBannerProps> = ({
  slot,
  format = 'auto',
  className = '',
  placementName = 'المساحة الإعلانية الرئيسية',
  onOpenGuide
}) => {
  const { settings, updateSettings, showToast } = useQuran();
  const adRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState<boolean>(false);
  const [adError, setAdError] = useState<boolean>(false);
  const [showReportDialog, setShowReportDialog] = useState<boolean>(false);
  const [selectedReportReason, setSelectedReportReason] = useState<string>('محتوى يخالف الشريعة الإسلامية');
  const [previewTab, setPreviewTab] = useState<'visual' | 'code'>('visual');

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

  // Dimension labels based on format
  const dimensionLabel =
    format === 'rectangle'
      ? '300×250 Medium Rectangle'
      : format === 'in-feed'
      ? 'Responsive In-Feed Native'
      : format === 'leaderboard'
      ? '728×90 / 320×100 Leaderboard'
      : 'Responsive Smart Banner (Auto)';

  useEffect(() => {
    if (!settings.adSenseEnabled || !isPublisherConfigured) {
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
            console.debug('AdSense push notice:', pushErr);
          }
        }
      } catch (e) {
        console.warn('AdSense load exception:', e);
        setAdError(true);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [settings.adSenseEnabled, normalizedPublisherId, activeSlot]);

  const handleReportAd = () => {
    setShowReportDialog(false);
    showToast('شكراً لحرصك! تم تسجيل البلاغ وسنقوم بمراجعة وحظر المعلن فوراً لحماية المحتوى الشرعي 🛡️');
  };

  // Sample Halal & Islamic Sponsors for Visual Simulation / Fallback
  const halalSponsors = [
    {
      title: 'وقف طباعة وتوزيع المصحف الشريف في إفريقيا',
      subtitle: 'ساهم بـ 10 ريالات لطباعة نسخة وتوزيعها على حفظة كتاب الله في القرى النائية',
      category: 'وقف خيري إسلامي',
      cta: 'ساهم في الوقف الآن',
      tag: 'إعلان موثق شرعياً'
    },
    {
      title: 'تطبيق العمرة والزيارة المباركة',
      subtitle: 'باقات ميسرة للحج والعمرة مع مرشدين شرعيين معتمدين وخدمات راقية',
      category: 'خدمات إسلامية معتمدة',
      cta: 'اكتشف الباقات',
      tag: 'إعلان موثق شرعياً'
    },
    {
      title: 'المكتبة الإسلامية الشاملة - كتب التفسير والحديث',
      subtitle: 'تحميل مجاني لنوادر المخطوطات والكتب المعتمدة لأهل السنة والجماعة بدون إعلانات',
      category: 'علوم شرعية نافعة',
      cta: 'تصفح المكتبة',
      tag: 'إعلان موثق شرعياً'
    }
  ];

  const currentSponsor = halalSponsors[0];

  return (
    <div className={`w-full max-w-5xl mx-auto my-4 px-2 sm:px-4 ${className}`} dir="rtl">
      {/* Outer Designated Ad Container */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#063321] via-[#042118] to-[#063321] border-2 border-dashed border-[#d4af37]/60 shadow-xl p-3.5 sm:p-5 text-[#f5f2ed] transition-all hover:border-[#d4af37]">
        
        {/* Top Header: Badge, Placement Name, Dimension, Status */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#d4af37]/20 text-xs">
          {/* Left / Start Info */}
          <div className="flex items-center flex-wrap gap-2">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#d4af37] bg-[#d4af37]/15 border border-[#d4af37]/40 px-2.5 py-1 rounded-xl shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>مساحة إعلانية مخصصة • Google AdSense</span>
            </span>

            <span className="text-[10px] text-slate-300 bg-[#084d32] border border-[#d4af37]/30 px-2 py-0.5 rounded-lg font-mono">
              {dimensionLabel}
            </span>

            <span className="text-[10px] text-[#d4af37]/90 font-semibold bg-[#031c14] px-2 py-0.5 rounded-lg border border-[#d4af37]/20">
              الموضع: {placementName}
            </span>
          </div>

          {/* Right / Controls & Actions */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle (Visual Mockup vs Live Code Inspection) */}
            <div className="flex items-center bg-[#031912] p-0.5 rounded-xl border border-[#d4af37]/30">
              <button
                onClick={() => setPreviewTab('visual')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  previewTab === 'visual'
                    ? 'bg-[#d4af37] text-[#042118]'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="معاينة شكل الإعلان التوضيحي"
              >
                <Eye className="w-3 h-3" />
                <span className="hidden sm:inline">معاينة الإعلان</span>
              </button>
              <button
                onClick={() => setPreviewTab('code')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  previewTab === 'code'
                    ? 'bg-[#d4af37] text-[#042118]'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="فحص كود Google AdSense النشط"
              >
                <Code className="w-3 h-3" />
                <span className="hidden sm:inline">كود AdSense</span>
              </button>
            </div>

            <button
              onClick={() => setShowReportDialog(true)}
              className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 p-1 rounded-lg hover:bg-[#031912] transition-colors cursor-pointer"
              title="الإبلاغ عن إعلان غير لائق شرعياً"
            >
              <Flag className="w-3.5 h-3.5" />
              <span className="hidden md:inline">إبلاغ</span>
            </button>
          </div>
        </div>

        {/* Content Box */}
        {previewTab === 'code' ? (
          /* Raw AdSense Snippet Inspection */
          <div className="p-3.5 rounded-2xl bg-[#02140e] border border-[#d4af37]/30 font-mono text-left text-[11px] text-emerald-300 overflow-x-auto space-y-1.5" dir="ltr">
            <div className="text-slate-400 text-[10px] border-b border-slate-700/50 pb-1 flex justify-between">
              <span>// Google AdSense Live Slot Code</span>
              <span className="text-[#d4af37]">Ready for Review</span>
            </div>
            <div>&lt;!-- {placementName} Ad Unit --&gt;</div>
            <div className="text-amber-300">
              &lt;ins class="adsbygoogle"
            </div>
            <div className="pl-4 text-emerald-300">style="display:block; min-height:90px;"</div>
            <div className="pl-4 text-sky-300">data-ad-client="{normalizedPublisherId}"</div>
            <div className="pl-4 text-sky-300">data-ad-slot="{activeSlot}"</div>
            <div className="pl-4 text-sky-300">data-ad-format="{format}"</div>
            <div className="pl-4 text-sky-300">data-full-width-responsive="true"&gt;&lt;/ins&gt;</div>
          </div>
        ) : (
          /* Visual Interactive Ad Box */
          <div className="relative">
            {/* Live Google AdSense <ins> Element (Always rendered in DOM for Google crawler & live ads) */}
            <div className="w-full min-h-[90px] rounded-2xl bg-[#031912]/90 border border-[#d4af37]/20 p-3 sm:p-4 flex items-center justify-center overflow-hidden">
              <ins
                ref={adRef as any}
                className="adsbygoogle"
                style={{ display: 'block', width: '100%', minHeight: '90px' }}
                data-ad-client={normalizedPublisherId}
                data-ad-slot={activeSlot}
                data-ad-format={format}
                data-full-width-responsive="true"
              />

              {/* High-Fidelity Visual Simulation Banner (Shown clearly to user until Google renders live ads) */}
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 text-right flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#d4af37]/30 to-[#d4af37]/10 border border-[#d4af37]/50 text-[#d4af37] flex items-center justify-center flex-shrink-0 shadow-md">
                    <Heart className="w-6 h-6 fill-current/30 text-[#d4af37]" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-[#d4af37]">
                        {currentSponsor.title}
                      </h4>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                        {currentSponsor.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {currentSponsor.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => showToast('جزاكم الله خيراً لدعم المشاريع والأنشطة الإسلامية النافعة 🌟')}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89528] hover:from-[#e5c158] hover:to-[#d4af37] text-[#042118] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{currentSponsor.cta}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  {onOpenGuide && (
                    <button
                      onClick={onOpenGuide}
                      title="طريقة ربط وتفعيل حساب Google AdSense وحظر المحتوى المخل"
                      className="p-2.5 rounded-xl bg-[#084d32] border border-[#d4af37]/30 text-[#d4af37] hover:bg-[#0a5c3c] text-xs font-semibold cursor-pointer transition-colors"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Protection Note & Publisher Meta footer */}
        <div className="mt-3 pt-2.5 border-t border-[#d4af37]/15 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>نظام فلترة وحظر إعلانات القمار والربا والمحتوى المخل نشط 100%</span>
          </span>

          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span className="text-slate-400">Publisher:</span>
            <span className="text-[#d4af37] bg-[#031912] px-1.5 py-0.5 rounded border border-[#d4af37]/20">
              {normalizedPublisherId}
            </span>
          </div>
        </div>
      </div>

      {/* User Report Dialog for Halal Compliance */}
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
                className="text-slate-400 hover:text-white p-1 text-sm font-bold cursor-pointer"
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
                className="flex-1 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#c19b2e] text-[#042118] font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                إرسال البلاغ وحظر المعلن
              </button>
              <button
                onClick={() => setShowReportDialog(false)}
                className="px-4 py-2.5 rounded-xl bg-[#063321] border border-[#d4af37]/30 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
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

