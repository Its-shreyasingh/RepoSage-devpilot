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
        github: {
          dark: '#0d1117',
          surface: '#161b22',
          card: '#1c2128',
          border: '#30363d',
          accent: '#238636',
          accentHover: '#2ea043',
          blue: '#58a6ff',
          muted: '#8b949e',
          text: '#c9d1d9',
          bright: '#f0f6fc',
          danger: '#f85149',
          purple: '#a371f7',
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'JetBrains Mono', 'Consolas', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
};

