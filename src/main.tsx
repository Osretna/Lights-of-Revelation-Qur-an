import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initSecurityDefenses } from './utils/security';

// Initialize defensive security guards
initSecurityDefenses();

// Register Progressive Web App Service Worker for offline capability, APK packaging & fast caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('Anwar Al-Wahy ServiceWorker active:', registration.scope);
      })
      .catch((error) => {
        console.warn('ServiceWorker registration fallback:', error);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
