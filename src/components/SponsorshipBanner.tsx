import React from 'react';
import { Heart, Sparkles, ExternalLink, X } from 'lucide-react';
import { useQuran } from '../context/QuranContext';

export const SponsorshipBanner: React.FC = () => {
  const { settings, updateSettings, showToast } = useQuran();

  if (!settings.showSponsorship) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-1">
      <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-emerald-50 to-amber-50 dark:from-emerald-950/80 dark:via-emerald-900/60 dark:to-emerald-950/80 border border-amber-300 dark:border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3 text-right">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center justify-center flex-shrink-0 font-bold">
            <Heart className="w-4 h-4 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-amber-200">
                مساهمة وقفية: طباعة وتوزيع المصحف الشريف
              </h4>
              <span className="text-[10px] bg-amber-500/20 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-semibold">
                رعاية وقفية
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-amber-200/70 mt-0.5">
              ساهم في نشر كتاب الله تعالى وبناء الأجر الجاري في العالم الإسلامي.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => showToast('جزاك الله خيراً على نيتك الطيبة في دعم مشاريع القرآن الكريم 🤲')}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-bold text-xs shadow-xs transition-all flex items-center gap-1"
          >
            <span>المساهمة في الوقف</span>
            <ExternalLink className="w-3 h-3" />
          </button>
          <button
            onClick={() => updateSettings({ showSponsorship: false })}
            title="إخفاء هذه البطاقة"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-amber-300"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
