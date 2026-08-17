/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        petrol: {
          500: '#1C5D52',
          700: '#123D36',
          100: '#E3F1ED',
        },
        amber: {
          500: '#D89B3C',
          700: '#A9721F',
          100: '#FBF0DC',
        },
        vinculo: {
          500: '#C65B76',
          700: '#A8455F',
          100: '#F6E4E9',
        },
        success: {
          500: '#3F8557',
          700: '#2F6B45',
          100: '#E7F3EA',
        },
        error: {
          500: '#C1432E',
          100: '#FBE6E2',
        },
        info: {
          500: '#4472A8',
          100: '#E7EEF5',
        },
        neutral: {
          0: '#FAF8F5',
          50: '#F3F0EB',
          100: '#E8E4DD',
          200: '#DDD8D0',
          300: '#C7C1B7',
          500: '#8B8880',
          700: '#5C6B67',
          900: '#26302E',
        },
      },
      fontFamily: {
        display: ['BricolageGrotesque_600SemiBold'],
        'display-medium': ['BricolageGrotesque_500Medium'],
        body: ['PublicSans_400Regular'],
        'body-medium': ['PublicSans_500Medium'],
        'body-semibold': ['PublicSans_600SemiBold'],
        mono: ['IBMPlexMono_500Medium'],
      },
      fontSize: {
        display: ['32px', { lineHeight: '40px' }],
        h1: ['26px', { lineHeight: '34px' }],
        h2: ['21px', { lineHeight: '28px' }],
        h3: ['18px', { lineHeight: '24px' }],
        'body-lg': ['17px', { lineHeight: '26px' }],
        body: ['15px', { lineHeight: '22px' }],
        caption: ['13px', { lineHeight: '18px' }],
        overline: ['11px', { lineHeight: '14px' }],
      },
      borderRadius: {
        sm: '10px',
        md: '16px',
        lg: '24px',
        pill: '999px',
      },
    },
  },
  plugins: [],
};
