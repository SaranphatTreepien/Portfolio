/** @type {import('tailwindcss').Config} */

// Theme-aware colour: reads an "r g b" token from app/globals.css (light in :root, dark under .dark)
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;
const scale = (prefix, steps) => Object.fromEntries(steps.map((n) => [n, v(`${prefix}${n}`)]));
const GRAYS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

module.exports = {
    darkMode: ['class'],
    content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	container: {
  		center: true,
  		padding: { DEFAULT: '20px', sm: '32px' }
  	},
  	screens: {
  		sm: '640px',
  		md: '768px',
  		lg: '1024px',
  		xl: '1200px',
  		// Sidebar + content wide enough for two columns inside the content
  		'2xl': '1360px'
  	},
  	fontFamily: {
  		// Thai text falls back to IBM Plex Sans Thai (Bebas Neue, Geist and Instrument Serif have no Thai glyphs)
  		primary: ['var(--font-bebas)', 'var(--font-thai)', 'sans-serif'],
  		secondary: ['var(--font-geist)', 'var(--font-thai)', 'system-ui', 'sans-serif'],
  		sans: ['var(--font-geist)', 'var(--font-thai)', 'system-ui', 'sans-serif'],
  		serif: ['var(--font-serif)', 'var(--font-thai)', 'Georgia', 'serif'],
  		mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace']
  	},
  	extend: {
  		colors: {
  			primary: v("ink"),
  			secondary: v("ink-2"),
  			gray: { ...scale("g", GRAYS), 950: v("g950") },
  			slate: scale("s", GRAYS),
  			accent: {
  				DEFAULT: "#7edad2",
  				hover: "#79d3cc",
  			},
  			// Accent scale (green by default); the sidebar picker swaps it via data-accent on <html>
  			brand: scale("b", [50, ...GRAYS]),	
			   border: "hsl(var(--border))",   // ✅ เพิ่มบรรทัดนี้	
  		},
  		boxShadow: {
  			custom: '0px 14px 54px rgba(0,0,0,0.1)'
  		},
		// Same class, different job per theme: bg-white is a card surface, text stays white;
		// brand and amber text lighten in the dark theme so they read on charcoal
		backgroundColor: {
			white: v("surface"),
			primary: v("btn"),
			brand: { 50: v("bb50"), 100: v("bb100") },
			amber: { 50: v("ab50") },
			// Dark backdrops behind photos and video stay dark in both themes
			gray: { 800: "#1f2937", 900: "#111827" },
		},
		borderColor: {
			white: v("line"),
			brand: { 100: v("bl100"), 200: v("bl200"), 300: v("bl300") },
		},
		textColor: {
			black: v("ink-black"),
			brand: { 500: v("bt500"), 600: v("bt600"), 700: v("bt700"), 800: v("bt800"), 900: v("bt900") },
			amber: { 600: v("at600"), 700: v("at700") },
		},
		keyframes: {
			'fade-in-up': {
				'0%': { 
					opacity: '0', 
					transform: 'translateY(20px)' 
				},
				'100%': { 
					opacity: '1', 
					transform: 'translateY(0)' 
				}
			},
			shimmer: {
				'0%': { transform: 'translateX(-100%)' },
				'100%': { transform: 'translateX(200%)' }
			},
			marquee: {
				'0%': { transform: 'translateX(0)' },
				'100%': { transform: 'translateX(-50%)' }
			}
		},
		animation: {
			'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
			'shimmer': 'shimmer 2s ease-in-out',
			'marquee': 'marquee var(--marquee-duration, 60s) linear infinite',
		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
