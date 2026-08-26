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
  Bell
} from 'lucide-react';
import { useQuran } from '../context/QuranContext';
import { RECITERS_LIST } from '../data/recitersData';

export const AdminDashboard: React.FC = () => {
  const { showToast } = useQuran();

  const [broadcastTitle, setBroadcastTitle] = useState<string>('تنبيه قرآني: صيام يوم الإثنين سنة نبوية');
  const [broadcastBody, setBroadcastBody] = useState<string>('تذكر قراءة وردك اليومي من القرآن الكريم مع تطبيق أنوار الوحي.');
  const [sentCount, setSentCount] = useState<number>(3);

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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 pb-28 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border border-amber-500/30 rounded-3xl p-6 text-amber-50 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-amber-400" />
              <h1 className="font-arabic-title text-2xl sm:text-3xl font-bold text-amber-200">
                لوحة تحكم إدارة تطبيق أنوار الوحي
              </h1>
            </div>
            <p className="text-sm text-amber-100/80 mt-1">
              متابعة الإحصائيات الحية، إرسال التنبيهات الجماعية، وإدارة محتوى التلاوات والرعايات.
            </p>
          </div>

          <div className="bg-amber-500 text-emerald-950 px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-md">
            مشرف النظام (Admin)
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
              className="p-5 rounded-3xl bg-white dark:bg-emerald-950 border border-slate-200 dark:border-amber-500/20 shadow-sm space-y-2"
            >
              <div className="flex justify-between items-center">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {s.change}
                </span>
              </div>
              <h3 className="text-2xl font-black font-mono text-slate-900 dark:text-amber-100">
                {s.value}
              </h3>
              <p className="text-xs text-slate-500 dark:text-amber-200/70">{s.title}</p>
            </div>
          );
        })}
      </div>

      {/* Broadcast Push Notifications Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-emerald-950 border border-slate-200 dark:border-amber-500/20 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base sm:text-lg text-slate-800 dark:text-amber-100">
              إرسال إشعار فوري لجميع المستخدمين
            </h3>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-amber-200 block mb-1">
                عنوان الإشعار:
              </label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={e => setBroadcastTitle(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-emerald-900/40 border border-slate-200 dark:border-emerald-800 text-slate-800 dark:text-amber-100 text-xs font-medium focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-amber-200 block mb-1">
                نص الرسالة:
              </label>
              <textarea
                rows={3}
                required
                value={broadcastBody}
                onChange={e => setBroadcastBody(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-emerald-900/40 border border-slate-200 dark:border-emerald-800 text-slate-800 dark:text-amber-100 text-xs font-medium focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Send className="w-4 h-4" />
              <span>إرسال التنبيه الجماعي الآن ({sentCount} تم إرسالها مسبقاً)</span>
            </button>
          </form>
        </div>

        {/* Most Listened Surahs Live List */}
        <div className="bg-white dark:bg-emerald-950 border border-slate-200 dark:border-amber-500/20 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base sm:text-lg text-slate-800 dark:text-amber-100">
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
              <div key={s.name} className="p-3 rounded-2xl bg-slate-50 dark:bg-emerald-900/30 border border-slate-200 dark:border-emerald-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-amber-100">سورة {s.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 dark:text-amber-200/70">{s.listens}</span>
                  <span className="font-bold font-mono text-amber-600 dark:text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
                    {s.pct}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
