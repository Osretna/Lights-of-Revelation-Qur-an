import React from 'react';
import { motion } from 'motion/react';
import {
  Settings,
  Moon,
  Sun,
  Type,
  Volume2,
  Bell,
  Sparkles,
  Heart,
  X,
  Check,
  Info
} from 'lucide-react';
import { useQuran } from '../context/QuranContext';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { settings, updateSettings, showToast } = useQuran();

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-emerald-950 border border-amber-500/40 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-emerald-800 flex justify-between items-center bg-gradient-to-r from-emerald-950 to-emerald-900 text-amber-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-amber-200">
                إعدادات تطبيق أنوار الوحي
              </h3>
              <p className="text-xs text-amber-200/70">
                تخصيص المظهر، التنبيهات، والخطوط
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-emerald-900 text-amber-300 hover:bg-emerald-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Section 1: Themes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-amber-200 flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>مظهر وألوان التطبيق:</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'emerald', label: 'الزمردي الفاخر', bg: 'bg-[#042f2e] text-amber-200' },
                { id: 'dark', label: 'الليلي الهادئ', bg: 'bg-slate-900 text-slate-100' },
                { id: 'sepia', label: 'السيبيا المريح', bg: 'bg-[#f4ecd8] text-[#433422]' },
                { id: 'oled', label: 'الأسود التام (OLED)', bg: 'bg-black text-white' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => updateSettings({ theme: t.id as any })}
                  className={`py-3 px-3 rounded-2xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${t.bg} ${
                    settings.theme === t.id ? 'ring-2 ring-amber-400 border-amber-400 shadow-md' : 'border-slate-200 dark:border-emerald-800'
                  }`}
                >
                  {settings.theme === t.id && <Check className="w-3.5 h-3.5" />}
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Font Family & Size */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-amber-200 flex items-center gap-1.5">
              <Type className="w-4 h-4 text-amber-500" />
              <span>نوع وحجم الخط القرآني:</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'Amiri Quran', label: 'مصحف الأميري' },
                { id: 'Scheherazade New', label: 'شهرزاد العثماني' },
                { id: 'Amiri', label: 'الخط الأميري' },
                { id: 'Cairo', label: 'خط كايرو' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => updateSettings({ fontFamily: f.id as any })}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-medium border transition-all ${
                    settings.fontFamily === f.id
                      ? 'bg-amber-500 text-emerald-950 font-bold border-amber-400 shadow-xs'
                      : 'bg-slate-50 dark:bg-emerald-900/40 text-slate-700 dark:text-amber-100 border-slate-200 dark:border-emerald-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Slider */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-700 dark:text-amber-200">
                <span>حجم خط الآيات:</span>
                <span className="font-bold font-mono">{settings.fontSize}px</span>
              </div>
              <input
                type="range"
                min={18}
                max={44}
                value={settings.fontSize}
                onChange={e => updateSettings({ fontSize: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p
                className="text-center py-2 text-slate-800 dark:text-amber-100 border-t border-slate-200 dark:border-emerald-800/60"
                style={{ fontFamily: settings.fontFamily, fontSize: `${settings.fontSize}px` }}
              >
                ﴿إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ﴾
              </p>
            </div>
          </div>

          {/* Section 3: Adhan Alerts */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-amber-200 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-amber-500" />
              <span>تنبيهات الأذان والصلاة:</span>
            </label>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-amber-100">
                  تفعيل تنبيهات الأذان عند حلول وقت الصلاة
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-amber-300/60">
                  إرسال إشعار بصوت الأذان المعتمد لمواقيت الصلوات الخمس
                </p>
              </div>

              <input
                type="checkbox"
                checked={settings.adhanNotifications}
                onChange={e => {
                  updateSettings({ adhanNotifications: e.target.checked });
                  showToast(e.target.checked ? 'تم تفعيل تنبيهات الأذان' : 'تم إيقاف تنبيهات الأذان');
                }}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Section 4: Respectful Sponsorship Toggle */}
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-emerald-900/30 border border-amber-300/80 dark:border-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-amber-100">
                  إظهار بطاقات الرعاية الوقفية الهادفة
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-amber-300/60">
                  مساهمات غير مزعجة تدعم استمرار وتطوير التطبيق وخدمة القرآن
                </p>
              </div>
            </div>

            <input
              type="checkbox"
              checked={settings.showSponsorship}
              onChange={e => updateSettings({ showSponsorship: e.target.checked })}
              className="w-5 h-5 accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Section 5: About Anwar Al-Wahy */}
          <div className="p-4 rounded-2xl bg-emerald-950 text-amber-50 border border-amber-500/30 text-center space-y-2">
            <h4 className="font-arabic-title text-base font-bold text-amber-300">
              تطبيق أنوار الوحي للقرآن الكريم
            </h4>
            <p className="text-xs text-amber-100/80 leading-relaxed max-w-md mx-auto">
              تطبيق إسلامي شامل ومجاني لوجه الله تعالى، يجمع بين القراءة، التلاوة العطرة، التفاسير المعتمدة، أوقات الصلاة، واتجاه القبلة.
            </p>
            <p className="text-[11px] text-amber-400/60 font-mono">الإصدار 1.0.0 • جميع الحقوق محفوظة لكل مسلم ومسلمة</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
