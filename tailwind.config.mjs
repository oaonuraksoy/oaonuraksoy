/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#08090A',
          black: '#08090A',
          surface: '#0E1013',
          border: '#1B1E24',
          subtle: '#14171D',
          hover: '#181C23'
        },
        gold: {
          dark: '#8A5A20',
          tungsten: '#C58A3A',
          warm: '#D6A354',
          highlight: '#F0C878',
          glow: 'rgba(197, 138, 58, 0.15)'
        },
        text: {
          primary: '#EDEDED',
          muted: '#9DA3AE',
          dim: '#6B7280'
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ],
        mono: [
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace'
        ]
      },
      backgroundImage: {
        'radial-vignette': 'radial-gradient(circle at 50% 0%, rgba(197, 138, 58, 0.08) 0%, rgba(8, 9, 10, 0.95) 75%)',
        'radial-glow': 'radial-gradient(circle at center, rgba(197, 138, 58, 0.12) 0%, transparent 70%)'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
};
