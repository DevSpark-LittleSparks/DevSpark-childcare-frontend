import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, Zap, Heart, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
} from 'framer-motion';
import land2Img from '../assets/images/land2.jfif';
import land3Img from '../assets/images/land3.jfif';
import land4Img from '../assets/images/land4.png';
import c1Img from '../assets/images/c1.jpg';

// ==========================================
// 1) Logo Component
// ==========================================
interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  variant?: 'light' | 'dark';
}

const LittleSparksLogo: React.FC<LogoProps> = ({
  className = '',
  iconClassName = 'w-10 h-10',
  textClassName = 'text-2xl',
  variant = 'dark',
}) => {
  const isLight = variant === 'light';
  const iconColor = isLight ? '#FFFFFF' : '#1F2937';
  const mainTextColor = isLight ? 'text-white' : 'text-[#1F2937]';
  const sparksColor = '#06C5D4';

  return (
    <div className={`flex items-center gap-0 select-none ${className}`}>
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${iconClassName}`}
        viewBox="0 0 260.000000 280.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <g
          transform="translate(0.000000,280.000000) scale(0.100000,-0.100000)"
          fill={iconColor}
          stroke={iconColor}
          strokeWidth="80"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1270 2460 c-62 -18 -141 -70 -295 -194 -126 -101 -160 -131 -318 -286 -171 -166 -267 -283 -267 -325 0 -26 62 -45 144 -45 103 0 106 -4 106 -138 0 -120 21 -291 46 -385 63 -236 230 -415 457 -491 58 -19 67 -20 67 -3 0 7 -26 21 -59 31 -89 27 -178 83 -262 166 -147 147 -200 301 -220 645 -5 99 -12 181 -15 184 -7 7 -103 19 -159 20 -69 2 -83 12 -65 46 27 50 208 242 357 379 180 165 337 288 433 339 69 38 72 39 120 27 141 -34 446 -280 702 -567 55 -62 113 -130 129 -152 35 -47 33 -48 -82 -57 -67 -6 -83 -11 -94 -28 -9 -15 -14 -87 -18 -266 -4 -214 -7 -253 -26 -311 -52 -164 -186 -288 -370 -343 -78 -23 -207 -21 -283 5 -220 74 -378 314 -378 573 0 189 68 331 175 366 80 26 170 -46 210 -169 16 -49 23 -196 13 -271 -6 -47 17 -35 34 17 32 100 108 185 206 230 127 59 229 -10 201 -135 -30 -137 -171 -257 -335 -285 -43 -7 -64 -16 -64 -25 0 -31 169 12 250 63 147 93 224 277 158 375 -66 98 -242 64 -358 -67 -22 -25 -40 -50 -40 -54 0 -5 -4 -9 -9 -9 -4 0 -11 33 -13 73 -11 146 -79 257 -175 282 -132 34 -222 -53 -268 -259 -70 -313 118 -656 404 -740 175 -51 400 13 541 153 76 76 121 159 140 256 7 33 14 165 17 293 4 158 9 235 17 238 6 2 49 8 95 13 96 10 120 25 100 62 -63 120 -431 489 -639 641 -144 105 -246 147 -310 128z" />
        </g>
      </svg>
      <span
        className={`font-bold tracking-tighter -ml-2 ${mainTextColor} ${textClassName}`}
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        Little<span style={{ color: sparksColor }}>Sparks</span>
      </span>
    </div>
  );
};

// ==========================================
// 2) Animated Text Helpers
// ==========================================
const AnimatedWord: React.FC<{ word: string; delay: number }> = ({ word, delay }) => (
  <motion.span
    className="inline-block mr-[0.3em]"
    initial={{ opacity: 0, y: 40, rotateX: -30 }}
    animate={{ opacity: 1, y: 0, rotateX: 0 }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {word}
  </motion.span>
);

const StaggeredHeadline: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const words = text.split(' ');
  return (
    <h1 className={className} style={{ perspective: '600px' }}>
      {words.map((word, i) => (
        <AnimatedWord key={i} word={word} delay={0.1 + i * 0.12} />
      ))}
    </h1>
  );
};

// ==========================================
// 3) Scroll Reveal Section Wrapper
// ==========================================
const RevealSection: React.FC<{
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right';
}> = ({ children, className, id, delay = 0, direction = 'up' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 60 : 0,
      x: direction === 'left' ? -60 : direction === 'right' ? 60 : 0,
    },
    visible: { opacity: 1, y: 0, x: 0 },
  };

  return (
    <motion.div
      ref={ref}
      id={id}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

// ==========================================
// 4) Hero Carousel
// ==========================================
const heroSlides = [
  {

    img: land2Img,
    objectPosition: 'object-cover object-top',
    overlay: 'from-[#0a0620]/90 via-[#0a0620]/60 to-[#0a0620]/30',
    badge: 'Early Childhood Platform',
    title: 'Every Giggle Every Step. We\'re Here with Care',
    sub: 'LittleSparks helps nurseries manage daily care effortlessly, so educators can focus on what matters most — every child’s happiness and growth.',
    cta: 'Request Form',
  },
  {
    img: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400',
    objectPosition: 'object-cover',
    overlay: 'from-[#0a0620]/95 via-[#0a0620]/75 to-[#0a0620]/50',
    title: 'Every Child Deserves the Best Start',
    sub: 'Simplify nursery management with one organized platform for attendance, communication, reports, and everyday childcare needs.',
    cta: 'Request Form',
  },
  {
    img: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400',
    objectPosition: 'object-cover',
    overlay: 'from-[#0a0620]/90 via-[#0a0620]/60 to-[#0a0620]/30',
    title: 'Safety & Compliance, Effortlessly Managed',
    sub: 'Keep safety - incident reports, and parent communication organized in one secure place , always ready when you need them.',
    cta: 'Request Form',
  },
];

const HeroCarousel: React.FC<{ onCta: (idx: number) => void }> = ({ onCta }) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const paginate = (dir: number) => {
    setDirection(dir);
    setCurrent((prev) => (prev + dir + heroSlides.length) % heroSlides.length);
  };

  useEffect(() => {
    const timer = setInterval(() => paginate(1), 5000);
    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -80 : 80 }),
  };

  const imgVariants = {
    enter: (_dir: number) => ({ opacity: 0, scale: 1.06 }),
    center: { opacity: 1, scale: 1 },
    exit: (_dir: number) => ({ opacity: 0, scale: 1.03 }),
  };

  return (
    <section className="relative min-h-[85vh] flex flex-col overflow-hidden bg-midnight">
      {/* Background image */}
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={`bg-${current}`}
          className="absolute inset-0 z-0"
          custom={direction}
          variants={imgVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.9, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          <img
            src={heroSlides[current].img}
            alt=""
            className={`w-full h-full ${heroSlides[current].objectPosition}`}
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${heroSlides[current].overlay}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0620]/80 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 8 + i * 6,
            height: 8 + i * 6,
            left: `${10 + i * 14}%`,
            top: `${15 + (i % 3) * 25}%`,
            background: i % 2 === 0 ? '#06C5D4' : '#a78bfa',
            opacity: 0.15 + i * 0.05,
          }}
          animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
        />
      ))}

      {/* Text content */}
      <div className="relative z-10 flex-1 max-w-7xl mx-auto px-6 lg:px-8 flex items-center min-h-[85vh]">
        <div className="max-w-2xl">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={`content-${current}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {heroSlides[current].badge && (
                <motion.span
                  className="inline-block text-xs font-black text-primary-500 uppercase tracking-[0.3em] mb-6 bg-cyan-400/10 border border-primary-500/20 px-4 py-2 rounded-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  {heroSlides[current].badge}
                </motion.span>
              )}

              <div className="overflow-hidden">
                <StaggeredHeadline
                  text={heroSlides[current].title}
                  className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight"
                />
              </div>

              <motion.p
                className="text-lg text-slate-300 mb-10 leading-relaxed max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6 }}
              >
                {heroSlides[current].sub}
              </motion.p>

              <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <Button
                  variant="primary"
                  className="px-8 py-4 rounded-full shadow-2xl shadow-cyan-500/20 text-white font-bold"
                  onClick={() => onCta(current)}
                >
                  {heroSlides[current].cta}
                  <ArrowRight size={16} className="ml-2 inline-block" />
                </Button>
                <a
                  href="#why"
                  onClick={(e) => { e.preventDefault(); document.getElementById('why')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="text-slate-400 hover:text-white transition-colors font-semibold text-sm flex items-center gap-2"
                >
                  Explore ↓
                </a>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Carousel controls */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-10 flex items-center gap-6 w-full">
        {/* Dot indicators */}
        <div className="flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              className={`rounded-full transition-all duration-300 ${i === current ? 'w-8 h-2 bg-cyan-400' : 'w-2 h-2 bg-white/30 hover:bg-white/60'}`}
            />
          ))}
        </div>
        <div className="flex-1" />
        {/* Arrow controls */}
        <button
          onClick={() => paginate(-1)}
          className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-white transition-all active:scale-95 backdrop-blur-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => paginate(1)}
          className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-white transition-all active:scale-95 backdrop-blur-sm"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
};

// ==========================================
// 5) Stats Ticker & Parallax Section
// ==========================================
const stats = [
  { val: '500+', label: 'Childcare Centers' },
  { val: '10K+', label: 'Children Enrolled' },
  { val: '98%', label: 'Parent Satisfaction' },
  { val: '40hrs', label: 'Saved Per Month' },
];

const ParallaxSection: React.FC<{ id: string; navigate: (path: string) => void }> = ({ id, navigate }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);

  return (
    <div ref={ref} id={id} className="relative min-h-[450px] flex items-center overflow-hidden bg-midnight">
      <motion.div
        className="absolute inset-0 z-0 w-full h-[130%]"
        style={{ y }}
      >
        <motion.img
          className="w-full h-full object-cover object-top"
          src={land3Img}
          alt=""
          animate={{
            filter: ['brightness(1)', 'brightness(1.15)', 'brightness(1)']
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <div className="absolute inset-0 bg-black/75" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 w-full flex flex-col justify-between min-h-[700px]">
        <RevealSection className="max-w-2xl mt-4">
          <span className="text-xs font-black text-primary-500 uppercase tracking-[0.3em] block mb-4">Why LittleSparks</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight flex flex-wrap items-center gap-3">
            Why Choose <span className="text-primary-500 tracking-tighter" style={{ fontFamily: "'Nunito', sans-serif" }}>LittleSparks</span>?
          </h2>
          <p className="text-lg text-slate-300 mb-10">
            The nursery and childcare management platform that handles almost everything — so your team can focus on what really matters.
          </p>
          <Button
            variant="primary"
            className="px-8 py-4 rounded-full shadow-lg"
            onClick={() => navigate('/learn-more')}
          >
            Learn More
          </Button>
        </RevealSection>

        <div className="mt-auto pt-24 grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
          {stats.map((s, i) => (
            <RevealSection key={s.label} delay={i * 0.15}>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 hover:border-primary-500/30 backdrop-blur-md text-center"
              >
                <motion.div
                  className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-purple-400 mb-1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: i * 0.1 + 0.3 }}
                >
                  {s.val}
                </motion.div>
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{s.label}</div>
              </motion.div>
            </RevealSection>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6) Animated Feature Card
// ==========================================
interface CardProps {
  icon: ReactNode;
  title: string;
  text: string;
  to?: string;
  delay?: number;
}

const Card: React.FC<CardProps> = ({ icon, title, text, to = '#', delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.05, y: -8 }}
    >
      <Link
        to={to}
        className="block bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 hover:border-primary-500/30 transition-all cursor-pointer backdrop-blur-sm"
      >
        <div className="mb-6 w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-xl font-black text-white mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{text}</p>
      </Link>
    </motion.div>
  );
};

// ==========================================
// 6) Main LandingPage
// ==========================================
const featuresData = [
  {
    id: 0,
    icon: <Layers size={28} className="text-primary-500" />,
    title: "All-In-One",
    text: "Every tool you need in a single powerful platform. Attendance, reports, communications — unified.",
  },
  {
    id: 1,
    icon: <Zap size={28} className="text-yellow-400" />,
    title: "Easy to Use",
    text: "Intuitive design that anyone can master in minutes. No training required, no complexity to manage.",
  },
  {
    id: 2,
    icon: <Heart size={28} className="text-pink-400" />,
    title: "Child-Centered",
    text: "Built with children's wellbeing at its core. Every feature designed to enhance child development and safety.",
  }
];

const FeaturesCarousel: React.FC = () => {
  const [active, setActive] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % featuresData.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-6xl mx-auto py-8">
      {featuresData.map((feature, i) => {
        const isActive = i === active;
        return (
          <motion.div
            key={feature.id}
            className="flex-1 w-full cursor-pointer h-full"
            animate={{
              scale: isActive ? 1.05 : 0.95,
              opacity: isActive ? 1 : 0.5,
              y: isActive ? -10 : 0
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            onClick={() => setActive(i)}
          >
            <div className={`h-full bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm transition-colors duration-500 ${isActive ? 'bg-white/10 border-primary-500/50 shadow-2xl' : 'hover:bg-white/10'}`}>
              <div className="mb-6 w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center transition-transform duration-500">
                {feature.icon}
              </div>
              <h3 className="text-xl font-black text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">{feature.text}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const scrollTo = (id: string): void => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleHeroCta = (idx: number) => {
    if (idx === 0) navigate('/signup-request');
    else if (idx === 1) navigate('/signup-request');
    else scrollTo('safety');
  };

  return (
    <div className="lp min-h-screen bg-midnight font-sans">
      {/* ===== NAVBAR ===== */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5"
        style={{ background: 'linear-gradient(135deg, rgba(13,41,82,0.95) 0%, rgba(10,6,32,0.95) 60%, rgba(15,50,100,0.90) 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center py-4">
          <LittleSparksLogo iconClassName="w-12 h-12" textClassName="text-3xl" variant="light" />

          <nav className="hidden md:flex items-center gap-8">
            {['why', 'features', 'safety', 'discover'].map((item) => (
              <button
                key={item}
                className="text-blue-200/80 hover:text-white transition-colors text-sm font-semibold capitalize tracking-wide"
                onClick={() => scrollTo(item)}
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
              className="px-5 py-2.5 rounded-full text-sm font-bold"
              onClick={() => navigate('/signup-request')}
            >
              Get Started
            </Button>
          </div>
        </div>
      </motion.header>

      {/* ===== 1) HERO CAROUSEL ===== */}
      <HeroCarousel onCta={handleHeroCta} />

      {/* ===== 2) WHY — PARALLAX & STATS ===== */}
      <ParallaxSection id="why" navigate={navigate} />

      {/* ===== 3) FEATURES ===== */}
      <section id="features" className="relative py-24 px-6 lg:px-8 bg-midnight overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={land4Img}
            alt="Features Background"
            className="w-full h-full object-cover opacity-60"
            style={{ transform: 'scaleX(-1)', objectPosition: 'left center' }}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-midnight/70 via-midnight/30 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <RevealSection className="text-center mb-16">
            <span className="text-xs font-black text-primary-500 uppercase tracking-[0.3em] block mb-4">
              Everything You Need
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Swap Admin For{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-purple-400">
                Playtime
              </span>
            </h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              Everything you need to run your center smoothly — in one beautifully designed platform.
            </p>
          </RevealSection>

          <div className="mb-12 w-full pl-[20%]">
            <FeaturesCarousel />
          </div>

          <RevealSection className="text-center relative z-10">
            <Button
              variant="primary"
              className="px-8 py-4 rounded-full shadow-lg font-black"
              onClick={() => navigate('/signup-request')}
            >
              See All Features →
            </Button>
          </RevealSection>
        </div>
      </section>

      {/* ===== 4) SAFETY ===== */}
      <section id="safety" className="relative py-24 px-6 lg:px-8 overflow-hidden bg-midnight">
        {/* Section Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover opacity-40"
            src="https://images.unsplash.com/photo-1759752394755-1241472b589d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600"
            alt="Safety Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-midnight/90 to-midnight/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <RevealSection direction="left" className="relative group">
            <motion.div
              className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative bg-[#140e38]"
              whileHover={{ rotateY: 5, rotateX: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Blurred Background Image */}
              <div className="absolute inset-0 z-0">
                <img
                  className="w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1759752394755-1241472b589d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
                  alt="Dashboard Background"
                />
                <div className="absolute inset-0 bg-[#140e38]/80 backdrop-blur-sm" />
              </div>

              {/* Animated Scanner Line */}
              <motion.div
                className="absolute left-0 right-0 h-1 bg-primary-500/60 shadow-[0_0_20px_#06b6d4] z-30 pointer-events-none"
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />

              {/* Content */}
              <div className="relative z-10 p-8">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">13th Of MAY 2026</span>
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                    <motion.div
                      className="w-3 h-3 bg-green-400 rounded-full shadow-[0_0_15px_#4ade80]"
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </div>

                <div className="flex items-baseline gap-3 mb-6">
                  <div className="text-6xl font-black text-white">75%</div>
                  <div className="text-sm text-slate-300 font-semibold">Attendance Rate</div>
                </div>

                <div className="bg-white/10 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary-500 to-purple-400 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: '75%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                  />
                </div>

                <div className="flex gap-3 mt-8 justify-center">
                  <span className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_8px_#facc15]" />
                  <span className="w-3 h-3 rounded-full bg-pink-400 shadow-[0_0_8px_#f472b6]" />
                </div>
              </div>
            </motion.div>
          </RevealSection>

          <RevealSection direction="right" delay={0.15}>
            <span className="text-xs font-black text-primary-500 uppercase tracking-[0.3em] block mb-4">
              Built for Compliance
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Safety & Compliance —{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-purple-400">
                Effortlessly Archived
              </span>
            </h2>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Managing all of your reports in one place. Save countless hours on paperwork and stay audit-ready at all times.
            </p>
            <Button
              variant="primary"
              className="px-8 py-4 rounded-full shadow-lg"
              onClick={() => navigate('/contact')}
            >
              Contact Us
            </Button>
          </RevealSection>
        </div>
      </section>

      {/* ===== 5) DISCOVER ===== */}
      <section id="discover" className="relative py-32 px-6 lg:px-8 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d0b18 0%, #180e0a 40%, #100818 70%, #090f0d 100%)' }}>
        {/* Soft pastel color washes */}
        <div className="absolute top-0 left-0 w-[700px] h-[700px] rounded-full blur-[160px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,183,120,0.22) 0%, transparent 65%)' }} />
        <div className="absolute bottom-0 right-0 w-[700px] h-[700px] rounded-full blur-[160px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,130,160,0.20) 0%, transparent 65%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[180px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,220,100,0.13) 0%, transparent 65%)' }} />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(230,120,255,0.18) 0%, transparent 65%)' }} />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(100,240,180,0.15) 0%, transparent 65%)' }} />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <RevealSection>
            <span className="text-xs font-black text-primary-500 uppercase tracking-[0.4em] block mb-6">
              Educators Change Lives, We're Just Cheerleaders
            </span>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Discover{' '}
              <span className="inline-flex items-center">
                <LittleSparksLogo variant="light" iconClassName="w-16 h-16 md:w-24 md:h-24" textClassName="text-5xl md:text-7xl" />
              </span>
              !
            </h2>
            <p className="text-lg text-slate-400 mb-10 max-w-lg mx-auto">
              Join hundreds of childcare centers already transforming their daily operations with LittleSparks.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-to-r from-primary-500 to-purple-500 text-white px-12 py-5 rounded-full text-xl font-black shadow-2xl shadow-cyan-500/25"
              onClick={() => navigate('/signup-request')}
            >
              Try It Out — It's Free
            </motion.button>
          </RevealSection>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#060413] text-white py-16 px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12 items-start">
            <div className="col-span-1">
              <LittleSparksLogo variant="light" iconClassName="w-12 h-12" textClassName="text-2xl" />
              <p className="text-slate-500 mt-4 text-sm leading-relaxed">
                Simplifying childcare management for the next generation of educators.
              </p>
            </div>
            <div>
              <div className="mb-5">
                <h4 className="font-black text-white text-sm uppercase tracking-widest">Resources</h4>
                <div className="w-12 h-1 bg-[#f05060] mt-3 rounded-full"></div>
              </div>
              <Link to="/signup-request" className="text-slate-500 hover:text-primary-500 transition-colors block mb-3 text-sm">Getting Started</Link>
              <Link to="/billing" className="text-slate-500 hover:text-primary-500 transition-colors block mb-3 text-sm">Pricing</Link>
            </div>
            <div>
              <div className="mb-5">
                <h4 className="font-black text-white text-sm uppercase tracking-widest">Features</h4>
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
                <h4 className="font-black text-white text-sm uppercase tracking-widest">Company</h4>
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

export default LandingPage;
