/** @type {import('tailwindcss').Config} */
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
  		xl: '1200px'
  	},
  	fontFamily: {
  		// Thai text falls back to IBM Plex Sans Thai (Bebas Neue, Geist and Instrument Serif have no Thai glyphs)
  		primary: ['var(--font-bebas)', 'var(--font-thai)', 'sans-serif'],
  		secondary: ['var(--font-geist)', 'var(--font-thai)', 'system-ui', 'sans-serif'],
  		sans: ['var(--font-geist)', 'var(--font-thai)', 'system-ui', 'sans-serif'],
  		serif: ['var(--font-serif)', 'var(--font-thai)', 'Georgia', 'serif']
  	},
  	extend: {
  		colors: {
  			primary:"#10151f",
  			secondary: "#475467",
  			accent: {
  				DEFAULT: "#7edad2",
  				hover: "#79d3cc",
  			},
  			// Teal scale around the original accent; 600/700 are dark enough for text on white
  			brand: {
  				50: "#effbf9",
  				100: "#d5f4ef",
  				200: "#ade8e0",
  				300: "#7edad2",
  				400: "#4cc3b8",
  				500: "#26a99e",
  				600: "#1a8a81",
  				700: "#186f69",
  				800: "#185955",
  				900: "#174a47",
  			},	
			   border: "hsl(var(--border))",   // ✅ เพิ่มบรรทัดนี้	
  		},
  		boxShadow: {
  			custom: '0px 14px 54px rgba(0,0,0,0.1)'
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
