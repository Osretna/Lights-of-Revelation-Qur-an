// Offline Audio & Surah Download Storage using standard IndexedDB

const DB_NAME = 'AnwarAlWahy_AudioDB';
const DB_VERSION = 1;
const STORE_NAME = 'downloaded_surahs';

export interface DownloadedSurahMeta {
  id: string; // `${reciterId}_${surahNumber}`
  reciterId: string;
  surahNumber: number;
  surahName: string;
  reciterName: string;
  audioBlob: Blob;
  size: number;
  downloadedAt: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('reciterId', 'reciterId', { unique: false });
        store.createIndex('surahNumber', 'surahNumber', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Check if a Surah audio is saved offline in IndexedDB
 */
export async function isSurahSavedOffline(reciterId: string, surahNumber: number): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const id = `${reciterId}_${surahNumber}`;
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(!!request.result);
      };
      request.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

/**
 * Get offline Surah audio blob URL
 */
export async function getOfflineSurahBlobUrl(reciterId: string, surahNumber: number): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const id = `${reciterId}_${surahNumber}`;
      const request = store.get(id);

      request.onsuccess = () => {
        const record = request.result as DownloadedSurahMeta | undefined;
        if (record && record.audioBlob) {
          const blobUrl = URL.createObjectURL(record.audioBlob);
          resolve(blobUrl);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Save downloaded Surah audio blob into IndexedDB
 */
export async function saveSurahOffline(
  reciterId: string,
  surahNumber: number,
  surahName: string,
  reciterName: string,
  audioBlob: Blob
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const id = `${reciterId}_${surahNumber}`;

    const record: DownloadedSurahMeta = {
      id,
      reciterId,
      surahNumber,
      surahName,
      reciterName,
      audioBlob,
      size: audioBlob.size,
      downloadedAt: Date.now()
    };

    const request = store.put(record);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Delete a downloaded Surah from IndexedDB
 */
export async function deleteSurahOffline(reciterId: string, surahNumber: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const id = `${reciterId}_${surahNumber}`;
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get all downloaded Surahs
 */
export async function getAllOfflineSurahs(): Promise<DownloadedSurahMeta[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

/**
 * Fetch and download Surah audio file with progress, saves to IndexedDB AND triggers browser download
 */
export async function downloadAndSaveSurah(
  urls: string[],
  reciterId: string,
  surahNumber: number,
  surahName: string,
  reciterName: string,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; filename: string }> {
  const padded = surahNumber.toString().padStart(3, '0');
  const filename = `سورة_${surahName}_بصوت_${reciterName.replace(/\s+/g, '_')}.mp3`;

  let lastError: any = null;

  for (const url of urls) {
    try {
      if (onProgress) onProgress(15);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);

      const reader = response.body?.getReader();
      const contentLength = +(response.headers.get('Content-Length') || 0);

      let receivedLength = 0;
      const chunks: Uint8Array[] = [];

      if (reader && contentLength > 0) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          receivedLength += value.length;
          if (onProgress) {
            const percent = Math.min(95, Math.round((receivedLength / contentLength) * 100));
            onProgress(percent);
          }
        }
      } else {
        // Fallback standard blob
        const blob = await response.blob();
        if (onProgress) onProgress(90);
        chunks.push(new Uint8Array(await blob.arrayBuffer()));
      }

      const audioBlob = new Blob(chunks, { type: 'audio/mpeg' });

      // 1. Save in IndexedDB for permanent offline in-app playback
      await saveSurahOffline(reciterId, surahNumber, surahName, reciterName, audioBlob);

      // 2. Trigger native browser file download to user's device/downloads folder
      const downloadLink = document.createElement('a');
      const blobUrl = URL.createObjectURL(audioBlob);
      downloadLink.href = blobUrl;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      setTimeout(() => {
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(blobUrl);
      }, 2000);

      if (onProgress) onProgress(100);
      return { success: true, filename };
    } catch (err) {
      console.warn(`Failed downloading from ${url}:`, err);
      lastError = err;
    }
  }

  throw lastError || new Error('تعذر تحميل الملف الصوتي من الخوادم المتاحة');
}
