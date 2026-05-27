module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B0B0B",
        gold: "#D4AF37",
        stone: {
          900: "#1C1C1C",
          800: "#262626",
          700: "#2F2F2F"
        }
      },
      boxShadow: {
        glow: "0 25px 60px rgba(212, 175, 55, 0.12)",
        soft: "0 18px 40px rgba(0,0,0,0.22)"
      },
      backgroundImage: {
        goldGlow: "radial-gradient(circle at top, rgba(212, 175, 55, 0.18), transparent 45%)",
        blackFade: "linear-gradient(180deg, rgba(11,11,11,1) 0%, rgba(17,17,17,0.96) 100%)"
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Arial", "Helvetica", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        fadeIn: "fadeIn 0.7s ease-out both"
      }
    }
  },
  plugins: []
};
