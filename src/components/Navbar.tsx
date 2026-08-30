import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Settings as SettingsIcon,
  Bookmark,
  User,
  ShieldAlert,
  Headphones,
  Moon,
  Sun,
  MapPin,
  Mic,
  Lock
} from 'lucide-react';
import { useQuran } from '../context/QuranContext';
import { AdminLoginModal } from './AdminLoginModal';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenBookmarks,
  onOpenSettings,
  onOpenProfile
}) => {
  const {
    activeTab,
    setActiveTab,
    prayerTimes,
    nextPrayer,
    audioState,
    togglePlayPause,
    settings,
    updateSettings,
    setIsVoiceCorrectionOpen,
    isAdminAuthenticated
  } = useQuran();

  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);

  const handleAdminClick = () => {
    if (isAdminAuthenticated) {
      setActiveTab(activeTab === 'admin' ? 'home' : 'admin');
    } else {
      setShowAdminLoginModal(true);
    }
  };

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'emerald' ? 'dark' : settings.theme === 'dark' ? 'sepia' : 'emerald';
    updateSettings({ theme: nextTheme });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#063321] text-[#f5f2ed] border-b border-[#d4af37]/30 backdrop-blur-md transition-colors shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-12 h-12 rounded-lg bg-[#d4af37] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)] text-[#042118] font-bold transition-transform hover:scale-105">
              <BookOpen className="w-6 h-6 text-[#042118]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-[#d4af37]">
                  أنوار الوحي
                </span>
                <span className="hidden md:inline-block text-[10px] bg-[#d4af37]/20 text-[#d4af37] px-2.5 py-0.5 rounded-full border border-[#d4af37]/30 font-bold uppercase tracking-wider">
                  القرآن الكريم
                </span>
              </div>
              <p className="text-xs text-[#d4af37]/80 hidden sm:block font-medium">
                {prayerTimes.hijriDate}
              </p>
            </div>
          </div>

          {/* Center: Next Prayer Pill */}
          <div className="hidden lg:flex items-center gap-2 bg-[#042118]/90 border border-[#d4af37]/30 px-4 py-2 rounded-full text-xs shadow-inner">
            <div className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
            <span className="text-[#d4af37]/80">الصلاة القادمة:</span>
            <span className="text-[#d4af37] font-bold text-sm">{nextPrayer.nameArabic}</span>
            <span className="text-[#f5f2ed] font-mono bg-[#063321] px-2.5 py-0.5 rounded text-xs border border-[#d4af37]/20">
              {nextPrayer.timeString}
            </span>
            <span className="text-[#d4af37]/70 text-xs">
              (متبقي {nextPrayer.formattedCountdown})
            </span>
            <span className="text-[#d4af37]/60 text-xs border-r border-[#d4af37]/30 pr-2.5 mr-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#d4af37]" /> {settings.locationCity}
            </span>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Live Recitation Correction Button */}
            <button
              id="nav-voice-correction-btn"
              onClick={() => setIsVoiceCorrectionOpen(true)}
              title="مصحح التلاوة والمساعد الصوتي الذكي"
              className="flex items-center gap-1.5 bg-[#d4af37] hover:bg-[#c19b2e] text-[#042118] font-bold px-3 py-2 rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span className="hidden sm:inline">مصحح التلاوة</span>
            </button>

            {/* Search Button */}
            <button
              id="nav-search-btn"
              onClick={onOpenSearch}
              title="البحث في القرآن الكريم"
              className="p-2 sm:p-2.5 rounded-xl text-[#d4af37] hover:text-white hover:bg-[#084d32] border border-transparent hover:border-[#d4af37]/40 transition-all cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Audio Quick Mini-Player indicator */}
            {audioState.audioElement && (
              <button
                id="nav-audio-btn"
                onClick={togglePlayPause}
                title="مشغل التلاوة الصوتية"
                className={`p-2 sm:p-2.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                  audioState.isPlaying
                    ? 'bg-[#d4af37] text-[#042118] border-[#d4af37] font-bold shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                    : 'text-[#d4af37] hover:bg-[#084d32] border-[#084d32]'
                }`}
              >
                <Headphones className={`w-5 h-5 ${audioState.isPlaying ? 'animate-bounce' : ''}`} />
              </button>
            )}

            {/* Bookmarks */}
            <button
              id="nav-bookmarks-btn"
              onClick={onOpenBookmarks}
              title="العلامات المرجعية المحفوظة"
              className="p-2 sm:p-2.5 rounded-xl text-[#d4af37] hover:text-white hover:bg-[#084d32] border border-transparent hover:border-[#d4af37]/40 transition-all cursor-pointer"
            >
              <Bookmark className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            <button
              id="nav-theme-btn"
              onClick={toggleTheme}
              title="تبديل المظهر"
              className="p-2 sm:p-2.5 rounded-xl text-[#d4af37] hover:text-white hover:bg-[#084d32] border border-transparent hover:border-[#d4af37]/40 transition-all hidden sm:block cursor-pointer"
            >
              {settings.theme === 'dark' ? (
                <Moon className="w-5 h-5 text-[#d4af37]" />
              ) : (
                <Sun className="w-5 h-5 text-[#d4af37]" />
              )}
            </button>

            {/* Profile */}
            <button
              id="nav-profile-btn"
              onClick={onOpenProfile}
              title="الملف الشخصي والإحصائيات"
              className="p-2 sm:p-2.5 rounded-xl text-[#d4af37] hover:text-white hover:bg-[#084d32] border border-transparent hover:border-[#d4af37]/40 transition-all cursor-pointer"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Settings */}
            <button
              id="nav-settings-btn"
              onClick={onOpenSettings}
              title="الإعدادات العامة"
              className="p-2 sm:p-2.5 rounded-xl text-[#d4af37] hover:text-white hover:bg-[#084d32] border border-transparent hover:border-[#d4af37]/40 transition-all cursor-pointer"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>

            {/* Admin Switcher */}
            <button
              id="nav-admin-btn"
              onClick={handleAdminClick}
              title={isAdminAuthenticated ? "لوحة تحكم الإدارة (مفتوحة)" : "لوحة تحكم الإدارة (تتطلب كلمة مرور المشرف)"}
              className={`p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-[#d4af37] text-[#042118] font-bold border-[#d4af37]'
                  : 'text-[#d4af37]/60 hover:text-[#d4af37] hover:bg-[#084d32] border-transparent'
              }`}
            >
              {isAdminAuthenticated ? (
                <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-current" />
              ) : (
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-[#d4af37]/70 hover:text-[#d4af37]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Admin Login Modal (Password Protected) */}
      {showAdminLoginModal && (
        <AdminLoginModal onClose={() => setShowAdminLoginModal(false)} />
      )}
    </header>
  );
};
