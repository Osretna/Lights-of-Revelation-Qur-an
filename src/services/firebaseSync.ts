import {
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
  deleteDoc,
  addDoc,
  query,
  orderBy,
  limit,
  updateDoc
} from 'firebase/firestore';
import { db, auth, User } from './firebase';
import { Bookmark, KhatmahPlan, ReadingProgress, AppSettings } from '../types/quran';

export interface CommunityDua {
  id: string;
  userId: string;
  authorName: string;
  content: string;
  category: string;
  likesCount: number;
  amenCount: number;
  likedBy?: Record<string, boolean>;
  amenBy?: Record<string, boolean>;
  createdAt: number;
}

/**
 * Save user profile and global reading status
 */
export async function syncUserProfileToFirebase(
  user: User,
  readingProgress: ReadingProgress,
  settings: AppSettings,
  tasbeehTotal: number
) {
  if (!user) return;
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(
      userRef,
      {
        userId: user.uid,
        displayName: user.displayName || 'قارئ القرآن',
        email: user.email || '',
        photoURL: user.photoURL || '',
        lastReadSurah: readingProgress.lastSurahNumber,
        lastReadAyah: readingProgress.lastAyahNumber,
        lastReadPage: readingProgress.lastPageNumber,
        tasbeehTotal,
        selectedReciterId: settings.selectedReciterId,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Firebase profile sync error:', err);
  }
}

/**
 * Sync Bookmark to Firebase
 */
export async function syncBookmarkToFirebase(user: User, bookmark: Bookmark) {
  if (!user) return;
  try {
    const bmRef = doc(db, 'users', user.uid, 'bookmarks', bookmark.id);
    await setDoc(bmRef, {
      ...bookmark,
      userId: user.uid
    });
  } catch (err) {
    console.warn('Firebase bookmark save error:', err);
  }
}

/**
 * Remove Bookmark from Firebase
 */
export async function removeBookmarkFromFirebase(user: User, bookmarkId: string) {
  if (!user) return;
  try {
    const bmRef = doc(db, 'users', user.uid, 'bookmarks', bookmarkId);
    await deleteDoc(bmRef);
  } catch (err) {
    console.warn('Firebase bookmark delete error:', err);
  }
}

/**
 * Sync Khatmah to Firebase
 */
export async function syncKhatmahToFirebase(user: User, khatmah: KhatmahPlan) {
  if (!user) return;
  try {
    const kRef = doc(db, 'users', user.uid, 'khatmahs', khatmah.id);
    await setDoc(kRef, {
      ...khatmah,
      userId: user.uid,
      updatedAt: Date.now()
    });
  } catch (err) {
    console.warn('Firebase khatmah save error:', err);
  }
}

/**
 * Delete Khatmah from Firebase
 */
export async function deleteKhatmahFromFirebase(user: User, khatmahId: string) {
  if (!user) return;
  try {
    const kRef = doc(db, 'users', user.uid, 'khatmahs', khatmahId);
    await deleteDoc(kRef);
  } catch (err) {
    console.warn('Firebase khatmah delete error:', err);
  }
}

/**
 * Post a Community Dua / Reflection
 */
export async function addCommunityDua(
  user: User,
  content: string,
  category: string = 'عام'
): Promise<string> {
  const colRef = collection(db, 'community_duas');
  const docRef = await addDoc(colRef, {
    userId: user.uid,
    authorName: user.displayName || 'فاعل خير',
    content,
    category,
    likesCount: 0,
    amenCount: 1,
    amenBy: { [user.uid]: true },
    createdAt: Date.now()
  });
  return docRef.id;
}

/**
 * Say "Amen" / Like a community dua
 */
export async function toggleAmenCommunityDua(user: User, duaId: string, currentAmenBy: Record<string, boolean> = {}) {
  const isAmen = !!currentAmenBy[user.uid];
  const docRef = doc(db, 'community_duas', duaId);
  const newAmenBy = { ...currentAmenBy };

  if (isAmen) {
    delete newAmenBy[user.uid];
  } else {
    newAmenBy[user.uid] = true;
  }

  const amenCount = Object.keys(newAmenBy).length;
  await updateDoc(docRef, {
    amenBy: newAmenBy,
    amenCount
  });
}
