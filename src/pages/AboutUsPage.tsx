import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import { Button } from '../components/common/Button';
import { Logo } from '../components/common/Logo';
import { Heart, Target, Users, Sparkles, ShieldCheck, Globe } from 'lucide-react';
import aboutImg from '../assets/images/aboutus.jpg';
import member1 from '../assets/images/member1.jpeg';
import member2 from '../assets/images/member2.jpeg';
import member3 from '../assets/images/member3.jpeg';
import member4 from '../assets/images/member4.jpeg';

/* ─────────────────────────────────────────
   1. LETTER-BY-LETTER ANIMATED HEADING
───────────────────────────────────────── */
const AnimatedLetters = ({
  text,
  className = '',
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
          initial={{ opacity: 0, y: 40, rotateX: -90 }}
          animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.035,
            ease: [0.215, 0.61, 0.355, 1],
          }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

/* ─────────────────────────────────────────
   2. TEXT REVEAL (clip-path wipe)
───────────────────────────────────────── */
const TextReveal = ({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-5% 0px' });
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: '100%' }}
        animate={inView ? { y: '0%' } : {}}
        transition={{ duration: 0.75, delay, ease: [0.76, 0, 0.24, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────────────
   3. STAGGERED REVEAL CONTAINER
───────────────────────────────────────── */
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
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
   4. HERO CAROUSEL SLIDES
───────────────────────────────────────── */
const heroSlides = [
  {
    badge: 'Our Mission & Journey',
    heading1: 'Empowering The Next',
    heading2: 'Generation Of Learners.',
    sub: 'LittleSparks is more than just a management tool. We are a dedicated team on a mission to simplify early childhood education.',
    emoji: '🌟',
    gradient: 'linear-gradient(135deg, #e0f7ff 0%, #cffafe 50%, #e0f2fe 100%)',
  },
  {
    badge: 'Built With Love',
    heading1: 'Every Child Deserves',
    heading2: 'The Best Start In Life.',
    sub: 'We build technology that frees educators from admin work — giving them more time for what truly matters: the children.',
    emoji: '💛',
    gradient: 'linear-gradient(135deg, #fef9c3 0%, #fce7f3 50%, #ede9fe 100%)',
  },
  {
    badge: 'Our Values',
    heading1: 'Trusted By Educators',
    heading2: 'Across The Globe.',
    sub: 'From small family daycares to large learning centers, LittleSparks grows with you and your community.',
    emoji: '🌍',
    gradient: 'linear-gradient(135deg, #d1fae5 0%, #e0f7ff 50%, #ede9fe 100%)',
  },
];

/* ─────────────────────────────────────────
   5. PARALLAX SECTION WRAPPER
───────────────────────────────────────── */
const ParallaxSection = ({
  children,
  offset = 80,
  className = '',
}: {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
};

/* ─────────────────────────────────────────
   6. ON-SCROLL REVEAL WRAPPER
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
    up:    { hidden: { opacity: 0, y: 50 },   visible: { opacity: 1, y: 0 } },
    left:  { hidden: { opacity: 0, x: -60 },  visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 60 },   visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } },
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
   7. TEAM MEMBER CARD
───────────────────────────────────────── */
const TeamMember = ({ name, image }: { name: string; image: string }) => (
  <motion.div
    className="group space-y-4 text-center max-w-[200px] mx-auto"
    whileHover={{ y: -8 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-lg border-4 border-white transition-all duration-500 group-hover:shadow-xl group-hover:border-primary-100">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      {/* Shimmer on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
        whileHover={{ translateX: '200%' }}
        transition={{ duration: 0.6 }}
      />
    </div>
    <h4 className="text-sm font-black text-slate-900 tracking-tight leading-none uppercase">{name}</h4>
  </motion.div>
);

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const AboutUsPage: React.FC = () => {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const [direction, setDir] = useState(1);

  /* Auto-advance carousel */
  useEffect(() => {
    const t = setInterval(() => {
      setDir(1);
      setSlide(s => (s + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  const goTo = (i: number) => {
    setDir(i > slide ? 1 : -1);
    setSlide(i);
  };

  /* Scroll progress for section fade */
  const pageRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: pageRef });

  /* Slide variants */
  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  const current = heroSlides[slide];

  return (
    <div ref={pageRef} className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">

      {/* ── Scroll progress bar ── */}
      <motion.div
        className="fixed top-0 left-0 h-1 z-[100] origin-left"
        style={{
          scaleX: scrollYProgress,
          background: 'linear-gradient(90deg, #06B6D4, #4AC389)',
        }}
      />

      {/* ── Navbar ── */}
      <nav className="sticky top-1 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div
            className="cursor-pointer"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
          >
            <Logo iconClassName="w-10 h-10" textClassName="text-2xl" />
          </motion.div>
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate('/')}
              className="text-sm font-black text-slate-500 hover:text-primary-500 uppercase tracking-widest transition-colors mr-6 hidden md:block"
              whileHover={{ y: -2 }}
            >
              Home
            </motion.button>
            <Button variant="secondary" className="rounded-full px-6" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════
          HERO CAROUSEL / SLIDER
      ══════════════════════════════════════ */}
      <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={slide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
            style={{ background: current.gradient }}
          >
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/5 rounded-full blur-3xl -ml-48 -mb-48 pointer-events-none" />

            {/* Large background emoji */}
            <motion.div
              className="absolute text-[180px] opacity-10 select-none pointer-events-none"
              animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            >
              {current.emoji}
            </motion.div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-600 text-[13px] font-black uppercase tracking-widest mb-8"
            >
              <Sparkles size={14} /> {current.badge}
            </motion.div>

            {/* Letter-by-letter heading */}
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-4 leading-[1.1]">
              <AnimatedLetters text={current.heading1} delay={0.15} />
              <br />
              <AnimatedLetters
                text={current.heading2}
                className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600 italic"
                delay={0.3}
              />
            </h1>

            {/* Text reveal subtitle */}
            <TextReveal delay={0.5} className="max-w-2xl mx-auto mb-10">
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                {current.sub}
              </p>
            </TextReveal>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                variant="primary"
                className="px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary-500/20"
                onClick={() => navigate('/signup-request')}
              >
                Start Your Journey
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Slide dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === slide ? 28 : 8,
                background: i === slide ? '#06B6D4' : '#cbd5e1',
              }}
            />
          ))}
        </div>


      </section>

      {/* ══════════════════════════════════════
          OUR VISION — Parallax + Scroll Reveal
      ══════════════════════════════════════ */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Parallax image side */}
            <ScrollReveal direction="left">
              <div className="relative">
                <ParallaxSection offset={40}>
                  <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl bg-slate-100 border-8 border-white">
                    <img src={aboutImg} alt="Child learning" className="w-full h-full object-cover" />
                  </div>
                </ParallaxSection>

                {/* Floating vision badge — scroll-reveal */}
                <ScrollReveal
                  direction="scale"
                  delay={0.3}
                  className="absolute -bottom-8 -right-8 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-50 max-w-xs hidden md:block z-10"
                >
                  <div className="flex items-center gap-3 mb-3 text-primary-500">
                    <Target size={24} />
                    <span className="text-xs font-black uppercase tracking-widest">Our Vision</span>
                  </div>
                  <p className="text-sm font-bold text-slate-700 italic leading-relaxed">
                    "To be the digital heartbeat of every early learning center worldwide."
                  </p>
                </ScrollReveal>
              </div>
            </ScrollReveal>

            {/* Staggered text side */}
            <StaggerReveal className="space-y-8">
              <motion.div variants={staggerItem}>
                <TextReveal>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                    Built by EDUCATORS, for EDUCATORS.
                  </h2>
                </TextReveal>
              </motion.div>

              <motion.div variants={staggerItem} className="flex gap-6 group">
                <motion.div
                  className="h-14 w-14 shrink-0 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-500"
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <ShieldCheck size={28} />
                </motion.div>
                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">Simplicity &amp; Trust</h4>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">
                    We believe technology should be invisible. Our platform is designed to be
                    intuitive, secure, and reliable, so you can trust us with your most valuable data.
                  </p>
                </div>
              </motion.div>

              <motion.div variants={staggerItem} className="flex gap-6 group">
                <motion.div
                  className="h-14 w-14 shrink-0 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500"
                  whileHover={{ rotate: -12, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <Heart size={28} />
                </motion.div>
                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">Passion for Progress</h4>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">
                    Every update we ship and every feature we build is driven by the feedback
                    of thousands of teachers who use LittleSparks every day.
                  </p>
                </div>
              </motion.div>
            </StaggerReveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          DIVERSITY — Scroll-based transition
      ══════════════════════════════════════ */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <ScrollReveal direction="left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest mb-8">
                <Globe size={14} className="text-primary-400" />
                Inclusion &amp; Equity
              </div>
            </ScrollReveal>

            <TextReveal delay={0.1} className="mb-8">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight italic">
                Celebrating The Importance <br />
                <span className="text-primary-400">Of Diversity.</span>
              </h2>
            </TextReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <p className="text-slate-400 text-lg font-medium leading-relaxed mb-12">
                At LittleSparks, we believe that early childhood is where the seeds of
                inclusion are sown. Our platform is built to support diverse families,
                multicultural curricula, and accessible learning for every child,
                regardless of their background or ability.
              </p>
            </ScrollReveal>

            <StaggerReveal className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {[
                { label: 'Nationalities', value: '30+', color: '#06B6D4' },
                { label: 'Accessible', value: '100%', color: '#4AC389' },
                { label: 'Languages', value: '12+', color: '#a78bfa' },
              ].map(item => (
                <motion.div key={item.label} variants={staggerItem}>
                  <div className="text-2xl font-black mb-1" style={{ color: item.color }}>{item.value}</div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</div>
                </motion.div>
              ))}
            </StaggerReveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TEAM — Staggered + Scale Reveal
      ══════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <ScrollReveal direction="up" className="mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">
              <Users size={14} />
              Our Team
            </div>
            <TextReveal>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4 uppercase">
                Meet Our Leadership
              </h2>
            </TextReveal>
          </ScrollReveal>

          <StaggerReveal className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'Senuri Werangana', image: member1 },
              { name: 'Anjana Jayamaha', image: member2 },
              { name: 'Agnes Ostina', image: member3 },
              { name: 'Kavindu Welagedara', image: member4 },
            ].map(m => (
              <motion.div key={m.name} variants={staggerItem}>
                <TeamMember {...m} />
              </motion.div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA — Parallax + Scale Reveal
      ══════════════════════════════════════ */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollReveal direction="scale">
            <motion.div
              className="bg-primary-500 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-[0_20px_50px_rgba(6,182,212,0.3)]"
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <div
                className="absolute top-0 left-0 w-full h-full opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
              />

              {/* Animated blobs inside CTA */}
              <motion.div
                className="absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl pointer-events-none"
                style={{ background: 'rgba(255,255,255,0.1)' }}
                animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none"
                style={{ background: 'rgba(255,255,255,0.08)' }}
                animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              />

              <div className="relative z-10">
                <TextReveal className="mb-8">
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight italic">
                    Ready to ignite your center?
                  </h2>
                </TextReveal>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    variant="secondary"
                    className="bg-white text-primary-600 hover:bg-slate-50 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs"
                    onClick={() => navigate('/signup-request')}
                  >
                    Join LittleSparks Today
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-16 bg-white border-t border-slate-100 text-center">
        <p className="mt-6 text-slate-400 text-sm font-medium tracking-wide italic">
          "Every spark tells a story. Let's make it beautiful."
        </p>
        <div className="mt-8 pt-8 border-t border-slate-50 max-w-7xl mx-auto">
          <div className="text-center text-gray-500 text-sm">
            ©2026_LittleSparks.com — All rights reserved
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUsPage;
