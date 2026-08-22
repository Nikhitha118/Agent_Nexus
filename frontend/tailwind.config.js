/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sentinel: {
          bg: "#080B13",
          surface: "#0F1626",
          card: "#141D32",
          border: "#1E2C48",
          borderGlow: "#2D426E",
          crimson: "#EF4444",
          amber: "#F59E0B",
          emerald: "#10B981",
          cyan: "#06B6D4",
          purple: "#8B5CF6",
          blue: "#3B82F6"
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'siren': 'sirenFlash 1.5s ease-in-out infinite'
      },
      keyframes: {
        sirenFlash: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 12px rgba(239, 68, 68, 0.8))' },
          '50%': { opacity: '0.4', filter: 'drop-shadow(0 0 2px rgba(239, 68, 68, 0.2))' }
        }
      }
    },
  },
  plugins: [],
}
