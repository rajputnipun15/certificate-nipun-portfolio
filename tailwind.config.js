/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: "#111111",
        card: "#191919",
        "card-hover": "#222222",
        primary: "#FFFFFF",
        secondary: "#BDBDBD",
        accent: {
          DEFAULT: "#F97316",
          glow: "rgba(249, 115, 22, 0.35)",
          light: "#FB923C",
          dark: "#EA580C"
        }
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "Inter", "sans-serif"],
        serif: ["var(--font-editorial)", "Playfair Display", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        'glow-accent': '0 0 30px -5px rgba(249, 115, 22, 0.3)',
        'glow-card': '0 8px 30px rgba(0, 0, 0, 0.7)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.4, transform: 'scale(1)' },
          '50%': { opacity: 0.8, transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
