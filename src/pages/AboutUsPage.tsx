import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  motion,
  useScroll,
  useInView,
} from 'framer-motion';
import { Button } from '../components/common/Button';
import { Logo } from '../components/common/Logo';
import {
  Users,
  Leaf,
  Scale,
  ArrowRight,
  Zap
} from 'lucide-react';

import member1 from '../assets/images/member1.jpeg';
import member2 from '../assets/images/member2.jpeg';
import member3 from '../assets/images/member3.jpeg';
import member4 from '../assets/images/member4.jpeg';

/* ─────────────────────────────────────────
   1. STAGGERED REVEAL ANIMATIONS
───────────────────────────────────────── */
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] } },
};

const StaggerReveal = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {children}
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   2. SCROLL REVEAL WRAPPER
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
   3. TEAM MEMBER CARD
───────────────────────────────────────── */
const TeamMember = ({
  name,
  role,
  image
}: {
  name: string;
  role: string;
  image: string;
}) => (
  <motion.div
    className="group flex flex-col items-center text-center"
  >
    <div className="relative w-48 h-48 rounded-full overflow-hidden mb-6 shadow-xl shadow-slate-200 group-hover:shadow-cyan-500/20 border-4 border-white transition-shadow duration-500">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
    </div>
    <h4 className="text-lg font-black text-slate-800 tracking-tight font-sans mb-1">{name}</h4>
    <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest">{role}</p>
  </motion.div>
);

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const AboutUsPage: React.FC = () => {
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: pageRef });

  return (
    <div ref={pageRef} className="min-h-screen bg-white font-sans text-slate-800 overflow-x-hidden">

      {/* ── Scroll progress bar ── */}
      <motion.div
        className="fixed top-0 left-0 h-1 z-[100] origin-left"
        style={{
          scaleX: scrollYProgress,
          background: 'linear-gradient(90deg, #06B6D4, #a78bfa)',
        }}
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
                onClick={() => {
                  if (item === 'home') navigate('/');
                  else navigate(`/#${item}`);
                }}
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
          1. HERO SECTION 
      ══════════════════════════════════════ */}
      <section className="relative py-12 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto relative bg-[#eef8f8] rounded-3xl overflow-hidden shadow-sm min-h-[500px] flex items-center justify-center py-20 px-6">

          {/* Top Left Cyan Shape */}
          <div className="absolute -left-10 top-20 w-24 h-32 bg-[#00d0b0] transform rotate-12 rounded-sm" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 80%, 0 20%)' }}></div>

          {/* Top Right Red Arch */}
          <div className="absolute -right-8 -top-8 w-56 h-56 border-[48px] border-[#f05060] rounded-full border-l-transparent border-b-transparent transform rotate-[15deg]"></div>

          {/* Bottom Left Yellow Arch */}
          <div className="absolute left-10 -bottom-24 w-64 h-64 border-[48px] border-[#ffd03b] rounded-full" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}></div>

          {/* Bottom Right Green Circle */}
          <div className="absolute right-20 -bottom-12 w-36 h-36 border-[32px] border-[#69d9a0] rounded-full"></div>

          {/* Decorative Marks */}
          {/* Top Left Small Lines */}
          <svg className="absolute left-[20%] top-[25%] w-10 h-10 text-slate-800 transform rotate-12" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M6 18L10 14M12 22V16M18 18L14 14" />
          </svg>
          {/* Top Right Small Lines */}
          <svg className="absolute right-[20%] top-[25%] w-10 h-10 text-slate-800 transform -rotate-[30deg]" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M6 18L10 14M12 22V16M18 18L14 14" />
          </svg>
          {/* Bottom Left Sparkle */}
          <svg className="absolute left-[15%] bottom-[30%] w-10 h-10 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C12 7 17 12 22 12C17 12 12 17 12 22C12 17 7 17 2 12C7 12 12 7 12 2Z" />
          </svg>
          {/* Bottom Right Sparkle */}
          <svg className="absolute right-[10%] bottom-[20%] w-12 h-12 text-slate-800 transform rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C12 7 17 12 22 12C17 12 12 17 12 22C12 17 7 17 2 12C7 12 12 7 12 2Z" />
            <path d="M19 4C19 6 21 8 23 8C21 8 19 10 19 12C19 10 17 10 15 8C17 8 19 6 19 4Z" />
          </svg>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 tracking-tight leading-tight mb-6">
              About Us<br className="hidden md:block" />

            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mb-10 px-4">
              Want to know a lil' more about LittleSparks? Discover the "why" behind our mission and meet the amazing team who makes it possible.
            </p>
            <Button
              variant="primary"
              className="bg-[#ffd03b] hover:bg-[#f0c020] text-slate-900 border-none px-8 py-3 rounded-md text-lg font-bold shadow-sm"
              onClick={() => navigate('/contact')}
            >
              Get In Touch
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          2. WHAT INSPIRES US
      ══════════════════════════════════════ */}
      <section className="py-20 relative bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal direction="up">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 text-center mb-16 tracking-tight">
              What inspires us
            </h2>
          </ScrollReveal>

          <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <motion.div variants={staggerItem} className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-xl bg-[#00d0b0] flex items-center justify-center mb-6 shadow-sm">
                <Leaf size={40} className="text-white" strokeWidth={1.5} />
              </div>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed px-4">
                The first five years of a child's life are the most critical for physical, intellectual, and social emotional development.
              </p>
            </motion.div>

            <motion.div variants={staggerItem} className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-xl bg-[#ffd03b] flex items-center justify-center mb-6 shadow-sm">
                <Scale size={40} className="text-slate-800" strokeWidth={1.5} />
              </div>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed px-4">
                The field of early childhood education deserves resources and support worthy of the importance of this time in child development and learning.
              </p>
            </motion.div>

            <motion.div variants={staggerItem} className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-xl bg-[#f05060] flex items-center justify-center mb-6 shadow-sm">
                <Users size={40} className="text-white" strokeWidth={1.5} />
              </div>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed px-4">
                Early childhood educators are doing some of the most important work there is in nurturing and caring for the next generation of lifelong learners.
              </p>
            </motion.div>
          </StaggerReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════
          3. OUR BUILDING BLOCKS (VISION & MISSION)
      ══════════════════════════════════════ */}
      <section className="py-20 relative bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 text-center mb-16 tracking-tight">
              Our Building Blocks
            </h2>
          </ScrollReveal>

          <div className="flex flex-col gap-10">
            {/* Our Vision Block */}
            <ScrollReveal direction="up">
              <div className="relative bg-[#fefaf0] p-12 md:p-20 rounded-xl shadow-sm overflow-hidden text-center flex flex-col items-center justify-center min-h-[350px]">
                {/* Decorative Elements */}
                <svg className="absolute left-10 top-1/2 -translate-y-1/2 w-16 h-16 text-yellow-400 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>

                <h3 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-4">
                  Our Vision
                </h3>
                <p className="text-slate-600 text-base md:text-lg max-w-2xl">
                  We believe early childhood educators have the power to change children’s lives and ultimately, the world.
                </p>
              </div>
            </ScrollReveal>

            {/* Our Mission Block */}
            <ScrollReveal direction="up">
              <div className="relative bg-[#e8f5ee] p-12 md:p-20 rounded-xl shadow-sm overflow-hidden text-center flex flex-col items-center justify-center min-h-[350px]">
                {/* Decorative Red Triangle on the right */}
                <div className="absolute -right-8 top-10 w-24 h-24 bg-[#f05060] rotate-45 transform origin-center" />

                <h3 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-4">
                  Our Mission
                </h3>
                <p className="text-slate-600 text-base md:text-lg max-w-3xl">
                  To elevate early childhood programs with innovative design, quality content, and professional growth opportunities, delivering joyful learning experiences for all children.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          4. LEADERSHIP TEAM SECTION
      ══════════════════════════════════════ */}
      <section className="py-24 relative bg-slate-50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 text-center mb-16 tracking-tight">
              Meet Our Team
            </h2>
          </ScrollReveal>

          <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            <TeamMember name="Senuri Werangana" role="" image={member1} />
            <TeamMember name="Anjana Jayamaha" role="" image={member2} />
            <TeamMember name="Agnes Ostina" role="" image={member3} />
            <TeamMember name="Kavindu Welagedara" role="" image={member4} />
          </StaggerReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════
          5. FOOTER
      ══════════════════════════════════════ */}
      <footer className="bg-[#060413] text-white py-16 px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12 items-start">
            <div className="col-span-1">
              <Logo variant="light" iconClassName="w-10 h-10" textClassName="text-xl" />
              <p className="text-slate-500 mt-4 text-sm leading-relaxed">
                Simplifying childcare management for the next generation of educators.
              </p>
            </div>
            <div>
              <div className="mb-5">
                <h4 className="font-bold text-white text-sm uppercase tracking-widest">Resources</h4>
                <div className="w-12 h-1 bg-[#f05060] mt-3 rounded-full"></div>
              </div>
              <Link to="/signup-request" className="text-slate-500 hover:text-primary-500 transition-colors block mb-3 text-sm">Getting Started</Link>
              <Link to="/billing" className="text-slate-500 hover:text-primary-500 transition-colors block mb-3 text-sm">Pricing</Link>
            </div>
            <div>
              <div className="mb-5">
                <h4 className="font-bold text-white text-sm uppercase tracking-widest">Features</h4>
                <div className="w-12 h-1 bg-[#f05060] mt-3 rounded-full"></div>
              </div>
              <span className="text-slate-500 block mb-3 text-sm font-medium cursor-default">Billing/Payments</span>
              <span className="text-slate-500 block mb-3 text-sm font-medium cursor-default">Payroll</span>
              <span className="text-slate-500 block mb-3 text-sm font-medium cursor-default">Feature Overview</span>
              <span className="text-slate-500 block mb-3 text-sm font-medium cursor-default">Attendance tracking</span>
              <span className="text-slate-500 block mb-3 text-sm font-medium cursor-default">Communication</span>
              <span className="text-slate-500 block mb-3 text-sm font-medium cursor-default">Center Management</span>
              <span className="text-slate-500 block mb-3 text-sm font-medium cursor-default">Daily Activity Report</span>
              <span className="text-slate-500 block mb-3 text-sm font-medium cursor-default">Meal Planning</span>
              <span className="text-slate-500 block text-sm font-medium cursor-default">Lesson Plans</span>
            </div>
            <div>
              <div className="mb-5">
                <h4 className="font-bold text-white text-sm uppercase tracking-widest">Company</h4>
                <div className="w-12 h-1 bg-[#f05060] mt-3 rounded-full"></div>
              </div>
              <Link to="/about" className="text-slate-500 hover:text-primary-500 transition-colors block mb-3 text-sm">About Us</Link>
              <Link to="/contact" className="text-slate-500 hover:text-primary-500 transition-colors block text-sm">Contact Support</Link>
            </div>
          </div>
          <div className="text-center text-slate-600 border-t border-white/5 pt-8 text-sm">
            ©2026 LittleSparks.com — All rights reserved
          </div>
        </div>
      </footer>

    </div>
  );
};

export default AboutUsPage;
