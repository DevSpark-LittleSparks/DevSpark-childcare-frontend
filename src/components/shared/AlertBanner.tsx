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
        initial={{ y: -20, opacity: 0, height: 0, marginBottom: 0 }}
        animate={{ y: 0, opacity: 1, height: 'auto', marginBottom: 24 }}
        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
        className="px-6 max-w-7xl mx-auto"
      >
        <div className="w-full pointer-events-auto flex justify-center">
          <motion.div
            layout
            className={`relative overflow-hidden rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border backdrop-blur-xl w-full max-w-3xl ${
              isHighPriority
                ? 'bg-white/95 dark:bg-slate-900/95 border-amber-200 dark:border-amber-900/50'
                : 'bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-800/80'
              }`}
          >
            {/* Subtle Accent Line */}
            <div className={`absolute top-0 left-0 w-full h-1 ${isHighPriority ? 'bg-amber-400' : 'bg-cyan-500'}`} />

            <div className="px-6 py-4 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative shrink-0">
                  <div className={`p-3 rounded-2xl ${isHighPriority ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-cyan-100 dark:bg-cyan-900/30'}`}>
                    {isHighPriority ? (
                      <AlertTriangle className={`w-6 h-6 ${isHighPriority ? 'text-amber-500 dark:text-amber-400' : 'text-slate-600'} animate-pulse`} />
                    ) : (
                      <Megaphone className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                    )}
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`font-bold text-[11px] tracking-wider uppercase ${isHighPriority ? 'text-amber-600 dark:text-amber-500' : 'text-cyan-600 dark:text-cyan-500'}`}>
                      {current.title || (isHighPriority ? 'Important Notice' : 'Announcement')}
                    </span>
                    {notifications.length > 1 && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                        {currentIndex + 1} of {notifications.length}
                      </span>
                    )}
                  </div>
                  <p className="text-[14px] font-medium leading-relaxed text-slate-700 dark:text-slate-200">
                    {current.body}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-6 shrink-0">
                {notifications.length > 1 && (
                  <button
                    onClick={nextAlert}
                    className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 active:scale-95"
                  >
                    <span className="text-xs font-bold">Next</span>
                    <Bell className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 active:scale-90"
                  title="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AlertBanner;
