import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Lock, KeyRound, Eye, EyeOff, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useQuran } from '../context/QuranContext';

interface AdminLoginModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onSuccess }) => {
  const { verifyAdminPassword, showToast, setActiveTab } = useQuran();
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const isValid = verifyAdminPassword(password);

    if (isValid) {
      showToast('تم التحقق من هوية المشرف بنجاح! أهلاً بك في لوحة الإدارة 🛡️');
      if (onSuccess) {
        onSuccess();
      } else {
        setActiveTab('admin');
      }
      onClose();
    } else {
      setErrorMessage('كلمة المرور غير صحيحة! يرجى إدخال كلمة مرور المشرف الصحيحة.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-[#042118] border-2 border-[#d4af37] rounded-3xl w-full max-w-md p-6 text-[#f5f2ed] shadow-[0_0_50px_rgba(212,175,55,0.25)] space-y-5 relative overflow-hidden"
      >
        {/* Decorative Background Glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-[#d4af37]/15 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full bg-[#084d32]/40 blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-xl bg-[#063321] text-[#d4af37] hover:text-white hover:bg-[#084d32] border border-[#d4af37]/30 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#d4af37]/20 to-[#d4af37]/10 border-2 border-[#d4af37] text-[#d4af37] flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8 text-[#d4af37]" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#d4af37]">
            منطقة المشرفين والناشر
          </h3>
          <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
            هذه اللوحة مخصصة لإدارة إعلانات Google AdSense وإعدادات التطبيق. يرجى إدخال كلمة المرور للمتابعة.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#d4af37] flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              <span>كلمة مرور المشرف (Admin Password):</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                required
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="أدخل كلمة المرور..."
                className="w-full py-3 pr-4 pl-11 rounded-2xl bg-[#031912] border-2 border-[#d4af37]/40 text-white font-mono text-sm tracking-wider focus:outline-none focus:border-[#d4af37] shadow-inner transition-all"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#d4af37] p-1 cursor-pointer transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-[#063321] text-slate-300 border border-[#d4af37]/30 hover:bg-[#084d32] hover:text-white font-bold text-xs transition-all cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !password.trim()}
              className="flex-[2] py-3 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#c19b2e] hover:from-[#e5c158] hover:to-[#d4af37] text-[#042118] font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>دخول للوحة الإدارة</span>
            </button>
          </div>
        </form>

        {/* Protection Footer Note */}
        <div className="text-center pt-2 border-t border-[#d4af37]/20">
          <p className="text-[11px] text-slate-400">
            🔒 النظام محمي بكلمة مرور مشفرة ومصرحة لإدارة التطبيق
          </p>
        </div>
      </motion.div>
    </div>
  );
};
