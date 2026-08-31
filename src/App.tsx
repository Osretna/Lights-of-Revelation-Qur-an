/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { QuranProvider, useQuran } from './context/QuranContext';
import { SplashScreen } from './components/SplashScreen';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeDashboard } from './components/HomeDashboard';
import { QuranReader } from './components/QuranReader';
import { AudioRecitationsSection } from './components/AudioRecitationsSection';
import { TafsirSection } from './components/TafsirSection';
import { QuranSearch } from './components/QuranSearch';
import { AzkarSection } from './components/AzkarSection';
import { PrayerTimesSection } from './components/PrayerTimesSection';
import { QiblaCompass } from './components/QiblaCompass';
import { KhatmahTracker } from './components/KhatmahTracker';
import { DownloadsManager } from './components/DownloadsManager';
import { AdminDashboard } from './components/AdminDashboard';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { AyahDetailModal } from './components/AyahDetailModal';
import { UserProfileModal } from './components/UserProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { SponsorshipBanner } from './components/SponsorshipBanner';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { VoiceCorrectionModal } from './components/VoiceCorrectionModal';
import { AdhanAlertModal } from './components/AdhanAlertModal';

const AppContent: React.FC = () => {
  const {
    showSplash,
    activeTab,
    toastMessage,
    settings,
    audioState,
    isVoiceCorrectionOpen,
    setIsVoiceCorrectionOpen,
    activeAdhanAlert,
    closeAdhanAlert,
    selectedSurahNum,
    selectedAyahNum
  } = useQuran();

  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  // Theme Class
  const themeClass =
    settings.theme === 'sepia'
      ? 'theme-sepia bg-[#f5efe1] text-[#332211]'
      : settings.theme === 'oled'
      ? 'theme-oled bg-black text-white'
      : settings.theme === 'dark'
      ? 'theme-dark bg-[#031912] text-slate-100'
      : 'theme-emerald bg-[#042118] text-[#f5f2ed]';

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans ${themeClass} selection:bg-[#d4af37] selection:text-[#042118] transition-colors relative`} dir="rtl">
      {/* Professional Polish Subtle Background Dot Grid */}
      <div
        className="fixed inset-0 opacity-10 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(#d4af37 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      />
      {/* Top Navbar */}
      <Navbar
        onOpenSearch={() => setShowSearchModal(true)}
        onOpenBookmarks={() => setShowProfileModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenProfile={() => setShowProfileModal(true)}
      />

      {/* Optional Respectful Sponsorship Banner (Hidden on Quran Reader for pure focus) */}
      {activeTab !== 'quran' && <SponsorshipBanner />}

      {/* Main Screen Router */}
      <main className="flex-1 w-full relative z-10">
        {activeTab === 'home' && <HomeDashboard />}
        {activeTab === 'quran' && <QuranReader />}
        {activeTab === 'audio' && <AudioRecitationsSection />}
        {activeTab === 'tafsir' && <TafsirSection />}
        {activeTab === 'search' && <QuranSearch />}
        {activeTab === 'azkar' && <AzkarSection />}
        {activeTab === 'prayer' && <PrayerTimesSection />}
        {activeTab === 'qibla' && <QiblaCompass />}
        {activeTab === 'khatmah' && <KhatmahTracker />}
        {activeTab === 'downloads' && <DownloadsManager />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Persistent Floating Audio Bar */}
      {audioState.audioElement && <AudioPlayerBar />}

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Modals */}
      {showSearchModal && <QuranSearch isModal onClose={() => setShowSearchModal(false)} />}
      <AyahDetailModal />
      {showProfileModal && <UserProfileModal onClose={() => setShowProfileModal(false)} />}
      {showSettingsModal && <SettingsModal onClose={() => setShowSettingsModal(false)} />}
      
      {/* Voice Recitation Assistant & Live Correction Modal */}
      {isVoiceCorrectionOpen && (
        <VoiceCorrectionModal
          initialSurahNum={selectedSurahNum}
          initialAyahNum={selectedAyahNum}
          onClose={() => setIsVoiceCorrectionOpen(false)}
        />
      )}

      {/* Adhan Live Alert Modal */}
      {activeAdhanAlert && (
        <AdhanAlertModal
          isOpen={!!activeAdhanAlert}
          prayerName={activeAdhanAlert.prayerName}
          cityName={activeAdhanAlert.cityName}
          onClose={closeAdhanAlert}
        />
      )}

      {/* PWA Android / Mobile Install Banner */}
      <PWAInstallBanner />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#063321] text-[#d4af37] border-2 border-[#d4af37]/80 px-4 py-2.5 rounded-2xl shadow-2xl gold-glow text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <QuranProvider>
      <AppContent />
    </QuranProvider>
  );
}
