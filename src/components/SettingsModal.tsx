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
  BookOpen,
  Clock
} from 'lucide-react';
import { useQuran } from '../context/QuranContext';
import { HalalAdSenseGuideModal } from './HalalAdSenseGuideModal';
import { DesignerSignature } from './DesignerSignature';

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

          {/* Section 3: Prayer Times & Calculation Method */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#063321]/40 border border-slate-200 dark:border-[#d4af37]/20">
            <label className="text-xs font-bold text-slate-700 dark:text-[#d4af37] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#d4af37]" />
              <span>التقويم وحساب مواقيت الصلاة:</span>
            </label>

            <div className="space-y-2">
              <select
                value={settings.prayerCalcMethod}
                onChange={e => {
                  updateSettings({ prayerCalcMethod: e.target.value as any });
                  showToast('تم تغيير التقويم الفلكي المعتمد 🕌');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-[#042118] border border-slate-300 dark:border-[#d4af37]/30 text-xs text-slate-800 dark:text-[#f5f2ed] font-bold focus:outline-none focus:border-[#d4af37]"
              >
                <option value="Makkah">جامعة أم القرى - مكة المكرمة (السعودية والخليج)</option>
                <option value="Egypt">الهيئة المصرية العامة للمساحة (مصر وشمال إفريقيا)</option>
                <option value="MWL">رابطة العالم الإسلامي MWL (العراق والشام وأوروبا)</option>
                <option value="Dubai">دائرة الشؤون الإسلامية بدبي (الإمارات)</option>
                <option value="Qatar">وزارة الأوقاف والشؤون الإسلامية (قطر)</option>
                <option value="Kuwait">وزارة الأوقاف والشؤون الإسلامية (الكويت)</option>
                <option value="Turkey">رئاسة الشؤون الدينية التركية (Diyanet)</option>
                <option value="Karachi">جامعة العلوم الإسلامية بكراتشي (باكستان والهند)</option>
                <option value="ISNA">الجمعية الإسلامية لأمريكا الشمالية (ISNA)</option>
                <option value="Algeria">وزارة الشؤون الدينية (الجزائر)</option>
                <option value="Tunisia">وزارة الشؤون الدينية (تونس)</option>
                <option value="France">اتحاد المنظمات الإسلامية (فرنسا)</option>
              </select>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => updateSettings({ juristicMethod: 'shafii' })}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                    settings.juristicMethod === 'shafii'
                      ? 'bg-[#d4af37] text-[#042118] border-[#d4af37]'
                      : 'bg-white dark:bg-[#042118] border-slate-200 dark:border-[#d4af37]/20 text-slate-700 dark:text-[#f5f2ed]'
                  }`}
                >
                  الجمهور (شافعي/مالكي/حنبلي)
                </button>
                <button
                  onClick={() => updateSettings({ juristicMethod: 'hanafi' })}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                    settings.juristicMethod === 'hanafi'
                      ? 'bg-[#d4af37] text-[#042118] border-[#d4af37]'
                      : 'bg-white dark:bg-[#042118] border-slate-200 dark:border-[#d4af37]/20 text-slate-700 dark:text-[#f5f2ed]'
                  }`}
                >
                  المذهب الحنفي
                </button>
              </div>

              {/* Time Format Toggle (12 Hours vs 24 Hours) */}
              <div className="pt-2 border-t border-slate-200 dark:border-[#d4af37]/20">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-[#d4af37] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>نظام عرض الوقت:</span>
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-[#f5f2ed]/60">
                    {settings.timeFormat === '12h' ? 'نظام 12 ساعة (ص / م)' : 'نظام 24 ساعة'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      updateSettings({ timeFormat: '12h' });
                      showToast('تم تفعيل عرض التوقيت بنظام 12 ساعة (ص/م) ⏱️');
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                      settings.timeFormat === '12h'
                        ? 'bg-[#d4af37] text-[#042118] border-[#d4af37] shadow-sm'
                        : 'bg-white dark:bg-[#042118] border-slate-200 dark:border-[#d4af37]/20 text-slate-700 dark:text-[#f5f2ed]'
                    }`}
                  >
                    12 ساعة (05:30 م / ص)
                  </button>
                  <button
                    onClick={() => {
                      updateSettings({ timeFormat: '24h' });
                      showToast('تم تفعيل عرض التوقيت بنظام 24 ساعة ⏱️');
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                      settings.timeFormat === '24h'
                        ? 'bg-[#d4af37] text-[#042118] border-[#d4af37] shadow-sm'
                        : 'bg-white dark:bg-[#042118] border-slate-200 dark:border-[#d4af37]/20 text-slate-700 dark:text-[#f5f2ed]'
                    }`}
                  >
                    24 ساعة (17:30)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Adhan Alerts */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-[#d4af37] flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-[#d4af37]" />
              <span>تنبيهات وأذان الصلاة:</span>
            </label>

            <div className="space-y-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#063321]/40 border border-slate-200 dark:border-[#d4af37]/20 flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-[#f5f2ed]">
                    تفعيل إشعارات الأذان بالنظام
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-[#f5f2ed]/60">
                    إرسال إشعار للنظام مع الاهتزاز عند حلول وقت الصلاة
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

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#063321]/40 border border-slate-200 dark:border-[#d4af37]/20 flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-[#f5f2ed]">
                    رفع صوت الأذان كاملاً تلقائياً 🔊
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-[#f5f2ed]/60">
                    تشغيل صوت الأذان بصوت المؤذن المختار فور دخول الوقت حتى أثناء سكون الشاشة
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={settings.playAdhanAudioOnTime}
                  onChange={e => {
                    updateSettings({ playAdhanAudioOnTime: e.target.checked });
                    showToast(e.target.checked ? 'تم تفعيل رفع صوت الأذان تلقائياً 🕌' : 'تم إيقاف صوت الأذان التلقائي');
                  }}
                  className="w-5 h-5 accent-[#d4af37] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Google AdSense & Halal Ads Settings */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#063321]/40 border border-slate-200 dark:border-[#d4af37]/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 flex items-center justify-center font-bold flex-shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-[#d4af37] flex items-center gap-2">
                    <span>مساحات إعلانات Google AdSense المعتمدة</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                      جاهز للاعتماد ✓
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-[#f5f2ed]/70 mt-0.5">
                    إظهار مساحات الإعلانات مع تفعيل فلترة وحظر المحتوى المخل والربا والقمار 100%
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={settings.adSenseEnabled}
                onChange={e => {
                  updateSettings({ adSenseEnabled: e.target.checked });
                  showToast(e.target.checked ? 'تم تفعيل مساحات إعلانات Google AdSense' : 'تم إخفاء مساحات الإعلانات');
                }}
                className="w-5 h-5 accent-[#d4af37] cursor-pointer"
              />
            </div>

            {/* Publisher & Slot ID Configuration Fields */}
            {settings.adSenseEnabled && (
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#042118] border border-slate-200 dark:border-[#d4af37]/20 space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-[#d4af37] flex items-center justify-between">
                    <span>معرف الناشر في Google AdSense (Publisher ID):</span>
                    <span className="text-[10px] font-mono text-emerald-500 dark:text-emerald-400">مربوط في ads.txt</span>
                  </label>
                  <input
                    type="text"
                    value={settings.adSensePublisherId || 'ca-pub-6359877001554870'}
                    onChange={e => updateSettings({ adSensePublisherId: e.target.value.trim() })}
                    placeholder="ca-pub-6359877001554870"
                    className="w-full py-2 px-3 rounded-lg bg-slate-50 dark:bg-[#063321] border border-slate-300 dark:border-[#d4af37]/30 text-xs font-mono text-slate-800 dark:text-[#f5f2ed] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      معرف وحدة إعلان البانر (Banner Slot ID):
                    </label>
                    <input
                      type="text"
                      value={settings.adSenseBannerSlot || '1234567890'}
                      onChange={e => updateSettings({ adSenseBannerSlot: e.target.value.trim() })}
                      placeholder="1234567890"
                      className="w-full py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-[#063321] border border-slate-300 dark:border-[#d4af37]/30 text-[11px] font-mono text-slate-800 dark:text-[#f5f2ed] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      معرف وحدة الإعلان المدمج (In-Feed Slot ID):
                    </label>
                    <input
                      type="text"
                      value={settings.adSenseInFeedSlot || '9876543210'}
                      onChange={e => updateSettings({ adSenseInFeedSlot: e.target.value.trim() })}
                      placeholder="9876543210"
                      className="w-full py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-[#063321] border border-slate-300 dark:border-[#d4af37]/30 text-[11px] font-mono text-slate-800 dark:text-[#f5f2ed] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-slate-200 dark:border-[#d4af37]/20 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] text-slate-500 dark:text-slate-300">
                حالة الفلترة الشرعية: <b className="text-emerald-500 dark:text-emerald-400">نشطة (حظر تام للمحرمات)</b>
              </span>
              <button
                onClick={() => setShowGuideModal(true)}
                className="text-xs font-bold text-[#d4af37] hover:underline flex items-center gap-1.5 cursor-pointer bg-[#d4af37]/10 px-3 py-1.5 rounded-xl border border-[#d4af37]/30"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>دليل الربط والاعتماد في Google</span>
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

          {/* Section 6: About Anwar Al-Wahy & Designer Tribute */}
          <div className="p-4 rounded-2xl bg-[#063321] text-[#f5f2ed] border border-[#d4af37]/30 text-center space-y-2">
            <h4 className="font-serif text-base font-bold text-[#d4af37]">
              تطبيق أنوار الوحي للقرآن الكريم
            </h4>
            <p className="text-xs text-[#f5f2ed]/80 leading-relaxed max-w-md mx-auto">
              تطبيق إسلامي شامل ومجاني لوجه الله تعالى، يجمع بين القراءة، التلاوة العطرة، التفاسير المعتمدة، أوقات الصلاة، واتجاه القبلة.
            </p>
            <p className="text-[11px] text-[#d4af37]/60 font-mono">الإصدار 1.0.0 • جميع الحقوق محفوظة لكل مسلم ومسلمة</p>
          </div>

          {/* Designer & Lead Engineer Signature */}
          <DesignerSignature variant="card" showDetails={false} />
        </div>
      </motion.div>

      {showGuideModal && <HalalAdSenseGuideModal onClose={() => setShowGuideModal(false)} />}
    </div>
  );
};
