import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      display: ['Bebas Neue', 'sans-serif'],
      body: ['DM Sans', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    extend: {
      colors: {
        accent: { DEFAULT: '#00e5a0', dark: '#00b87f', light: '#33ebb3' },
        live: '#ff4444',
        gold: '#ffd700',
        danger: '#ff4d6d',
      },
      animation: {
        ticker: 'ticker 45s linear infinite',
        'pulse-live': 'pulse-live 1.4s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.35s cubic-bezier(0.16,1,0.3,1)',
        'scale-in': 'scale-in 0.2s cubic-bezier(0.175,0.885,0.32,1.275)',
        shimmer: 'shimmer 1.6s ease-in-out infinite',
        'score-flash': 'score-flash 0.6s ease',
        'bounce-in': 'bounce-in 0.5s cubic-bezier(0.175,0.885,0.32,1.275)',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      boxShadow: {
        glow: '0 0 20px rgba(0,229,160,0.25)',
        'glow-lg': '0 0 40px rgba(0,229,160,0.3)',
        live: '0 0 12px rgba(255,68,68,0.4)',
      },
    },
  },
  plugins: [],
};
export default config;
