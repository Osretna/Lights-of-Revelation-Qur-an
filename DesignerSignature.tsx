import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Award, Star } from 'lucide-react';

interface DesignerSignatureProps {
  variant?: 'card' | 'badge' | 'compact' | 'modal';
  showDetails?: boolean;
}

export const DesignerSignature: React.FC<DesignerSignatureProps> = ({
  variant = 'card',
  showDetails = true
}) => {
  const glowingColors = [
    { name: 'أصفر ذهبي', hex: '#d4af37', text: 'Gold Yellow' },
    { name: 'أسمر / أسود ملكي', hex: '#0f172a', text: 'Obsidian Black' },
    { name: 'أزرق سماوي', hex: '#38bdf8', text: 'Royal Blue' },
    { name: 'بنفسجي ملكي', hex: '#c084fc', text: 'Imperial Violet' },
    { name: 'أخضر زمردي', hex: '#34d399', text: 'Emerald Green' },
    { name: 'أبيض ناصع', hex: '#ffffff', text: 'Pure White' }
  ];

  if (variant === 'badge' || variant === 'compact') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#031a13]/90 border-2 animate-designer-glow transition-all cursor-default select-none shadow-md" dir="rtl">
        <Sparkles className="w-3.5 h-3.5 animate-spin animate-designer-text" style={{ animationDuration: '8s' }} />
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-extrabold tracking-wide font-arabic-title animate-designer-text">
            صدقة جارية عن فلان ابن فلان وفلان ابن فلان
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-2" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#021811] via-[#04281d] to-[#021811] border-2 animate-designer-glow p-5 sm:p-7 shadow-2xl"
      >
        {/* Background Ambient Aura */}
        <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-[#d4af37]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 rounded-full bg-[#38bdf8]/10 blur-3xl pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Main Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-right">
            {/* Emblem */}
            <div className="relative group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#063321] to-[#0a4830] border-2 animate-designer-glow flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 animate-designer-text fill-current/20" />
              </div>
              <div className="absolute -bottom-2 -right-2 p-1 rounded-full bg-[#042118] border border-[#d4af37] text-[#d4af37]">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Typography & Names */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37]">
                  وقف إسلامي خالص
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>

              {/* Master Text with Glowing Multi-Color Effect */}
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight font-arabic-title animate-designer-text">
                صدقة جارية عن فلان ابن فلان وفلان ابن فلان
              </h2>

              {/* Subtitle Du'a */}
              <p className="text-xs sm:text-sm font-arabic-title text-[#d4af37]/90 font-bold">
                نسأل الله العظيم أن يتقبلها قبولاً حسناً، وأن يثقل بها الموازين ويجعلها نوراً وشفيعاً يوم القيامة
              </p>

              <p className="text-xs text-slate-300 max-w-md font-light leading-relaxed">
                تطبيق أنوار الوحي للقرآن الكريم • عمل خالص لوجه الله تعالى ونشر آياته العطرة في مشارق الأرض ومغاربها
              </p>
            </div>
          </div>

          {/* Right Glowing Color Spectrum Badge */}
          {showDetails && (
            <div className="flex flex-col items-center sm:items-start gap-2 bg-[#02140e]/80 border border-[#d4af37]/30 rounded-2xl p-3.5 sm:p-4 backdrop-blur-md shadow-inner">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>أطياف الوميض التفاعلية</span>
              </div>

              {/* Color dots preview */}
              <div className="flex items-center gap-2 pt-1">
                {glowingColors.map((c, i) => (
                  <div
                    key={i}
                    title={`${c.name} (${c.text})`}
                    className="group relative cursor-pointer"
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-white/40 shadow-sm transition-transform hover:scale-125"
                      style={{
                        backgroundColor: c.hex,
                        boxShadow: `0 0 10px ${c.hex}`
                      }}
                    />
                  </div>
                ))}
              </div>

              <span className="text-[10px] text-slate-400 font-mono tracking-wider pt-0.5" dir="ltr">
                Gold • Obsidian • Blue • Violet • Green • White
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
