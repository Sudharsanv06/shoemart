export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#0D0D0D",
        charcoal: "#1A1A1A",
        carbon: "#242424",
        gold: "#C9A84C",
        "gold-light": "#E8C97A",
        "gold-dark": "#8B6914",
        ivory: "#F5F0E8",
        cream: "#EDE8DC",
        velvet: "#6B1E3C",
        "velvet-light": "#9B2D56",
        muted: "#8A8A8A",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        body: ["DM Sans", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #C9A84C, #E8C97A, #C9A84C)",
        "dark-gradient": "linear-gradient(180deg, #0D0D0D 0%, #1A1A1A 100%)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        shimmer: "shimmer 2s infinite",
        "slide-in": "slideIn 0.4s ease forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.5 } },
        slideIn: { "0%": { transform: "translateX(-100%)" }, "100%": { transform: "translateX(0)" } },
      },
    },
  },
  plugins: [],
};
