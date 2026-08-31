import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, X, ExternalLink, Mail, Cookie, FileText, Check, Lock } from 'lucide-react';
import { useQuran } from '../context/QuranContext';

interface PrivacyPolicyModalProps {
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ onClose }) => {
  const { showToast } = useQuran();
  const [copied, setCopied] = React.useState(false);
  const supportEmail = 'M.Elsayed1111111@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(supportEmail);
    setCopied(true);
    showToast('تم نسخ البريد الإلكتروني بنجاح ✓');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#042118] border-2 border-[#d4af37] rounded-3xl shadow-2xl overflow-hidden text-[#f5f2ed]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#d4af37]/25 bg-[#063321] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#d4af37]">
                  سياسة الخصوصية
                </h3>
                <p className="text-[11px] text-slate-400">
                  تطبيق وموقع "أنوار الوحي" للقرآن الكريم
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/privacy.html"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1 text-xs text-[#d4af37] hover:underline bg-[#042118] px-2.5 py-1.5 rounded-xl border border-[#d4af37]/30"
                title="فتح سياسة الخصوصية في صفحة مستقلة"
              >
                <span>فتح صفحة مستقلة</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#042118] border border-[#d4af37]/30 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm leading-relaxed">
            {/* Intro */}
            <div className="p-4 rounded-2xl bg-[#063321] border border-[#d4af37]/30 text-[#f3e5ab] font-semibold flex items-center gap-3">
              <Lock className="w-5 h-5 text-[#d4af37] flex-shrink-0" />
              <span>نحن في موقع "أنوار الوحي" نحترم خصوصية الزوار ونلتزم بحماية بياناتهم.</span>
            </div>

            {/* Cookies */}
            <div className="p-4 rounded-2xl bg-[#063321]/50 border border-[#d4af37]/20 space-y-2">
              <h4 className="font-bold text-[#d4af37] flex items-center gap-2 text-sm">
                <Cookie className="w-4 h-4 text-[#d4af37]" />
                <span>استخدام ملفات تعريف الارتباط (Cookies)</span>
              </h4>
              <p className="text-slate-300">
                يستخدم هذا الموقع ملفات تعريف الارتباط لتخصيص وتحسين تجربة المستخدم. قد تستخدم Google وشركاؤها ملفات تعريف الارتباط لعرض إعلانات بناءً على زياراتك السابقة لهذا الموقع أو لمواقع أخرى.
              </p>
            </div>

            {/* Google AdSense */}
            <div className="p-4 rounded-2xl bg-[#063321]/50 border border-[#d4af37]/20 space-y-2">
              <h4 className="font-bold text-[#d4af37] flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-[#d4af37]" />
                <span>إعلانات Google AdSense</span>
              </h4>
              <p className="text-slate-300">
                يعرض هذا الموقع إعلانات مقدمة من Google AdSense. قد تستخدم Google وشركاؤها تقنيات مثل ملفات تعريف الارتباط لتقديم إعلانات مخصصة للمستخدمين.
              </p>
              <p className="text-slate-300 pt-1">
                يمكنك إدارة إعدادات الإعلانات أو إيقاف الإعلانات المخصصة من خلال{' '}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 underline font-bold inline-flex items-center gap-1"
                >
                  إعدادات إعلانات Google
                  <ExternalLink className="w-3 h-3 inline" />
                </a>.
              </p>
            </div>

            {/* Data Collection */}
            <div className="p-4 rounded-2xl bg-[#063321]/50 border border-[#d4af37]/20 space-y-2">
              <h4 className="font-bold text-[#d4af37] flex items-center gap-2 text-sm">
                <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                <span>جمع البيانات</span>
              </h4>
              <p className="text-slate-300">
                لا نقوم بجمع أي بيانات شخصية مثل الاسم أو البريد الإلكتروني إلا إذا قام المستخدم بإدخالها طوعًا (مثلاً عبر نموذج تواصل).
              </p>
            </div>

            {/* Contact */}
            <div className="p-4 rounded-2xl bg-[#063321]/70 border border-[#d4af37]/40 space-y-3">
              <h4 className="font-bold text-[#d4af37] flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-[#d4af37]" />
                <span>التواصل معنا</span>
              </h4>
              <p className="text-slate-300">
                إذا كان لديك أي استفسار بخصوص سياسة الخصوصية، يمكنك التواصل معنا عبر البريد الإلكتروني:
              </p>

              <div className="p-3 rounded-xl bg-[#031912] border border-[#d4af37]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="font-mono text-xs sm:text-sm text-[#d4af37] font-bold select-all" dir="ltr">
                  {supportEmail}
                </span>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCopyEmail}
                    className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-[#063321] hover:bg-[#084d32] border border-[#d4af37]/30 text-[11px] text-[#d4af37] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                    <span>{copied ? 'تم النسخ' : 'نسخ البريد'}</span>
                  </button>

                  <a
                    href={`mailto:${supportEmail}?subject=استفسار بخصوص سياسة الخصوصية - تطبيق أنوار الوحي`}
                    className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-[#d4af37] hover:bg-[#c19b2e] text-[#042118] text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>مراسلة الآن</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Policy Updates */}
            <div className="p-4 rounded-2xl bg-[#063321]/50 border border-[#d4af37]/20 space-y-2">
              <h4 className="font-bold text-[#d4af37] text-sm">
                تحديثات السياسة
              </h4>
              <p className="text-slate-300">
                قد نقوم بتحديث هذه السياسة من وقت لآخر. سيتم نشر أي تغييرات على هذه الصفحة.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3.5 sm:p-4 border-t border-[#d4af37]/20 bg-[#063321] flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              جميع الحقوق محفوظة © أنوار الوحي
            </span>

            <div className="flex items-center gap-2">
              <a
                href="/privacy.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#d4af37] underline font-bold px-3 py-1"
              >
                رابط السياسة المباشر (URL)
              </a>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl bg-[#d4af37] hover:bg-[#c19b2e] text-[#042118] font-bold text-xs cursor-pointer shadow-md"
              >
                إغلاق
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
