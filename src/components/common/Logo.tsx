interface LogoProps {
  /** 'light' for dark backgrounds, 'dark' for white backgrounds */
  variant?: 'light' | 'dark';
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

/**
 * LittleSparks Logo Component
 */
export const Logo = ({
  variant = 'dark',
  className = '',
  iconClassName = 'w-10 h-10',
  textClassName = 'text-2xl',
}: LogoProps) => {
  const isLight = variant === 'light';
  const iconColor = isLight ? '#FFFFFF' : '#1F2937';
  const mainTextColor = isLight ? 'text-white' : 'text-[#1F2937]';
  const sparksColor = '#06C5D4';

  return (
    <div className={`flex items-center gap-0 select-none ${className}`}>
      {/* SVG Icon */}
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

      {/* Text */}
      <span
        className={`font-bold tracking-tighter -ml-2 ${mainTextColor} ${textClassName}`}
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        Little<span style={{ color: sparksColor }}>Sparks</span>
      </span>
    </div>
  );
};
export default Logo;
/**
 * ============================================================
 * LITTLESPARKS LOGO COMPONENT - USAGE GUIDE
 * ============================================================
 * * 1. VARIANT OPTIONS:
 * - variant="dark"  : Use for white or light backgrounds.
 * (Icon and "Little" text appear in Dark Gray)
 * - variant="light" : Use for sidebars or dark backgrounds.
 * (Icon and "Little" text appear in White)
 * * 2. SIZING PROPERTIES:
 * - iconClassName   : Controls the logo icon size (e.g., "w-12 h-12", "w-16 h-16")
 * - textClassName   : Controls the font size (e.g., "text-2xl", "text-4xl")
 * * 3. QUICK EXAMPLES:
 * - <Logo variant="dark" iconClassName="w-16 h-16" textClassName="text-4xl" />
 * - <Logo variant="light" iconClassName="w-10 h-10" textClassName="text-xl" />
 * * ============================================================
 */
