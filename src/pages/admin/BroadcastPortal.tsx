import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Megaphone, Send, Target, AlertCircle, CheckCircle2, Loader2, History, ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiClient } from '../../services/axiosInstance';
import { Button } from '../../components/common/Button';

const BroadcastPortal: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [targetType, setTargetType] = useState<'ALL' | 'PARENT' | 'TEACHER'>('ALL');
  const [priority, setPriority] = useState<'HIGH' | 'NORMAL'>('NORMAL');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      // Send global alerts
      await apiClient.post('/api/v1/auth/admin/broadcast', {
        title,
        body,
        priority,
        targetType
      });

      setStatus('success');
      setTitle('');
      setBody('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error("Broadcast failed:", err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const getLiveStatus = () => {
    if (loading) return { text: 'Transmitting...', color: 'text-amber-500', dot: 'bg-amber-500' };
    if (status === 'success') return { text: 'Sent', color: 'text-primary-500', dot: 'bg-primary-500' };
    if (status === 'error') return { text: 'Failed', color: 'text-rose-500', dot: 'bg-rose-500' };
    return { text: 'Ready', color: 'text-emerald-500', dot: 'bg-emerald-500' };
  };
  
  const currentStatus = getLiveStatus();

  return (
    <div className="min-h-screen w-full bg-surface-secondary dark:bg-slate-950 transition-colors duration-300 font-sans text-slate-900 dark:text-slate-100 pb-10">

      {/* --- HEADER SECTION --- */}
      <header className="max-w-7xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-white dark:bg-[#0f172a] rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/60 dark:border-slate-800/60 hover:bg-slate-50 dark:bg-slate-800/40 dark:hover:bg-slate-800/50 transition-all group"
          >
            <ArrowLeft className="text-slate-400 dark:text-slate-500 dark:text-slate-400 group-hover:text-primary-500" size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-0.5 text-primary-500">

            </div>

          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          <div className="bg-white dark:bg-[#0f172a] px-6 py-2.5 rounded-2xl border border-slate-100 dark:border-slate-800/60 dark:border-slate-800/60 shadow-sm flex flex-col items-center min-w-[120px]">
            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Live Status</span>
            <span className={`text-sm font-black ${currentStatus.color} leading-none flex items-center gap-1.5 mt-1`}>
              <span className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot} animate-pulse`}></span>
              {currentStatus.text}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeUp">

        {/* Form Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-[#0f172a] rounded-[3rem] p-8 md:p-12 shadow-[0_20px_60px_rgba(10,6,55,0.03)] border border-slate-100 dark:border-slate-800/60 dark:border-slate-800/60">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-10 w-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500">
                <Megaphone size={20} />
              </div>
              <h2 className="text-xl font-black text-midnight dark:text-white uppercase tracking-tight">Compose Announcement</h2>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-8">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-500 dark:text-slate-400">Announcement Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., School Closure Notice"
                  className="w-full p-4 rounded-2xl outline-none text-sm font-bold transition-all bg-slate-100 dark:bg-slate-800/40 border-2 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-[#0f172a] text-midnight dark:text-white shadow-sm placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-500 dark:text-slate-400">Message Content</label>
                <textarea
                  required
                  rows={5}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Type your detailed message here..."
                  className="w-full p-4 rounded-2xl outline-none text-sm font-bold transition-all bg-slate-100 dark:bg-slate-800/40 border-2 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-[#0f172a] text-midnight dark:text-white shadow-sm placeholder:text-slate-400 resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-500 dark:text-slate-400">Target Audience</label>
                  <select
                    value={targetType}
                    onChange={(e) => setTargetType(e.target.value as any)}
                    className="w-full p-4 rounded-2xl outline-none text-sm font-bold transition-all bg-slate-100 dark:bg-slate-800/40 border-2 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-[#0f172a] text-midnight dark:text-white shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="ALL">Everyone</option>
                    <option value="PARENT">Parents Only</option>
                    <option value="TEACHER">Teachers Only</option>
                  </select>
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-500 dark:text-slate-400">Priority Level</label>
                  <div className="flex bg-slate-100 dark:bg-slate-800/40 p-1.5 rounded-2xl border-2 border-transparent shadow-sm">
                    <button
                      type="button"
                      onClick={() => setPriority('NORMAL')}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${priority === 'NORMAL' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-500' : 'text-slate-400 dark:text-slate-500'
                        }`}
                    >
                      Normal
                    </button>
                    <button
                      type="button"
                      onClick={() => setPriority('HIGH')}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${priority === 'HIGH' ? 'bg-white dark:bg-slate-700 shadow-sm text-rose-500' : 'text-slate-400 dark:text-slate-500'
                        }`}
                    >
                      High
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  isLoading={loading}
                  variant="primary"
                  className="w-full py-6 rounded-[2rem] text-sm uppercase tracking-[0.2em] font-black flex items-center justify-center gap-3 shadow-xl shadow-primary-500/20"
                >
                  <Send className="w-5 h-5" />
                  Transmitting Broadcast
                </Button>
              </div>
            </form>

            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-5 rounded-[1.5rem] bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-4 font-bold text-sm"
              >
                <div className="p-2 bg-white dark:bg-[#0f172a] rounded-full">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                Broadcast successfully transmitted to users.
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-5 rounded-[1.5rem] bg-rose-50 text-rose-700 border border-rose-100 flex items-center gap-4 font-bold text-sm"
              >
                <div className="p-2 bg-white dark:bg-[#0f172a] rounded-full">
                  <AlertCircle className="w-5 h-5" />
                </div>
                Transmission failed. Please check your connection.
              </motion.div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="bg-midnight rounded-[3rem] p-8 md:p-12 text-white shadow-[0_20px_60px_rgba(10,6,55,0.03)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

            <h3 className="text-lg font-black mb-8 flex items-center gap-3 tracking-tight uppercase">
              <History className="w-5 h-5 text-primary-500" />
              Communication Guidelines
            </h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                <p className="text-slate-400 dark:text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                  <span className="text-white font-bold">High Priority</span> alerts will be highlighted in <span className="text-rose-400">red</span> for all targeted users.
                </p>
              </li>
              <li className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                <p className="text-slate-400 dark:text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                  Broadcasts are <span className="text-white font-bold">real-time</span>. Use them for urgent school closures or event updates.
                </p>
              </li>
              <li className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                <p className="text-slate-400 dark:text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                  Targeting <span className="text-white font-bold">"Everyone"</span> ensures both parents and staff receive the alert.
                </p>
              </li>
            </ul>

            <div className="mt-12 pt-8 border-t border-white/5">
              <div className="p-6 bg-white dark:bg-[#0f172a]/5 rounded-3xl border border-white/10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 mb-2">Security Audit</p>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  All broadcasts are logged with administrator credentials for audit trails.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BroadcastPortal;
