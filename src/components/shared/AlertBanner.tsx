import React, { useState, useEffect } from 'react';
import { Bell, X, Info, AlertTriangle, Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  title: string;
  body: string;
  priority: 'HIGH' | 'NORMAL';
  type: 'BROADCAST' | 'SYSTEM';
  createdAt: string;
}

interface AlertBannerProps {
  notifications: Notification[];
  onRead?: (id: string) => void;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ notifications, onRead }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (notifications.length === 0) return null;

  // Clamp index in case notifications shrink after a dismiss
  const safeIndex = Math.min(currentIndex, notifications.length - 1);
  const current = notifications[safeIndex];
  const isHighPriority = current.priority === 'HIGH';

  const handleClose = () => {
    if (onRead && current?.id) {
      onRead(current.id);
    }
  };

  const nextAlert = () => {
    setCurrentIndex((prev) => (prev + 1) % notifications.length);
    // Reset to 0 if out of bounds after dismissals
    if (safeIndex >= notifications.length - 1) setCurrentIndex(0);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        className="fixed top-20 left-0 right-0 z-[40] px-4 pointer-events-none"
      >
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <motion.div
            layout
            className={`relative overflow-hidden rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl ${isHighPriority
              ? 'bg-gradient-to-br from-rose-600/90 via-red-600/90 to-orange-600/90'
              : 'bg-gradient-to-br from-indigo-600/90 via-blue-600/90 to-cyan-600/90'
              } text-white`}
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-black/10 rounded-full blur-3xl" />

            <div className="px-6 py-4 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-5 flex-1">
                <div className="relative">
                  <div className={`p-3 rounded-2xl bg-white/20 backdrop-blur-md shadow-xl border border-white/30`}>
                    {isHighPriority ? (
                      <AlertTriangle className="w-6 h-6 text-white animate-bounce" />
                    ) : (
                      <Megaphone className="w-6 h-6 text-white" />
                    )}
                  </div>
                  {isHighPriority && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-0.5">
                    <span className="font-extrabold text-xs tracking-widest uppercase text-white/80">
                      {current.title || (isHighPriority ? 'Urgent Update' : 'Announcement')}
                    </span>
                    {notifications.length > 1 && (
                      <span className="px-2 py-0.5 rounded-full bg-black/20 text-[10px] font-bold border border-white/10">
                        {currentIndex + 1} of {notifications.length}
                      </span>
                    )}
                  </div>
                  <p className="text-base font-semibold leading-relaxed tracking-wide">
                    {current.body}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-6">
                {notifications.length > 1 && (
                  <button
                    onClick={nextAlert}
                    className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 active:scale-95"
                  >
                    <span className="text-sm font-bold">Next</span>
                    <Bell className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="p-2.5 rounded-xl bg-black/10 hover:bg-black/20 transition-all border border-white/5 active:scale-90"
                  title="Dismiss"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Progress Bar for High Priority */}
            {isHighPriority && (
              <div className="h-1 w-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="h-full bg-white/40"
                />
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AlertBanner;
