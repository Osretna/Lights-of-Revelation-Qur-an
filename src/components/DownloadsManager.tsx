import React, { useState } from 'react';
import {
  Download,
  CheckCircle2,
  HardDrive,
  Trash2,
  RefreshCw,
  Sparkles,
  Wifi,
  Headphones,
  BookOpen
} from 'lucide-react';
import { useQuran } from '../context/QuranContext';
import { RECITERS_LIST } from '../data/recitersData';

export const DownloadsManager: React.FC = () => {
  const {
    showToast,
    downloadedReciters,
    addDownloadedReciter,
    removeDownloadedReciter,
    clearAllDownloads
  } = useQuran();

  const [downloadingReciter, setDownloadingReciter] = useState<string | null>(null);

  const totalUsedMB: number = Object.values(downloadedReciters).reduce<number>(
    (acc, val) => acc + Number(val || 0),
    0
  );

  const handleDownloadFullReciter = (reciterId: string, name: string) => {
    setDownloadingReciter(reciterId);
    showToast(`جاري تنزيل تلاوات ${name} للاستماع دون اتصال بالإنترنت... 📥`);
    
    setTimeout(() => {
      addDownloadedReciter(reciterId, 450);
      setDownloadingReciter(null);
      showToast(`اكتمل تنزيل تلاوات ${name} بنجاح! جاهز بدون إنترنت ✓`);
    }, 1500);
  };

  const handleRemoveReciterDownload = (reciterId: string, name: string) => {
    removeDownloadedReciter(reciterId);
    showToast(`تم حذف التلاوات المحملة لـ ${name} لتوفير المساحة`);
  };

  const handleClearAllStorage = () => {
    clearAllDownloads();
    showToast('تم تنظيف الذاكرة المؤقتة بنجاح');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 pb-28 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border border-amber-500/30 rounded-3xl p-6 text-amber-50 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Download className="w-6 h-6 text-amber-400" />
              <h1 className="font-arabic-title text-2xl sm:text-3xl font-bold text-amber-200">
                إدارة التنزيلات والعمل بدون إنترنت
              </h1>
            </div>
            <p className="text-sm text-amber-100/80 mt-1">
              حمل سور القرآن الكريم والتلاوات الصوتية واستمع إليها في أي وقت وأي مكان دون الحاجة للاتصال بالشبكة.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-900/80 border border-amber-500/30 px-3.5 py-1.5 rounded-xl text-xs text-amber-300">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span>نظام التشغيل غير المتصل (Offline)</span>
          </div>
        </div>
      </div>

      {/* Storage Status Card */}
      <div className="bg-white dark:bg-emerald-950 border border-slate-200 dark:border-amber-500/20 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base sm:text-lg text-slate-800 dark:text-amber-100">
              المساحة المستخدمة في ذاكرة الجهاز
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-300 bg-amber-500/20 px-3 py-1 rounded-xl">
            {totalUsedMB} ميجابايت مستخدمة
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-100 dark:bg-emerald-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full"
            style={{ width: `${Math.min(100, (totalUsedMB / 2000) * 100)}%` }}
          />
        </div>

        {/* Storage Breakdown Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-emerald-900/30 border border-slate-200 dark:border-emerald-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>نصوص القرآن والتفاسير:</span>
            </div>
            <strong className="text-emerald-700 dark:text-emerald-300">15 MB (محفوظة مسبقاً ✓)</strong>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-emerald-900/30 border border-slate-200 dark:border-emerald-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-amber-500" />
              <span>التلاوات الصوتية المحملة:</span>
            </div>
            <strong className="text-amber-700 dark:text-amber-300">{Math.max(0, totalUsedMB - 15)} MB</strong>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-emerald-900/30 border border-slate-200 dark:border-emerald-800 flex items-center justify-between text-xs">
            <button
              onClick={handleClearAllStorage}
              className="text-rose-600 dark:text-rose-400 font-bold hover:underline flex items-center gap-1 w-full justify-center"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>تنظيف الذاكرة المؤقتة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reciters Offline Download Packages */}
      <div className="bg-white dark:bg-emerald-950 border border-slate-200 dark:border-amber-500/20 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-base sm:text-lg text-slate-800 dark:text-amber-100">
          حزم التلاوات الصوتية حسب القارئ:
        </h3>

        <div className="space-y-3">
          {RECITERS_LIST.map(rec => {
            const isDownloaded = !!downloadedReciters[rec.id];
            const isDownloading = downloadingReciter === rec.id;
            const size = downloadedReciters[rec.id] || 450;

            return (
              <div
                key={rec.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-900/30 border border-slate-200 dark:border-emerald-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-amber-100">
                      {rec.name}
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-amber-200/60">
                      المصحف المرتل كاملاً • {size} ميجابايت
                    </span>
                  </div>
                </div>

                <div>
                  {isDownloaded ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>محمل وجاهز</span>
                      </span>
                      <button
                        onClick={() => handleRemoveReciterDownload(rec.id, rec.name)}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="حذف الملفات المحملة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleDownloadFullReciter(rec.id, rec.name)}
                      disabled={isDownloading}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-50"
                    >
                      {isDownloading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>جاري التنزيل...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>تنزيل المصحف كاملاً</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
