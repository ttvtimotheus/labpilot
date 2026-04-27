import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        'background-elev': '#F7F7F8',
        'background-sunk': '#F2F2F4',
        foreground: '#0A0A0B',
        'foreground-muted': '#59595F',
        'foreground-subtle': '#74747A',
        border: '#E6E6E8',
        'border-strong': '#D2D2D6',
        mibi: '#10803C',
        haema: '#C62828',
        chemie: '#1E5FBF',
        histo: '#7B3FB8',
        general: '#59595F',
        learn: '#B45309',
        success: '#10803C',
        warning: '#B45309',
        danger: '#C62828',
        info: '#1E5FBF',
      },
      fontFamily: {
        sans: ['Inter_400Regular'],
        mono: ['JetBrainsMono_500Medium'],
      },
      borderRadius: {
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
      },
    },
  },
} satisfies Config;
