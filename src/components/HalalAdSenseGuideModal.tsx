import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  ShieldAlert,
  Ban,
  CheckCircle2,
  Copy,
  ExternalLink,
  BookOpen,
  X,
  AlertTriangle,
  Sparkles,
  Settings,
  HelpCircle,
  FileCode,
  Lock
} from 'lucide-react';
import { useQuran } from '../context/QuranContext';

interface HalalAdSenseGuideModalProps {
  onClose: () => void;
}

export const HalalAdSenseGuideModal: React.FC<HalalAdSenseGuideModalProps> = ({ onClose }) => {
  const { settings, updateSettings, showToast } = useQuran();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [copiedAdsTxt, setCopiedAdsTxt] = useState<boolean>(false);

  const samplePublisherId = settings.adSensePublisherId || 'ca-pub-XXXXXXXXXXXXXXXX';
  const pubOnly = samplePublisherId.replace('ca-', '');
  const adsTxtContent = `google.com, ${pubOnly}, DIRECT, f08c47fec0942fa0`;

  const copyAdsTxt = () => {
    navigator.clipboard.writeText(adsTxtContent);
    setCopiedAdsTxt(true);
    showToast('تم نسخ سطر ads.txt إلى الحافظة بنجاح 📋');
    setTimeout(() => setCopiedAdsTxt(false), 3000);
  };

  // Forbidden Categories in Islam to block in Google AdSense
  const blockedCategories = [
    {
      name: 'المراهنات وألعاب القمار واليانصيب (Gambling & Betting)',
      reason: 'محرم شرعاً بنص القرآن الكريم ﴿إِنَّمَا الْخَمْرُ وَالْمَيْسِرُ وَالْأَنصَابُ وَالْأَزْلَامُ رِجْسٌ مِّنْ عَمَلِ الشَّيْطَانِ فَاجْتَنِبُوهُ﴾',
      status: 'حظر إجباري تام'
    },
    {
      name: 'المواد الإباحية والمواقع غير اللائقة ومواقع التعارف (Sensual / Adult / Dating)',
      reason: 'مخالفة لعفة المسلم وغض البصر وأمر الله تعالى',
      status: 'حظر إجباري تام'
    },
    {
      name: 'الخمور والمسكرات والتبغ والدخان (Alcohol & Tobacco)',
      reason: 'محرمة شرعاً لما فيها من إذهاب العقل وإضرار البدن',
      status: 'حظر إجباري تام'
    },
    {
      name: 'القروض الربوية والمعاملات المالية المشبوهة (Payday Loans & Usury)',
      reason: 'محرمة بنص القرآن الكريم ﴿وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا﴾',
      status: 'حظر إجباري تام'
    },
    {
      name: 'السحر والشعوذة والتنجيم وقراءة الطالع (Astrology & Esoteric)',
      reason: 'شرك بالله ومناقض للعقيدة الإسلامية الصافية',
      status: 'حظر إجباري تام'
    },
    {
      name: 'الترويج للأديان الأخرى أو الفرق المنحرفة (Religion & Non-Islamic beliefs)',
      reason: 'حماية لعقيدة المسلمين وعدم الترويج للشبهات في تطبيق قرآني',
      status: 'حظر موصى به'
    },
    {
      name: 'جراحات التجميل وتغيير الخلقة غير الضرورية (Cosmetic Procedures)',
      reason: 'حظر ما فيه تغيير لخلق الله أو تبرج محرم',
      status: 'حظر موصى به'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#042118] border-2 border-[#d4af37] rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto text-[#f5f2ed]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#d4af37]/30 flex justify-between items-center bg-gradient-to-r from-[#063321] to-[#042118]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6 text-[#d4af37]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#d4af37]">
                دليل ضبط إعلانات Google AdSense المتوافقة مع الشريعة الإسلامية
              </h3>
              <p className="text-xs text-slate-300">
                خطوات تفعيل الإعلانات وحظر المحتوى المخل والرهانات والربا في حساب Google
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#084d32] text-[#d4af37] hover:bg-[#063321] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Navigation Bar */}
        <div className="flex bg-[#063321] p-1.5 border-b border-[#d4af37]/20 text-xs font-semibold overflow-x-auto scrollbar-none">
          {[
            { id: 1, label: '1. التسجيل والحصول على الرمز' },
            { id: 2, label: '2. حظر الفئات المحرمة (هام جداً)' },
            { id: 3, label: '3. ضبط ملف ads.txt' },
            { id: 4, label: '4. تفعيل الإعلانات بالتطبيق' }
          ].map(step => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl transition-all cursor-pointer text-center ${
                activeStep === step.id
                  ? 'bg-[#d4af37] text-[#042118] font-bold shadow-md'
                  : 'text-slate-300 hover:text-[#d4af37]'
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">

          {/* STEP 1: Registration */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#063321]/70 border border-[#d4af37]/30 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#d4af37]" />
                  <h4 className="text-sm font-bold text-[#d4af37]">
                    الخطوة الأولى: إنشاء حساب Google AdSense وربط الموقع أو التطبيق
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  لتبدأ في عرض الإعلانات وتحقيق دخل حلال لدعم استمرارية التطبيق وخدمة القرآن الكريم، اتبع التالي:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-[#063321]/40 border border-[#d4af37]/20 flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-[#d4af37] text-[#042118] flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="text-xs space-y-1">
                    <h5 className="font-bold text-[#d4af37]">التسجيل في منصة Google AdSense:</h5>
                    <p className="text-slate-300 leading-relaxed">
                      توجه إلى موقع <a href="https://adsense.google.com" target="_blank" rel="noreferrer" className="text-amber-400 underline font-bold inline-flex items-center gap-1">Google AdSense <ExternalLink className="w-3 h-3 inline" /></a> وقم بتسجيل الدخول بحساب Google الخاص بك.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#063321]/40 border border-[#d4af37]/20 flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-[#d4af37] text-[#042118] flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="text-xs space-y-1">
                    <h5 className="font-bold text-[#d4af37]">إضافة موقعك / رابط التطبيق (Sites):</h5>
                    <p className="text-slate-300 leading-relaxed">
                      من القائمة الجانبية اضغط على <b>المواقع (Sites)</b> ثم اضغط <b>إضافة موقع جديد (Add Site)</b> وأدخل النطاق الخاص بتطبيقك.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#063321]/40 border border-[#d4af37]/20 flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-[#d4af37] text-[#042118] flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="text-xs space-y-1">
                    <h5 className="font-bold text-[#d4af37]">نسخ معرّف الناشر (Publisher ID):</h5>
                    <p className="text-slate-300 leading-relaxed">
                      ستحصل على معرف يبدأ بـ <code className="bg-black/50 text-[#d4af37] px-2 py-0.5 rounded font-mono">ca-pub-XXXXXXXXXXXXXXXX</code>. انسخه وضعه في حقل "معرّف الناشر" في إعدادات التطبيق.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-5 py-2.5 rounded-xl bg-[#d4af37] text-[#042118] font-bold text-xs hover:bg-[#c19b2e] cursor-pointer"
                >
                  الانتقال للخطوة 2: حظر الفئات المحرمة ⬅️
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Halal Blocking Controls */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-400/40 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                  <h4 className="text-sm font-bold text-amber-300">
                    الخطوة الأهم: كيفية تفعيل الحظر الشرعي في Google AdSense
                  </h4>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  تتيح Google AdSense ميزة قوية تسمى <b>عناصر التحكم في الحظر (Blocking Controls)</b>. يجب عليك الدخول وتفعيل الحظر على الفئات التالية لضمان عدم ظهور أي إعلان مخالف للشريعة نهائياً.
                </p>
              </div>

              {/* Step by step inside AdSense */}
              <div className="p-4 rounded-2xl bg-[#063321]/60 border border-[#d4af37]/30 space-y-3">
                <h5 className="text-xs font-bold text-[#d4af37]">مسار الوصول في لوحة تحكم Google AdSense:</h5>
                <div className="p-3 rounded-xl bg-black/40 font-mono text-xs text-amber-300 text-left" dir="ltr">
                  AdSense Dashboard ➔ Brand Safety (الأمان وملاءمة العلامة) ➔ Content ➔ Blocking Controls (عناصر التحكم في الحظر)
                </div>

                <div className="text-xs space-y-2 text-slate-300 leading-relaxed pt-1">
                  <p>1. اضغط على <b>الفئات الإعلانية الحساسة (Sensitive categories)</b>.</p>
                  <p>2. قم بتفعيل زر <b>(محظور / Blocked)</b> أمام كل فئة من الفئات التالية:</p>
                </div>
              </div>

              {/* Forbidden Categories Table */}
              <div className="space-y-2">
                {blockedCategories.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-[#063321]/40 border border-[#d4af37]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                  >
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-2">
                        <Ban className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        <span className="text-xs font-bold text-[#f5f2ed]">{item.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mr-6">{item.reason}</p>
                    </div>
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-1 rounded-full font-bold self-start sm:self-center">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Ad Review Center Tip */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-slate-200 space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-emerald-300">ميزة إضافية: مركز مراجعة الإعلانات (Ad Review Center)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  يمكنك مراجعة جميع الإعلانات الفردية التي تظهر على تطبيقك وحظر أي معلن أو صورة معينة بنقرة واحدة عبر لوحة التحكم.
                </p>
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  onClick={() => setActiveStep(1)}
                  className="px-4 py-2 rounded-xl bg-[#063321] text-slate-300 text-xs hover:text-white"
                >
                  ➡️ الخطوة السابقة
                </button>
                <button
                  onClick={() => setActiveStep(3)}
                  className="px-5 py-2.5 rounded-xl bg-[#d4af37] text-[#042118] font-bold text-xs hover:bg-[#c19b2e] cursor-pointer"
                >
                  الانتقال للخطوة 3: ملف ads.txt ⬅️
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ads.txt */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#063321]/70 border border-[#d4af37]/30 space-y-2">
                <div className="flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-[#d4af37]" />
                  <h4 className="text-sm font-bold text-[#d4af37]">
                    الخطوة الثالثة: إعداد ملف التصريح الإعلاني (ads.txt)
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  تطلب Google AdSense وضع ملف نصي باسم <code>ads.txt</code> في المجلد الرئيسي لموقعك لإثبات ملكيتك وحماية أرباحك من الاحتيال.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-[#d4af37]/30 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-[#d4af37]">محتوى ملف public/ads.txt:</span>
                  <button
                    onClick={copyAdsTxt}
                    className="px-3 py-1.5 rounded-xl bg-[#d4af37] text-[#042118] font-bold text-xs flex items-center gap-1.5 hover:bg-[#c19b2e] cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedAdsTxt ? 'تم النسخ!' : 'نسخ السطر'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-[#031912] border border-[#d4af37]/20 text-emerald-400 font-mono text-xs overflow-x-auto" dir="ltr">
                  {adsTxtContent}
                </pre>
                <p className="text-[11px] text-slate-400">
                  * استبدل <code>{pubOnly}</code> بمعرّف الناشر الفعلي الخاص بك في AdSense إذا لم تقم بإدخاله بعد.
                </p>
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-4 py-2 rounded-xl bg-[#063321] text-slate-300 text-xs hover:text-white"
                >
                  ➡️ الخطوة السابقة
                </button>
                <button
                  onClick={() => setActiveStep(4)}
                  className="px-5 py-2.5 rounded-xl bg-[#d4af37] text-[#042118] font-bold text-xs hover:bg-[#c19b2e] cursor-pointer"
                >
                  الانتقال للخطوة 4: التفعيل في التطبيق ⬅️
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: In-app Activation */}
          {activeStep === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#063321]/70 border border-[#d4af37]/30 space-y-2">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#d4af37]" />
                  <h4 className="text-sm font-bold text-[#d4af37]">
                    الخطوة الرابعة: تفعيل الإعلانات داخل تطبيق أنوار الوحي
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  يمكنك الآن إدخال معرّف الناشر ومعرفات الوحدات الإعلانية مباشرة في الحقول أدناه لحفظها فورياً:
                </p>
              </div>

              {/* Quick Input Form */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#063321]/40 border border-[#d4af37]/20">
                <div>
                  <label className="text-xs font-bold text-[#d4af37] block mb-1">
                    معرف الناشر في Google AdSense (Publisher ID):
                  </label>
                  <input
                    type="text"
                    placeholder="ca-pub-1234567890123456"
                    value={settings.adSensePublisherId}
                    onChange={e => updateSettings({ adSensePublisherId: e.target.value.trim() })}
                    className="w-full py-2.5 px-3 rounded-xl bg-black/40 border border-[#d4af37]/30 text-white font-mono text-xs focus:outline-none focus:border-[#d4af37]"
                    dir="ltr"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      معرف وحدة إعلانات البانر (Banner Slot ID):
                    </label>
                    <input
                      type="text"
                      placeholder="1234567890"
                      value={settings.adSenseBannerSlot}
                      onChange={e => updateSettings({ adSenseBannerSlot: e.target.value.trim() })}
                      className="w-full py-2 px-3 rounded-xl bg-black/40 border border-[#d4af37]/30 text-white font-mono text-xs focus:outline-none focus:border-[#d4af37]"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      معرف إعلانات التغذية (In-Feed Slot ID):
                    </label>
                    <input
                      type="text"
                      placeholder="9876543210"
                      value={settings.adSenseInFeedSlot}
                      onChange={e => updateSettings({ adSenseInFeedSlot: e.target.value.trim() })}
                      className="w-full py-2 px-3 rounded-xl bg-black/40 border border-[#d4af37]/30 text-white font-mono text-xs focus:outline-none focus:border-[#d4af37]"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="pt-2 space-y-2 border-t border-[#d4af37]/20">
                  <label className="flex items-center justify-between p-2 rounded-xl bg-black/20 text-xs cursor-pointer">
                    <span className="font-bold text-[#d4af37]">تفعيل إعلانات Google AdSense بالتطبيق</span>
                    <input
                      type="checkbox"
                      checked={settings.adSenseEnabled}
                      onChange={e => updateSettings({ adSenseEnabled: e.target.checked })}
                      className="w-4 h-4 accent-[#d4af37]"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-xl bg-black/20 text-xs cursor-pointer">
                    <span className="text-slate-200">وضع المعاينة والتجربة (Test Mode)</span>
                    <input
                      type="checkbox"
                      checked={settings.adSenseTestMode}
                      onChange={e => updateSettings({ adSenseTestMode: e.target.checked })}
                      className="w-4 h-4 accent-[#d4af37]"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  onClick={() => setActiveStep(3)}
                  className="px-4 py-2 rounded-xl bg-[#063321] text-slate-300 text-xs hover:text-white"
                >
                  ➡️ الخطوة السابقة
                </button>
                <button
                  onClick={() => {
                    showToast('تم حفظ إعدادات إعلانات Google بنجاح 🛡️✨');
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#d4af37] text-[#042118] font-bold text-xs hover:bg-[#c19b2e] cursor-pointer shadow-md"
                >
                  حفظ الإعدادات وإغلاق الدليل
                </button>
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
};
