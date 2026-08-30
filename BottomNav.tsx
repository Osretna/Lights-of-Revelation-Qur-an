import React from 'react';
import {
  Home,
  BookOpen,
  Headphones,
  BookMarked,
  Flame,
  Clock,
  Compass,
  CheckCircle2,
  Download
} from 'lucide-react';
import { useQuran, AppTab } from '../context/QuranContext';

interface NavItem {
  id: AppTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'الرئيسية', icon: Home },
  { id: 'quran', label: 'المصحف', icon: BookOpen },
  { id: 'audio', label: 'التلاوات', icon: Headphones },
  { id: 'tafsir', label: 'التفاسير', icon: BookMarked },
  { id: 'azkar', label: 'الأذكار', icon: Flame },
  { id: 'prayer', label: 'الصلاة', icon: Clock },
  { id: 'qibla', label: 'القبلة', icon: Compass },
  { id: 'khatmah', label: 'الختمة', icon: CheckCircle2 },
  { id: 'downloads', label: 'التحميلات', icon: Download }
];

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useQuran();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#042118]/95 border-t border-[#d4af37]/25 backdrop-blur-xl pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex items-center justify-around h-18 sm:h-20">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`bottom-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center flex-1 py-1.5 px-0.5 sm:px-1 rounded-xl transition-all duration-200 relative group ${
                  isActive
                    ? 'text-[#d4af37] font-bold scale-105'
                    : 'text-[#f5f2ed]/60 hover:text-[#d4af37] hover:bg-[#063321]/50'
                }`}
              >
                {/* Active Top Dot indicator */}
                {isActive && (
                  <div className="absolute top-1 w-1.5 h-1.5 bg-[#d4af37] rounded-full shadow-[0_0_8px_rgba(212,175,55,0.9)]" />
                )}
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    isActive ? 'bg-[#063321] text-[#d4af37] border border-[#d4af37]/30 shadow-sm' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] sm:text-xs mt-0.5 tracking-tight font-medium truncate max-w-full">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
