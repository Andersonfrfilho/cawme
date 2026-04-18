const { palette } = require('./src/constants/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Azul primary — tom do logo
        primary: {
          DEFAULT: '#1A45E8',
          light:   '#4F7AF7',
          lighter: '#9FB6FB',
          dark:    '#0E2BAF',
          darker:  '#041376',
          surface: '#EEF2FF',
          50:  '#EEF2FF',
          100: '#C7D4FD',
          200: '#9FB6FB',
          300: '#7798F9',
          400: '#4F7AF7',
          500: '#1A45E8',
          600: '#1438CC',
          700: '#0E2BAF',
          800: '#091F93',
          900: '#041376',
          950: '#020B52',
        },
        // Verde — checkmark do logo
        accent: {
          DEFAULT: '#22C55E',
          light:   '#DCFCE7',
          dark:    '#15803D',
          yellow:  '#F5A623',
          'yellow-light': '#FEF3C7',
          'yellow-dark':  '#D97706',
        },
        // Backgrounds
        background: {
          DEFAULT:  '#F8FAFC',
          card:     '#FFFFFF',
          elevated: '#F1F5F9',
          inverse:  '#1A45E8',
        },
        // Texto
        content: {
          primary:   '#0F172A',
          secondary: '#475569',
          tertiary:  '#94A3B8',
          disabled:  '#CBD5E1',
          inverse:   '#FFFFFF',
          link:      '#1A45E8',
        },
        // Status
        success: '#22C55E',
        warning: '#F5A623',
        danger:  '#EF4444',
        info:    '#1A45E8',
      },

      borderRadius: {
        xs:   '4px',
        sm:   '8px',
        md:   '12px',
        lg:   '16px',
        xl:   '20px',
        '2xl': '24px',
        '3xl': '32px',
      },

      fontSize: {
        xs:    ['10px', { lineHeight: '14px' }],
        sm:    ['12px', { lineHeight: '16px' }],
        base:  ['14px', { lineHeight: '20px' }],
        md:    ['16px', { lineHeight: '24px' }],
        lg:    ['18px', { lineHeight: '28px' }],
        xl:    ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['28px', { lineHeight: '36px' }],
        '4xl': ['32px', { lineHeight: '40px' }],
        '5xl': ['40px', { lineHeight: '48px' }],
      },

      spacing: {
        '0.5': '2px',
        '1':   '4px',
        '1.5': '6px',
        '2':   '8px',
        '2.5': '10px',
        '3':   '12px',
        '3.5': '14px',
        '4':   '16px',
        '5':   '20px',
        '6':   '24px',
        '7':   '28px',
        '8':   '32px',
        '9':   '36px',
        '10':  '40px',
        '11':  '44px',
        '12':  '48px',
        '14':  '56px',
        '16':  '64px',
        '20':  '80px',
        '24':  '96px',
      },
    },
  },
  plugins: [],
};
