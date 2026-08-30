import React, { useState, useEffect } from 'react';
import {
  Heart,
  Send,
  Sparkles,
  Users,
  MessageSquare,
  ShieldCheck,
  LogIn,
  LogOut,
  User as UserIcon,
  Flame,
  Check
} from 'lucide-react';
import { useQuran } from '../context/QuranContext';
import { db, auth, googleProvider, signInWithPopup, signOut, signInAnonymously, User } from '../services/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { addCommunityDua, toggleAmenCommunityDua, CommunityDua } from '../services/firebaseSync';

export const CommunityDuasBoard: React.FC = () => {
  const { showToast } = useQuran();
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [duas, setDuas] = useState<CommunityDua[]>([]);
  const [newDuaText, setNewDuaText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('دعاء وتضرع');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('الكل');

  // Categories
  const categories = ['الكل', 'دعاء وتضرع', 'طلب الشفاء', 'تيسير الأمور', 'للوالدين', 'تفريج الكرب', 'تدبر قرآني'];

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });

    // Real-time listener for community duas from Firebase
    const q = query(collection(db, 'community_duas'), orderBy('createdAt', 'desc'), limit(50));
    const unsubDocs = onSnapshot(
      q,
      snapshot => {
        const list: CommunityDua[] = [];
        snapshot.forEach(docSnap => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<CommunityDua, 'id'>) });
        });
        setDuas(list);
      },
      err => {
        console.warn('Community duas snapshot error (will use offline fallback):', err);
      }
    );

    return () => {
      unsubAuth();
      unsubDocs();
    };
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showToast('تم تسجيل الدخول بنجاح عبر حساب Google ✨');
    } catch (err: any) {
      console.error(err);
      showToast('تعذر تسجيل الدخول، يمكنك المتابعة كزائر');
    }
  };

  const handleAnonymousSignIn = async () => {
    try {
      await signInAnonymously(auth);
      showToast('تم تسجيل الدخول السريع كزائر');
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    showToast('تم تسجيل الخروج بنجاح');
  };

  const handleSubmitDua = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDuaText.trim()) return;

    let user = currentUser;
    if (!user) {
      try {
        const userCred = await signInAnonymously(auth);
        user = userCred.user;
      } catch {
        showToast('يرجى تسجيل الدخول أولاً لنشر الدعاء');
        return;
      }
    }

    try {
      setIsSubmitting(true);
      await addCommunityDua(user, newDuaText.trim(), selectedCategory);
      setNewDuaText('');
      showToast('تم نشر دعائك المبارك في حائط الأدعية والتدبر! تقبل الله دعاءكم 🤲');
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء إرسال الدعاء، يرجى المحاولة لاحقاً');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAmen = async (dua: CommunityDua) => {
    let user = currentUser;
    if (!user) {
      try {
        const userCred = await signInAnonymously(auth);
        user = userCred.user;
      } catch {
        showToast('يرجى تسجيل الدخول أولاً');
        return;
      }
    }

    try {
      await toggleAmenCommunityDua(user, dua.id, dua.amenBy);
      showToast('آمين يا رب العالمين 🤲');
    } catch (err) {
      console.error(err);
    }
  };

  const filteredDuas = filterCategory === 'الكل'
    ? duas
    : duas.filter(d => d.category === filterCategory);

  return (
    <div className="space-y-6">
      {/* Community Header & Auth Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border border-amber-500/40 text-amber-50 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-amber-400" />
              <h2 className="font-arabic-title text-xl sm:text-2xl font-bold text-amber-200">
                حائط الأدعية والتدبر القرآني (Firebase Cloud)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-amber-100/80 mt-1 max-w-xl">
              شارك بدعائك أو تأملك القرآني مع إخوانك المؤمنين حول العالم، وادعُ بالخير وقل «آمين» لأدعية إخوانك بفضل الاتصال السحابي المباشر.
            </p>
          </div>

          {/* Auth Button */}
          <div>
            {currentUser ? (
              <div className="flex items-center gap-3 bg-emerald-950/80 border border-amber-500/30 p-2 sm:px-4 sm:py-2 rounded-2xl">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold text-xs">
                  {currentUser.displayName ? currentUser.displayName[0] : <UserIcon className="w-4 h-4" />}
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-amber-200 truncate max-w-[120px]">
                    {currentUser.displayName || (currentUser.isAnonymous ? 'زائر كريم' : currentUser.email)}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="text-[10px] text-rose-300 hover:underline flex items-center gap-1"
                  >
                    <LogOut className="w-3 h-3" />
                    تسجيل خروج
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleGoogleSignIn}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  تسجيل الدخول بـ Google
                </button>
                <button
                  onClick={handleAnonymousSignIn}
                  className="px-3 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-amber-200 text-xs border border-amber-500/30"
                >
                  دخول سريع
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post New Dua Form */}
      <form
        onSubmit={handleSubmitDua}
        className="bg-white dark:bg-emerald-950 border border-slate-200 dark:border-amber-500/20 rounded-3xl p-5 shadow-sm space-y-3"
      >
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-amber-200 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            اكتب دعاءً أو خاطرة قرآنية وشاركها:
          </label>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="text-xs bg-slate-100 dark:bg-emerald-900 border border-slate-200 dark:border-emerald-800 text-slate-700 dark:text-amber-200 rounded-xl px-2.5 py-1.5 focus:outline-none"
          >
            {categories.filter(c => c !== 'الكل').map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <textarea
          rows={3}
          value={newDuaText}
          onChange={e => setNewDuaText(e.target.value)}
          placeholder="اللهم اغفر لنا ولوالدينا وللمسلمين أجمعين، واشفِ مرضانا وارحم موتانا..."
          className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-emerald-900/40 border border-slate-200 dark:border-emerald-800 text-slate-800 dark:text-amber-100 text-sm focus:outline-none focus:border-amber-500"
        />

        <div className="flex justify-between items-center pt-1">
          <span className="text-[11px] text-slate-400 dark:text-amber-300/60">
            {currentUser ? `تنشر باسم: ${currentUser.displayName || 'زائر كريم'}` : 'سيتم النشر السريع باسم زائر'}
          </span>
          <button
            type="submit"
            disabled={isSubmitting || !newDuaText.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm disabled:opacity-50 transition-all"
          >
            <Send className="w-3.5 h-3.5 rtl:rotate-180" />
            <span>نشر الدعاء المبارك</span>
          </button>
        </div>
      </form>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterCategory === cat
                ? 'bg-amber-500 text-emerald-950 font-bold shadow-sm'
                : 'bg-white dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 text-slate-600 dark:text-amber-200 hover:border-amber-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Duas Feed */}
      <div className="space-y-3">
        {filteredDuas.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 rounded-3xl space-y-2">
            <MessageSquare className="w-10 h-10 mx-auto text-slate-400 dark:text-amber-400/40" />
            <p className="text-sm font-bold text-slate-700 dark:text-amber-200">
              كن أول من يبدأ بنشر دعاء مبارك في هذا القسم 🤲
            </p>
          </div>
        ) : (
          filteredDuas.map(dua => {
            const hasAmen = currentUser ? !!dua.amenBy?.[currentUser.uid] : false;
            const formattedDate = new Date(dua.createdAt).toLocaleDateString('ar-EG', {
              day: 'numeric',
              month: 'short'
            });

            return (
              <div
                key={dua.id}
                className="bg-white dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800/80 rounded-3xl p-5 shadow-sm space-y-3 hover:border-amber-500/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-900/60 border border-amber-500/30 flex items-center justify-center text-amber-300 font-bold text-xs">
                      {dua.authorName ? dua.authorName[0] : 'ق'}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-amber-200">
                        {dua.authorName || 'فاعل خير'}
                      </h4>
                      <span className="text-[10px] text-slate-400 dark:text-amber-300/60">
                        {formattedDate}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-medium">
                    {dua.category}
                  </span>
                </div>

                <p className="text-sm sm:text-base font-arabic-title text-slate-800 dark:text-amber-50 leading-relaxed font-medium">
                  {dua.content}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-emerald-900 flex justify-between items-center">
                  <span className="text-xs text-slate-400 dark:text-amber-300/60">
                    {dua.amenCount || 1} قالوا آمين 🤲
                  </span>

                  <button
                    onClick={() => handleAmen(dua)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                      hasAmen
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-emerald-50 dark:bg-emerald-900/50 text-emerald-800 dark:text-amber-200 border border-emerald-200 dark:border-emerald-800 hover:border-amber-400'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${hasAmen ? 'fill-white text-white' : 'text-emerald-500'}`} />
                    <span>{hasAmen ? 'قلت آمين ✓' : 'قل آمين 🤲'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
