/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        navy: {
          DEFAULT: "#0F172A",
          dark:    "#0a1628",
          card:    "#0d1526",
        },
        glass: {
          dark:   "#0a0f1e",
          card:   "#0d1526",
          border: "#134e3a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in":    "fadeIn 0.4s ease-out both",
        "slide-up":   "slideUp 0.45s ease-out both",
        "slide-down": "slideDown 0.3s ease-out both",
        "scale-in":   "scaleIn 0.35s ease-out both",
        "shimmer":    "shimmer 1.5s infinite",
        "pulse-glow": "pulseGlow 2s infinite",
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:   { from: { opacity: 0, transform: "translateY(24px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        slideDown: { from: { opacity: 0, transform: "translateY(-12px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        scaleIn:   { from: { opacity: 0, transform: "scale(0.96)" }, to: { opacity: 1, transform: "scale(1)" } },
        shimmer:   { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(16,185,129,0.4)" },
          "50%":       { boxShadow: "0 0 0 8px rgba(16,185,129,0)" },
        },
      },
    },
  },
  plugins: [],
};
