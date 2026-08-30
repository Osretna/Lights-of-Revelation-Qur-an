import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Radio,
  Send,
  Eye,
  Headphones,
  DollarSign,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Bell,
  ShieldCheck,
  Ban,
  Copy,
  ExternalLink,
  BookOpen,
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  Layers,
  Settings,
  Lock,
  LogOut,
  KeyRound,
  AlertCircle
} from 'lucide-react';
import { useQuran } from '../context/QuranContext';
import { HalalAdSenseGuideModal } from './HalalAdSenseGuideModal';
import { GoogleAdBanner } from './GoogleAdBanner';
import { AdminLoginModal } from './AdminLoginModal';

export const AdminDashboard: React.FC = () => {
  const {
    settings,
    updateSettings,
    showToast,
    isAdminAuthenticated,
    logoutAdmin,
    setActiveTab
  } = useQuran();

  const [broadcastTitle, setBroadcastTitle] = useState<string>('تنبيه قرآني: صيام يوم الإثنين سنة نبوية');
  const [broadcastBody, setBroadcastBody] = useState<string>('تذكر قراءة وردك اليومي من القرآن الكريم مع تطبيق أنوار الوحي.');
  const [sentCount, setSentCount] = useState<number>(3);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [copiedTxt, setCopiedTxt] = useState<boolean>(false);

  // If not authenticated, render protected gate
  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6" dir="rtl">
        <div className="p-8 rounded-3xl bg-[#042118] border-2 border-[#d4af37] shadow-2xl text-[#f5f2ed] space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37] flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          
          <div className="space-y-1">
            <h2 className="font-serif text-xl font-bold text-[#d4af37]">
              لوحة تحكم الإدارة محمية
            </h2>
            <p className="text-xs text-slate-300">
              يجب إدخال كلمة مرور المشرف للوصول إلى إعدادات الإعلانات والإحصائيات
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#c19b2e] text-[#042118] font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
            >
              <KeyRound className="w-4 h-4" />
              <span>إدخال كلمة المرور (admin1234)</span>
            </button>

            <button
              onClick={() => setActiveTab('home')}
              className="w-full py-2.5 rounded-2xl bg-[#063321] text-slate-300 text-xs font-semibold hover:text-white transition-all cursor-pointer"
            >
              العودة للرئيسية
            </button>
          </div>
        </div>

        {showLoginModal && (
          <AdminLoginModal onClose={() => setShowLoginModal(false)} />
        )}
      </div>
    );
  }

  const stats = [
    { title: 'إجمالي القراء النشطين اليوم', value: '48,250', change: '+18%', icon: Users },
    { title: 'ساعات الاستماع الصوتية', value: '12,840', change: '+24%', icon: Headphones },
    { title: 'الختمات المنجزة هذا الشهر', value: '1,420', change: '+32%', icon: CheckCircle2 },
    { title: 'طلبات التلاوات بدون إنترنت', value: '89,100', change: '+15%', icon: Radio }
  ];

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setSentCount(prev => prev + 1);
    showToast(`تم إرسال الإشعار لجميع مستخدمي تطبيق أنوار الوحي بنجاح 🚀`);
  };

  const samplePub = settings.adSensePublisherId || 'ca-pub-XXXXXXXXXXXXXXXX';
  const pubOnly = samplePub.replace('ca-', '');
  const adsTxtLine = `google.com, ${pubOnly}, DIRECT, f08c47fec0942fa0`;

  const copyAdsTxt = () => {
    navigator.clipboard.writeText(adsTxtLine);
    setCopiedTxt(true);
    showToast('تم نسخ سطر ads.txt بنجاح 📋');
    setTimeout(() => setCopiedTxt(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 pb-28 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#063321] via-[#084d32] to-[#042118] border-2 border-[#d4af37]/40 rounded-3xl p-6 text-[#f5f2ed] shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-[#d4af37]" />
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#d4af37]">
                لوحة تحكم إدارة تطبيق أنوار الوحي
              </h1>
            </div>
            <p className="text-sm text-slate-200 mt-1">
              متابعة الإحصائيات الحية، إدارة إعلانات Google AdSense الحلال، وضوابط الشريعة الإسلامية.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="bg-[#d4af37] text-[#042118] px-4 py-2 rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#042118]" />
              <span>مشرف مصرح (admin)</span>
            </div>

            <button
              onClick={logoutAdmin}
              title="قفل لوحة الإدارة وتسجيل الخروج"
              className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>قفل اللوحة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              className="p-5 rounded-3xl bg-white dark:bg-[#063321] border border-slate-200 dark:border-[#d4af37]/20 shadow-sm space-y-2"
            >
              <div className="flex justify-between items-center">
                <div className="p-2.5 rounded-xl bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {s.change}
                </span>
              </div>
              <h3 className="text-2xl font-black font-mono text-slate-900 dark:text-[#f5f2ed]">
                {s.value}
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#f5f2ed]/70">{s.title}</p>
            </div>
          );
        })}
      </div>

      {/* GOOGLE ADSENSE & ISLAMIC SHARIA CONTROLS SECTION */}
      <div className="bg-white dark:bg-[#042118] border-2 border-[#d4af37]/50 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#d4af37]/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-serif text-[#d4af37]">
                  مركز إدارة إعلانات Google AdSense والضوابط الشرعية
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  متوافق مع الشريعة الإسلامية 100%
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">
                تفعيل الإعلانات، حظر المحتوى المخل والرهانات، وربط معرفات AdSense
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowGuideModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#d4af37] hover:bg-[#c19b2e] text-[#042118] font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>شرح طريقة التفعيل والحظر في Google AdSense</span>
          </button>
        </div>

        {/* Sharia Filter Shield Status Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#063321] to-[#084d32] border border-[#d4af37]/30 text-[#f5f2ed] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ban className="w-5 h-5 text-rose-400" />
              <h4 className="text-xs sm:text-sm font-bold text-[#d4af37]">
                فلاتر الحظر الشرعي الإلزامي المفعلة في النظام:
              </h4>
            </div>
            <span className="text-[11px] bg-[#d4af37]/20 text-[#d4af37] px-2.5 py-0.5 rounded-full font-bold">
              نشطة ومحمية 🛡️
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
            {[
              '🚫 حظر إعلانات القمار والمراهنات واليانصيب',
              '🚫 حظر إعلانات المحتوى المخل والتعارف',
              '🚫 حظر إعلانات الكحول والمسكرات والتبغ',
              '🚫 حظر إعلانات القروض الربوية والمضاربات',
              '🚫 حظر إعلانات السحر والكهانة والتنجيم',
              '🚫 حظر المنتجات المخالفة للشريعة الإسلامية'
            ].map(f => (
              <div
                key={f}
                className="p-2 rounded-xl bg-black/30 border border-[#d4af37]/20 flex items-center gap-1.5 text-[#f5f2ed]"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="truncate">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AdSense Configuration Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-[#d4af37] flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#d4af37]" />
              <span>إعدادات الاتصال وحساب Google AdSense:</span>
            </h4>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                معرف الناشر في Google AdSense (Publisher ID):
              </label>
              <input
                type="text"
                placeholder="ca-pub-1234567890123456"
                value={settings.adSensePublisherId}
                onChange={e => updateSettings({ adSensePublisherId: e.target.value.trim() })}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-[#d4af37]/30 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-[#d4af37]"
                dir="ltr"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                يمكنك إيجاده في لوحة AdSense ➔ الحساب (Account) ➔ معلومات الحساب.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  معرف وحدة البانر (Banner Slot):
                </label>
                <input
                  type="text"
                  placeholder="1234567890"
                  value={settings.adSenseBannerSlot}
                  onChange={e => updateSettings({ adSenseBannerSlot: e.target.value.trim() })}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-[#d4af37]/30 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-[#d4af37]"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  معرف وحدة التغذية (In-Feed Slot):
                </label>
                <input
                  type="text"
                  placeholder="9876543210"
                  value={settings.adSenseInFeedSlot}
                  onChange={e => updateSettings({ adSenseInFeedSlot: e.target.value.trim() })}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-[#d4af37]/30 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-[#d4af37]"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2.5 pt-2">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-[#063321]/50 border border-slate-200 dark:border-[#d4af37]/20 text-xs cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 dark:text-[#f5f2ed] block">
                    تفعيل إعلانات Google في التطبيق
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    إظهار البانرات الإعلانية المفلترة لدعم استمرار التطبيق
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.adSenseEnabled}
                  onChange={e => {
                    updateSettings({ adSenseEnabled: e.target.checked });
                    showToast(e.target.checked ? 'تم تفعيل إعلانات Google' : 'تم إيقاف الإعلانات');
                  }}
                  className="w-5 h-5 accent-[#d4af37] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-[#063321]/50 border border-slate-200 dark:border-[#d4af37]/20 text-xs cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 dark:text-[#f5f2ed] block">
                    وضع المعاينة والتجربة (Test Mode)
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    عرض إعلانات تجريبية إسلامية دون إرسال طلبات حقيقية لـ Google (لتجنب المخالفات أثناء التطوير)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.adSenseTestMode}
                  onChange={e => updateSettings({ adSenseTestMode: e.target.checked })}
                  className="w-5 h-5 accent-[#d4af37] cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* ads.txt box and live preview */}
          <div className="space-y-4">
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-[#d4af37] flex items-center gap-2">
              <Copy className="w-4 h-4 text-[#d4af37]" />
              <span>ملف التصريح الإعلاني (ads.txt):</span>
            </h4>

            <div className="p-4 rounded-2xl bg-black/60 border border-[#d4af37]/30 text-white space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">الملف جاهز تلقائياً في <code>/ads.txt</code>:</span>
                <button
                  onClick={copyAdsTxt}
                  className="px-3 py-1.5 rounded-xl bg-[#d4af37] text-[#042118] font-bold text-xs flex items-center gap-1.5 hover:bg-[#c19b2e] cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedTxt ? 'تم النسخ!' : 'نسخ السطر'}</span>
                </button>
              </div>

              <pre className="p-3 rounded-xl bg-[#031912] border border-[#d4af37]/20 text-emerald-400 font-mono text-xs overflow-x-auto" dir="ltr">
                {adsTxtLine}
              </pre>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                هذا الملف يتم قراءته تلقائياً بواسطة روبوتات Google AdSense عند فحص نطاق التطبيق للتحقق من أهليتك للعرض.
              </p>
            </div>

            {/* Live Ad Component Sample */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                معاينة حية لشكل الإعلان في واجهة المستخدم:
              </span>
              <GoogleAdBanner format="horizontal" onOpenGuide={() => setShowGuideModal(true)} />
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast Push Notifications Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#063321] border border-slate-200 dark:border-[#d4af37]/20 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#d4af37]" />
            <h3 className="font-bold text-base sm:text-lg text-slate-800 dark:text-[#f5f2ed]">
              إرسال إشعار فوري لجميع المستخدمين
            </h3>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                عنوان الإشعار:
              </label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={e => setBroadcastTitle(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-[#d4af37]/30 text-slate-800 dark:text-white text-xs font-medium focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                نص الرسالة:
              </label>
              <textarea
                rows={3}
                required
                value={broadcastBody}
                onChange={e => setBroadcastBody(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-[#d4af37]/30 text-slate-800 dark:text-white text-xs font-medium focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c19b2e] hover:from-[#e5c158] hover:to-[#d4af37] text-[#042118] font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>إرسال التنبيه الجماعي الآن ({sentCount} تم إرسالها مسبقاً)</span>
            </button>
          </form>
        </div>

        {/* Most Listened Surahs Live List */}
        <div className="bg-white dark:bg-[#063321] border border-slate-200 dark:border-[#d4af37]/20 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#d4af37]" />
            <h3 className="font-bold text-base sm:text-lg text-slate-800 dark:text-[#f5f2ed]">
              السور الأكثر تلاوة واستماعاً
            </h3>
          </div>

          <div className="space-y-2.5">
            {[
              { name: 'الكهف', listens: '124,500 استماع', pct: '94%' },
              { name: 'البقرة', listens: '98,200 استماع', pct: '88%' },
              { name: 'الملك', listens: '76,400 استماع', pct: '79%' },
              { name: 'يس', listens: '65,100 استماع', pct: '70%' },
              { name: 'الرحمن', listens: '58,300 استماع', pct: '62%' }
            ].map(s => (
              <div
                key={s.name}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-[#d4af37]/20 flex items-center justify-between text-xs"
              >
                <span className="font-bold text-slate-800 dark:text-[#f5f2ed]">سورة {s.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 dark:text-slate-400">{s.listens}</span>
                  <span className="font-bold font-mono text-[#042118] bg-[#d4af37] px-2 py-0.5 rounded">
                    {s.pct}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Guide Modal */}
      {showGuideModal && <HalalAdSenseGuideModal onClose={() => setShowGuideModal(false)} />}
    </div>
  );
};
