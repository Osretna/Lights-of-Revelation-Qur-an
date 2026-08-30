import React, { useState } from 'react';
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
  Info,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { useQuran } from '../context/QuranContext';
import { HalalAdSenseGuideModal } from './HalalAdSenseGuideModal';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { settings, updateSettings, showToast } = useQuran();
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-[#042118] border-2 border-[#d4af37]/40 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-[#d4af37]/25 flex justify-between items-center bg-gradient-to-r from-[#063321] to-[#042118] text-[#f5f2ed]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 flex items-center justify-center font-bold">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-[#d4af37]">
                إعدادات تطبيق أنوار الوحي
              </h3>
              <p className="text-xs text-slate-300">
                تخصيص المظهر، التنبيهات، الخطوط، وإعلانات Google الحلال
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

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Section 1: Themes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-[#d4af37] flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-[#d4af37]" />
              <span>مظهر وألوان التطبيق:</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'emerald', label: 'الزمردي الفاخر', bg: 'bg-[#042118] text-[#d4af37]' },
                { id: 'dark', label: 'الليلي الهادئ', bg: 'bg-slate-900 text-slate-100' },
                { id: 'sepia', label: 'السيبيا المريح', bg: 'bg-[#f4ecd8] text-[#433422]' },
                { id: 'oled', label: 'الأسود التام (OLED)', bg: 'bg-black text-white' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => updateSettings({ theme: t.id as any })}
                  className={`py-3 px-3 rounded-2xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${t.bg} ${
                    settings.theme === t.id ? 'ring-2 ring-[#d4af37] border-[#d4af37] shadow-md' : 'border-slate-200 dark:border-[#d4af37]/20'
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
            <label className="text-xs font-bold text-slate-700 dark:text-[#d4af37] flex items-center gap-1.5">
              <Type className="w-4 h-4 text-[#d4af37]" />
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
                  className={`py-2.5 px-3 rounded-2xl text-xs font-medium border transition-all cursor-pointer ${
                    settings.fontFamily === f.id
                      ? 'bg-[#d4af37] text-[#042118] font-bold border-[#d4af37] shadow-xs'
                      : 'bg-slate-50 dark:bg-[#063321] text-slate-700 dark:text-[#f5f2ed] border-slate-200 dark:border-[#d4af37]/20'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Slider */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#063321]/40 border border-slate-200 dark:border-[#d4af37]/20 space-y-2">
              <div className="flex justify-between text-xs text-slate-700 dark:text-[#d4af37]">
                <span>حجم خط الآيات:</span>
                <span className="font-bold font-mono">{settings.fontSize}px</span>
              </div>
              <input
                type="range"
                min={18}
                max={44}
                value={settings.fontSize}
                onChange={e => updateSettings({ fontSize: Number(e.target.value) })}
                className="w-full accent-[#d4af37] cursor-pointer"
              />
              <p
                className="text-center py-2 text-slate-800 dark:text-[#f5f2ed] border-t border-slate-200 dark:border-[#d4af37]/20"
                style={{ fontFamily: settings.fontFamily, fontSize: `${settings.fontSize}px` }}
              >
                ﴿إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ﴾
              </p>
            </div>
          </div>

          {/* Section 3: Adhan Alerts */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-[#d4af37] flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-[#d4af37]" />
              <span>تنبيهات الأذان والصلاة:</span>
            </label>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#063321]/40 border border-slate-200 dark:border-[#d4af37]/20 flex items-center justify-between">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-[#f5f2ed]">
                  تفعيل تنبيهات الأذان عند حلول وقت الصلاة
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-[#f5f2ed]/60">
                  إرسال إشعار بصوت الأذان المعتمد لمواقيت الصلوات الخمس
                </p>
              </div>

              <input
                type="checkbox"
                checked={settings.adhanNotification}
                onChange={e => {
                  updateSettings({ adhanNotification: e.target.checked });
                  showToast(e.target.checked ? 'تم تفعيل تنبيهات الأذان' : 'تم إيقاف تنبيهات الأذان');
                }}
                className="w-5 h-5 accent-[#d4af37] cursor-pointer"
              />
            </div>
          </div>

          {/* Section 4: Google AdSense & Halal Ads Toggle */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#063321]/40 border border-slate-200 dark:border-[#d4af37]/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-[#d4af37]">
                    إعلانات Google AdSense المتوافقة مع الشريعة
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-[#f5f2ed]/60">
                    فلترة وحظر إعلانات القمار، التعارف، الخمور، والربا بالكامل
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={settings.adSenseEnabled}
                onChange={e => {
                  updateSettings({ adSenseEnabled: e.target.checked });
                  showToast(e.target.checked ? 'تم تفعيل إعلانات Google المفلترة' : 'تم إيقاف الإعلانات');
                }}
                className="w-5 h-5 accent-[#d4af37] cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-[#d4af37]/20 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-300">
                حالة الفلترة الشرعية: <b className="text-emerald-500 dark:text-emerald-400">نشطة (حظر تام للمحرمات)</b>
              </span>
              <button
                onClick={() => setShowGuideModal(true)}
                className="text-xs font-bold text-[#d4af37] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>دليل التفعيل في Google</span>
              </button>
            </div>
          </div>

          {/* Section 5: Respectful Sponsorship Toggle */}
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-[#063321]/30 border border-amber-300/80 dark:border-[#d4af37]/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-amber-600 dark:text-[#d4af37] flex-shrink-0" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-[#f5f2ed]">
                  إظهار بطاقات الرعاية الوقفية الهادفة
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-[#f5f2ed]/60">
                  مساهمات غير مزعجة تدعم استمرار وتطوير التطبيق وخدمة القرآن
                </p>
              </div>
            </div>

            <input
              type="checkbox"
              checked={settings.showSponsorship}
              onChange={e => updateSettings({ showSponsorship: e.target.checked })}
              className="w-5 h-5 accent-[#d4af37] cursor-pointer"
            />
          </div>

          {/* Section 6: About Anwar Al-Wahy */}
          <div className="p-4 rounded-2xl bg-[#063321] text-[#f5f2ed] border border-[#d4af37]/30 text-center space-y-2">
            <h4 className="font-serif text-base font-bold text-[#d4af37]">
              تطبيق أنوار الوحي للقرآن الكريم
            </h4>
            <p className="text-xs text-[#f5f2ed]/80 leading-relaxed max-w-md mx-auto">
              تطبيق إسلامي شامل ومجاني لوجه الله تعالى، يجمع بين القراءة، التلاوة العطرة، التفاسير المعتمدة، أوقات الصلاة، واتجاه القبلة.
            </p>
            <p className="text-[11px] text-[#d4af37]/60 font-mono">الإصدار 1.0.0 • جميع الحقوق محفوظة لكل مسلم ومسلمة</p>
          </div>
        </div>
      </motion.div>

      {showGuideModal && <HalalAdSenseGuideModal onClose={() => setShowGuideModal(false)} />}
    </div>
  );
};
