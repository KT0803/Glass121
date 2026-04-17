/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3B82F6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        navy: {
          DEFAULT: "#0F172A",
          dark:    "#0a1628",
          card:    "#0d1526",
        },
        glass: {
          dark:   "#0a0f1e",
          card:   "#0d1526",
          border: "#1e3a5f",
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
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(59,130,246,0.4)" },
          "50%":       { boxShadow: "0 0 0 8px rgba(59,130,246,0)" },
        },
      },
    },
  },
  plugins: [],
};
