import React from 'react';
import { X, Gift, Sparkles, Heart } from 'lucide-react';
import { Logo } from './Logo';

interface BirthdayCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  childName: string;
  age: string;
  profilePic?: string;
  gender: string;
}

export const BirthdayCardModal: React.FC<BirthdayCardModalProps> = ({
  isOpen,
  onClose,
  childName,
  age,
  profilePic,
  gender
}) => {
  if (!isOpen) return null;

  const isFemale = gender?.toLowerCase() === 'female';

  // Theme colors
  const primaryColor = isFemale ? 'text-pink-500' : 'text-blue-500';
  const bgColor = isFemale ? 'bg-pink-50 dark:bg-pink-900/20' : 'bg-blue-50 dark:bg-blue-900/20';
  const buttonBg = isFemale ? 'bg-pink-100 text-pink-600 hover:bg-pink-200' : 'bg-blue-100 text-blue-600 hover:bg-blue-200';
  const ribbonColor = isFemale ? 'bg-pink-300' : 'bg-blue-300';
  const noteBg = isFemale ? 'bg-white border-pink-100' : 'bg-white border-blue-100';
  const highlightText = isFemale ? 'text-pink-400' : 'text-blue-400';

  const shortName = childName.split(' ')[0];
  const ageNumber = age.split(' ')[0];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden animate-fadeUp flex flex-col md:flex-row min-h-[500px]">

        {/* Top Close (Absolute) */}
        <div className="absolute top-0 left-0 w-full flex justify-end items-center p-6 z-20 pointer-events-none">
          <div className="pointer-events-auto">
            <button
              onClick={onClose}
              className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-all text-slate-500"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Left Content */}
        <div className="flex-1 p-8 md:p-12 pt-20 flex flex-col justify-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-medium text-slate-700 dark:text-slate-200 tracking-tight leading-tight mb-2">
            Happy <br />
            <span className={`font-serif italic text-5xl md:text-6xl ${primaryColor}`}>Birthday!</span>
          </h2>

          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-6 mb-4">
            Dear {shortName},
          </h3>

          <div className="space-y-4 text-slate-600 dark:text-slate-300 font-medium text-sm leading-relaxed max-w-md">
            <p>
              Your smile makes our <span className="font-bold tracking-tighter text-slate-800 dark:text-slate-100" style={{ fontFamily: "'Nunito', sans-serif" }}>Little<span style={{ color: '#06C5D4' }}>Sparks</span></span> family brighter every day. Keep being curious, kind, and wonderful just the way you are.
            </p>
            <p>
              We are so happy to watch you learn and grow, and we hope your special day is filled with lots of love, laughter, and happy little moments.
            </p>

            <div className="pt-4">
              <p>Happy Birthday, little star! {isFemale ? '💖' : '💙'}</p>
              <p className="font-bold mt-1">With love,</p>
              <p className="font-bold flex items-center gap-2 text-lg">
                <span className="font-bold tracking-tighter text-slate-800 dark:text-slate-100" style={{ fontFamily: "'Nunito', sans-serif" }}>Little<span style={{ color: '#06C5D4' }}>Sparks</span></span>

              </p>
            </div>
          </div>

          {/* Bottom Button */}
          <button
            onClick={onClose}
            className={`mt-10 w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${buttonBg}`}
          >
            <Gift size={18} />
            Enjoy your special day!
          </button>
        </div>

        {/* Right Content - Photo Area */}
        <div className={`flex-1 ${bgColor} p-8 pt-20 relative flex flex-col items-center justify-center overflow-hidden min-h-[400px]`}>

          {/* Decorative shapes */}
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/50 dark:bg-slate-800/50 rounded-full blur-2xl" />

          {/* Photo inside circle */}
          <div className="relative mb-8">
            <div className="w-56 h-56 rounded-full bg-white dark:bg-slate-800 p-2 shadow-xl relative z-10">
              <img
                src={profilePic || 'https://via.placeholder.com/400'}
                alt={childName}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            {/* Background Blob/Circle behind photo */}
            <div className={`absolute inset-[-10%] rounded-full opacity-20 blur-xl ${isFemale ? 'bg-pink-400' : 'bg-blue-400'}`} />
          </div>

          {/* Ribbon Name */}
          <div className="relative z-20 -mt-16 mb-6">
            <div className={`${ribbonColor} text-white px-10 py-3 shadow-lg relative rounded-sm`}>
              {/* Ribbon tails */}
              <div className={`absolute top-0 -left-4 w-6 h-full ${ribbonColor} brightness-75 skew-x-12 -z-10`} />
              <div className={`absolute top-0 -right-4 w-6 h-full ${ribbonColor} brightness-75 -skew-x-12 -z-10`} />

              <h3 className="font-serif italic text-3xl">{shortName}</h3>
            </div>
          </div>

          {/* Turns Age */}
          <div className="text-center relative z-20">
            <p className="text-slate-500 font-bold tracking-widest uppercase text-sm mb-1">Turns</p>
            <div className="flex items-center justify-center gap-4">
              <span className={`text-3xl font-light ${highlightText}`}>-</span>
              <span className={`text-6xl font-black ${highlightText} leading-none`}>{ageNumber}</span>
              <span className={`text-3xl font-light ${highlightText}`}>-</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
