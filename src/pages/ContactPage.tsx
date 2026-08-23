import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useInView } from 'framer-motion';
import { Button } from '../components/common/Button';
import { Logo } from '../components/common/Logo';
import { Mail, Phone, MapPin, Send, Globe } from 'lucide-react';

/* ─────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────── */
const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  direction?: 'up' | 'left' | 'right' | 'scale';
  delay?: number;
  className?: string;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const variants: Record<string, any> = {
    up: { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } },
  };
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants[direction]}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ duration: 0.7, delay, ease: [0.215, 0.61, 0.355, 1] }}
    >
      {children}
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   CONTACT INFO CARD
───────────────────────────────────────── */
const ContactInfoCard = ({
  icon,
  title,
  detail,
  subDetail,
  bgColor,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  subDetail: string;
  bgColor: string;
}) => (
  <div className="flex items-center gap-5 p-5 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-100 dark:border-slate-800/60 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className={`h-14 w-14 ${bgColor} rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
      {icon}
    </div>
    <div>
      <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{title}</h4>
      <p className="text-base font-black text-slate-800 dark:text-slate-200 leading-tight mb-0.5">{detail}</p>
      <p className="text-xs text-slate-500">{subDetail}</p>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: pageRef });
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-white dark:bg-[#0f172a] font-sans text-slate-800 dark:text-slate-200 overflow-x-hidden">

      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 h-1 z-[100] origin-left"
        style={{ scaleX: scrollYProgress, background: 'linear-gradient(90deg, #06B6D4, #a78bfa)' }}
      />

      {/* ── Navbar ── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5"
        style={{ background: 'linear-gradient(135deg, rgba(13,41,82,0.95) 0%, rgba(10,6,32,0.95) 60%, rgba(15,50,100,0.90) 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center py-4">
          <motion.div className="cursor-pointer" onClick={() => navigate('/')}>
            <Logo variant="light" iconClassName="w-10 h-10" textClassName="text-2xl" />
          </motion.div>
          <nav className="hidden md:flex items-center gap-8">
            {['home', 'why', 'features', 'discover'].map((item) => (
              <button
                key={item}
                className="text-blue-200/80 hover:text-white transition-colors text-sm font-semibold capitalize tracking-wide"
                onClick={() => { if (item === 'home') navigate('/'); else navigate(`/#${item}`); }}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </nav>
          <div className="flex gap-4 items-center">
            <Link className="text-blue-200/80 hover:text-white transition-colors font-semibold text-sm" to="/login">
              Log In
            </Link>
            <Button
              variant="primary"
              className="px-5 py-2.5 rounded-full text-sm font-bold shadow-md shadow-cyan-500/20"
              onClick={() => navigate('/signup-request')}
            >
              Get Started
            </Button>
          </div>
        </div>
      </motion.header>

      {/* ══════════════════════════════════════
          1. HERO SECTION (Boxed - same as About Us)
      ══════════════════════════════════════ */}
      <section className="relative py-12 px-6 lg:px-8 bg-white dark:bg-[#0f172a]">
        <div className="max-w-7xl mx-auto relative bg-[#eef8f8] rounded-3xl overflow-hidden shadow-sm min-h-[380px] flex items-center justify-center py-16 px-6">

          {/* Top Left Cyan Shape */}
          <div className="absolute -left-10 top-16 w-24 h-32 bg-[#00d0b0] transform rotate-12 rounded-sm" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 80%, 0 20%)' }}></div>

          {/* Top Right Red Arch */}
          <div className="absolute -right-8 -top-8 w-56 h-56 border-[48px] border-[#f05060] rounded-full border-l-transparent border-b-transparent transform rotate-[15deg]"></div>

          {/* Bottom Left Yellow Arch */}
          <div className="absolute left-10 -bottom-24 w-64 h-64 border-[48px] border-[#ffd03b] rounded-full" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}></div>

          {/* Bottom Right Green Circle */}
          <div className="absolute right-20 -bottom-12 w-36 h-36 border-[32px] border-[#69d9a0] rounded-full"></div>

          {/* Decorative Marks */}
          <svg className="absolute left-[20%] top-[22%] w-10 h-10 text-slate-800 dark:text-slate-200 transform rotate-12" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M6 18L10 14M12 22V16M18 18L14 14" />
          </svg>
          <svg className="absolute right-[20%] top-[22%] w-10 h-10 text-slate-800 dark:text-slate-200 transform -rotate-[30deg]" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M6 18L10 14M12 22V16M18 18L14 14" />
          </svg>
          <svg className="absolute left-[15%] bottom-[25%] w-10 h-10 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C12 7 17 12 22 12C17 12 12 17 12 22C12 17 7 17 2 12C7 12 12 7 12 2Z" />
          </svg>
          <svg className="absolute right-[10%] bottom-[20%] w-12 h-12 text-slate-800 dark:text-slate-200 transform rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C12 7 17 12 22 12C17 12 12 17 12 22C12 17 7 17 2 12C7 12 12 7 12 2Z" />
            <path d="M19 4C19 6 21 8 23 8C21 8 19 10 19 12C19 10 17 10 15 8C17 8 19 6 19 4Z" />
          </svg>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 dark:text-slate-200 tracking-tight leading-tight mb-5">
              Contact us
            </h1>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              Something on your mind? Need support?<br />Just want to say "Hi"?
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          2. CONTACT CONTENT
      ══════════════════════════════════════ */}
      <section className="py-16 px-6 lg:px-8 bg-white dark:bg-[#0f172a]">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 text-center mb-12">
              We'd love to hear from you!
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Left: Contact Info */}
            <div className="lg:col-span-2 space-y-5">
              <ScrollReveal direction="left" delay={0.1}>
                <ContactInfoCard
                  icon={<Phone size={22} className="text-cyan-600" />}
                  title="Call Us Directly"
                  detail="+94 742062388"
                  subDetail="Mon - Fri, 8am to 5pm"
                  bgColor="bg-cyan-50"
                />
              </ScrollReveal>
              <ScrollReveal direction="left" delay={0.2}>
                <ContactInfoCard
                  icon={<Mail size={22} className="text-blue-600" />}
                  title="Email Support"
                  detail="littlesparks@gmail.com"
                  subDetail="Average response: 2 hours"
                  bgColor="bg-blue-50"
                />
              </ScrollReveal>
              <ScrollReveal direction="left" delay={0.3}>
                <ContactInfoCard
                  icon={<MapPin size={22} className="text-indigo-600" />}
                  title="Visit Our Center"
                  detail="Katubedda, Moratuwa"
                  subDetail="Western Province, Sri Lanka"
                  bgColor="bg-indigo-50"
                />
              </ScrollReveal>
              <ScrollReveal direction="left" delay={0.4}>
                <div className="flex items-center gap-5 p-5 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-100 dark:border-slate-800/60 dark:border-slate-800/60 shadow-sm">
                  <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center justify-center text-slate-400">
                    <Globe size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wider mb-1">Global Standard</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">World-class childcare management.</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-3">
              <ScrollReveal direction="right">
                <div className="bg-white dark:bg-[#0f172a] p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800/60 dark:border-slate-800/60 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-cyan-100/60 to-transparent rounded-full blur-3xl -mr-12 -mt-12"></div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-7 relative z-10">Send us a Message</h3>

                  {success ? (
                    <div className="min-h-[300px] flex flex-col items-center justify-center text-center space-y-4 bg-emerald-50 rounded-2xl border border-emerald-100 p-8">
                      <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200 mb-3 animate-bounce">
                        <Send className="text-white" size={26} />
                      </div>
                      <h4 className="text-xl font-black text-emerald-900">Message Sent!</h4>
                      <p className="text-emerald-700 font-medium text-sm">Thank you for reaching out. Our team will get back to you shortly.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Your Name</label>
                          <input
                            required type="text" name="name"
                            value={formData.name} onChange={handleChange}
                            className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl outline-none focus:border-cyan-400 focus:bg-white dark:bg-[#0f172a] transition-all text-sm text-slate-800"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Email Address</label>
                          <input
                            required type="email" name="email"
                            value={formData.email} onChange={handleChange}
                            className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl outline-none focus:border-cyan-400 focus:bg-white dark:bg-[#0f172a] transition-all text-sm text-slate-800"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Subject</label>
                        <input
                          required type="text" name="subject"
                          value={formData.subject} onChange={handleChange}
                          className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl outline-none focus:border-cyan-400 focus:bg-white dark:bg-[#0f172a] transition-all text-sm text-slate-800"
                          placeholder="How can we help?"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Message</label>
                        <textarea
                          required name="message"
                          value={formData.message} onChange={handleChange}
                          rows={5}
                          className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl outline-none focus:border-cyan-400 focus:bg-white dark:bg-[#0f172a] transition-all text-sm text-slate-800 dark:text-slate-200 resize-none"
                          placeholder="Write your message here..."
                        ></textarea>
                      </div>
                      <Button
                        type="submit" variant="primary" disabled={isSubmitting}
                        className="w-full py-4 rounded-xl shadow-md shadow-cyan-500/20 text-sm font-bold tracking-wide"
                      >
                        {isSubmitting ? 'Sending Message...' : 'Send Message'}
                      </Button>
                    </form>
                  )}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          3. FOOTER
      ══════════════════════════════════════ */}
      <footer className="bg-[#060413] text-white py-16 px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12 items-start">
            <div className="col-span-1">
              <Logo variant="light" iconClassName="w-10 h-10" textClassName="text-xl" />
              <p className="text-slate-500 dark:text-slate-400 mt-4 text-sm leading-relaxed">
                Simplifying childcare management for the next generation of educators.
              </p>
            </div>
            <div>
              <div className="mb-5">
                <h4 className="font-bold text-white text-sm uppercase tracking-widest">Resources</h4>
                <div className="w-12 h-1 bg-[#f05060] mt-3 rounded-full"></div>
              </div>
              <Link to="/signup-request" className="text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-colors block mb-3 text-sm">Getting Started</Link>
              <Link to="/billing" className="text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-colors block mb-3 text-sm">Pricing</Link>
            </div>
            <div>
              <div className="mb-5">
                <h4 className="font-bold text-white text-sm uppercase tracking-widest">Features</h4>
                <div className="w-12 h-1 bg-[#f05060] mt-3 rounded-full"></div>
              </div>
              <span className="text-slate-500 dark:text-slate-400 block mb-3 text-sm font-medium cursor-default">Billing/Payments</span>
              <span className="text-slate-500 dark:text-slate-400 block mb-3 text-sm font-medium cursor-default">Payroll</span>
              <span className="text-slate-500 dark:text-slate-400 block mb-3 text-sm font-medium cursor-default">Feature Overview</span>
              <span className="text-slate-500 dark:text-slate-400 block mb-3 text-sm font-medium cursor-default">Attendance tracking</span>
              <span className="text-slate-500 dark:text-slate-400 block mb-3 text-sm font-medium cursor-default">Communication</span>
              <span className="text-slate-500 dark:text-slate-400 block mb-3 text-sm font-medium cursor-default">Center Management</span>
              <span className="text-slate-500 dark:text-slate-400 block mb-3 text-sm font-medium cursor-default">Daily Activity Report</span>
              <span className="text-slate-500 dark:text-slate-400 block mb-3 text-sm font-medium cursor-default">Meal Planning</span>
              <span className="text-slate-500 dark:text-slate-400 block text-sm font-medium cursor-default">Lesson Plans</span>
            </div>
            <div>
              <div className="mb-5">
                <h4 className="font-bold text-white text-sm uppercase tracking-widest">Company</h4>
                <div className="w-12 h-1 bg-[#f05060] mt-3 rounded-full"></div>
              </div>
              <Link to="/about" className="text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-colors block mb-3 text-sm">About Us</Link>
              <Link to="/contact" className="text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-colors block text-sm">Contact Support</Link>
            </div>
          </div>
          <div className="text-center text-slate-600 dark:text-slate-300 border-t border-white/5 pt-8 text-sm">
            ©2026 LittleSparks.com — All rights reserved
          </div>
        </div>
      </footer>

    </div>
  );
};

export default ContactPage;
