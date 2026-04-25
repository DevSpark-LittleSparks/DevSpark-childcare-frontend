import React, { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, Zap, Heart } from 'lucide-react';

// ==========================================
// 1) Internal Logo Component
// (Boldness: 80, Spacing: -ml-2, Font: Nunito)
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
  variant = 'dark'
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
      {/* Set Nunito font explicitly to restore your design */}
      <span 
        className={`font-bold tracking-tighter -ml-2 ${mainTextColor} ${textClassName}`}
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        Little<span style={{color: sparksColor}}>Sparks</span>
      </span>
    </div>
  );
};

// ==========================================
// 2) Feature Card Component
// ==========================================
interface CardProps {
  icon: ReactNode;
  title: string;
  text: string;
}

const Card: React.FC<CardProps> = ({ icon, title, text }) => {
  return (
    <div className="card bg-gray-700 p-8 rounded-xl hover:bg-gray-600 transition-colors border border-gray-600 flex flex-col">
      <div className="card-ic mb-4 text-4xl">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-300">{text}</p>
    </div>
  );
};

// ==========================================
// 3) Main LandingPage Component
// ==========================================
const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const scrollTo = (id: string): void => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="lp min-h-screen bg-white">
      {/* Topbar */}
      <header className="lp-nav bg-white/70 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <div className="lp-brand">
             <LittleSparksLogo iconClassName="w-16 h-16" textClassName="text-4xl" />
          </div>

          <nav className="lp-menu hidden md:flex space-x-8">
            <button
              className="lp-navlink text-gray-700 hover:text-cyan-500 transition-colors"
              onClick={() => scrollTo('why')}
            >
              Why
            </button>
            <button
              className="lp-navlink text-gray-700 hover:text-cyan-500 transition-colors"
              onClick={() => scrollTo('features')}
            >
              Features
            </button>
            <button
              className="lp-navlink text-gray-700 hover:text-cyan-500 transition-colors"
              onClick={() => scrollTo('safety')}
            >
              Safety
            </button>
            <button
              className="lp-navlink text-gray-700 hover:text-cyan-500 transition-colors"
              onClick={() => scrollTo('discover')}
            >
              Discover
            </button>
          </nav>

          <div className="lp-actions flex gap-4 items-center">
            <Link
              className="lp-link text-gray-700 hover:text-cyan-500 transition-colors font-semibold"
              to="/login"
            >
              Log In
            </Link>
            <button
              className="lp-btn bg-cyan-500 text-white px-5 py-2.5 rounded-full hover:bg-cyan-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transform"
              onClick={() => navigate('/signup-request')}
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* ===== 1) HERO ===== */}
      <section
        id="hero"
        className="hero bg-gradient-to-b from-blue-100 via-purple-100 to-pink-100 py-40 px-4 sm:px-6 lg:px-8"
      >
        <div className="wrap hero-grid max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="hero-left">
            <p className="badge text-sm text-gray-600 mb-4"> An Early Childhood Platform</p>
            <h1 className="hero-title text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Less Paperwork,<br />More Playtime
            </h1>
            <p className="hero-text text-lg text-gray-700 mb-8">
              LittleSparks saves everything for your nursery and childcare service into one online,
              organized space so you can stay present with every child.
            </p>
            <div className="hero-cta">
              <button
                className="btn secondary bg-cyan-500 text-white px-8 py-4 rounded-full font-bold hover:bg-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 transform"
                onClick={() => navigate('/signup-request')}
              >
                Request Form
              </button>
            </div>
          </div>
          <div className="hero-right flex justify-center relative">
            <div className="hero-img w-full max-w-md h-80 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-3xl flex items-center justify-center shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1770096679916-2cd9c720d400?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
                alt="Teachers and children playing"
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>
            <div className="dot absolute w-32 h-32 border-2 border-cyan-400 rounded-full opacity-20 -z-10" />
          </div>
        </div>
      </section>

      {/* ===== 2) WHY ===== */}
      <section id="why" className="why relative min-h-[300px] flex items-center overflow-hidden">
        <img className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200" alt="" />
        <div className="absolute inset-0 bg-black bg-opacity-60" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold text-white mb-6">Why Choose LITTLESPARKS?</h2>
            <p className="text-lg text-gray-100 mb-8">The nursery and childcare management app that does almost everything.</p>
            <button className="btn primary bg-cyan-500 text-white px-8 py-4 rounded-full font-bold hover:bg-cyan-600 transition-all active:scale-95 transform w-fit" onClick={() => navigate('/learn-more')}>Learn More</button>
          </div>
        </div>
      </section>

      {/* ===== 3) SWAP ADMIN ===== */}
      <section id="features" className="band py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="wrap center max-w-7xl mx-auto text-center">
          <h2 className="h2 white text-4xl font-bold text-white mb-4">Swap Admin For Playtime</h2>
          <p className="p white soft text-lg text-gray-300 mb-12">Everything you need to run your center smoothly.</p>
          <div className="cards grid md:grid-cols-3 gap-8 mb-12">
            <Card icon={<Layers size={32} className="text-cyan-400" />} title="All-In-One" text="Everything you need in one powerful platform." />
            <Card icon={<Zap size={32} className="text-yellow-400" />} title="Easy to use" text="Intuitive design that anyone can master." />
            <Card icon={<Heart size={32} className="text-pink-400" />} title="Child-Centered" text="Built with children's wellbeing at heart." />
          </div>
          <Link className="btn whitebtn bg-white text-gray-800 px-8 py-3 rounded-full font-bold hover:bg-gray-50 transition-all shadow-md active:scale-95 transform inline-block" to="/features">See All</Link>
        </div>
      </section>

      {/* ===== 4) SAFETY ===== */}
      <section id="safety" className="safety py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="wrap two-col max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="dash">
            <div className="dash-top bg-gray-100 p-6 rounded-t-2xl">
              <span className="dash-label text-sm text-gray-600">27th Of February 2026</span>
              <div className="dash-stat flex gap-2 mt-4"><div className="dash-val text-4xl font-bold text-gray-900">75%</div><div className="dash-sub text-sm text-gray-600">Attendance Rate</div></div>
            </div>
            <img className="dash-img w-full h-64 object-cover" src="https://images.unsplash.com/photo-1759752394755-1241472b589d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200" alt="Dashboard" />
            <div className="dots flex gap-3 p-6 bg-gray-100 justify-center rounded-b-2xl"><span className="d green w-4 h-4 rounded-full bg-green-400" /><span className="d yellow w-4 h-4 rounded-full bg-yellow-400" /><span className="d pink w-4 h-4 rounded-full bg-pink-400" /></div>
          </div>
          <div>
            <h2 className="h2 text-4xl font-bold text-gray-900 mb-6">Safety & Compliance - Effortlessly Archived</h2>
            <p className="p text-lg text-gray-700 mb-4">Managing all of your reports in one place. Save countless hours on paperwork.</p>
            <button className="btn primary bg-cyan-500 text-white px-8 py-3 rounded-full font-bold hover:bg-cyan-600 transition-all active:scale-95 transform" onClick={() => navigate('/contact')}>Contact Us</button>
          </div>
        </div>
      </section>

      {/* ===== 5) DISCOVER ===== */}
      <section id="discover" className="discover py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 text-center">
        <div className="max-w-7xl mx-auto">
          <span className="discover-badge text-sm text-white opacity-90 block mb-6 uppercase font-bold tracking-widest">EDUCATORS CHANGE LIVES, WE'RE JUST CHEERLEADERS</span>
          <h2 className="discover-title text-6xl font-bold text-white mb-8 flex justify-center items-center gap-0">
            Discover <LittleSparksLogo variant="dark" iconClassName="w-24 h-24" textClassName="text-7xl" />!
          </h2>
          <button className="btn whitebtn bg-white text-purple-600 px-10 py-5 rounded-full text-xl font-bold active:scale-95 transform" onClick={() => navigate('/get-started')}>Try It Out</button>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="footer bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-8 items-start">
            <div className="col-span-1">
               <LittleSparksLogo variant="light" iconClassName="w-12 h-12" textClassName="text-2xl" />
               <p className="text-gray-500 mt-4 text-sm">Simplifying childcare management for the next generation.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <a href="#hero" className="text-gray-400 hover:text-white transition-colors block mb-2">Getting Started</a>
              <a href="#features" className="text-gray-400 hover:text-white transition-colors block mb-2">Pricing</a>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Features</h4>
              <a href="#features" className="text-gray-400 hover:text-white transition-colors block mb-2">Attendance</a>
              <a href="#features" className="text-gray-400 hover:text-white block transition-colors">Reports</a>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <a href="#why" className="text-gray-400 hover:text-white block mb-2 transition-colors">About</a>
              <a href="#discover" className="text-gray-400 hover:text-white block transition-colors">Contact</a>
            </div>
          </div>
          <div className="text-center text-gray-500 border-t border-gray-800 pt-8">©2026_LittleSparks.com — All rights reserved</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;