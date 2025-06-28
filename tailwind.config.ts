import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin'; // Import plugin

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    // Plugin personalizado para componentes del sistema
    plugin(function({ addComponents, theme }) { // Wrap with plugin
      addComponents({
        '.btn-primary': {
          backgroundColor: theme('colors.primary.600'),
          color: theme('colors.white'),
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.md'),
          fontWeight: theme('fontWeight.semibold'),
          transition: 'background-color 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: theme('colors.primary.700'),
          },
        },
        '.btn-secondary': {
          backgroundColor: theme('colors.gray.200'),
          color: theme('colors.gray.800'),
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.md'),
          fontWeight: theme('fontWeight.semibold'),
          transition: 'background-color 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: theme('colors.gray.300'),
          },
        },
        '.card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.lg'),
          boxShadow: theme('boxShadow.md'),
          padding: theme('spacing.6'),
        },
        '.input-field': {
          width: '100%',
          padding: `${theme('spacing.2')} ${theme('spacing.3')}`,
          borderRadius: theme('borderRadius.md'),
          borderWidth: theme('borderWidth.DEFAULT'),
          borderColor: theme('colors.gray.300'),
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.primary.500'),
            boxShadow: theme('boxShadow.outline'),
          },
        },
        '.badge': {
          display: 'inline-flex',
          alignItems: 'center',
          padding: `${theme('spacing.1')} ${theme('spacing.2')}`,
          borderRadius: theme('borderRadius.full'),
          fontSize: theme('fontSize.xs'),
          fontWeight: theme('fontWeight.medium'),
        },
        '.badge-primary': {
          backgroundColor: theme('colors.primary.100'),
          color: theme('colors.primary.800'),
        },
        '.badge-success': {
          backgroundColor: theme('colors.green.100'),
          color: theme('colors.green.800'),
        },
        '.badge-danger': {
          backgroundColor: theme('colors.red.100'),
          color: theme('colors.red.800'),
        },
        '.alert': {
          padding: theme('spacing.4'),
          borderRadius: theme('borderRadius.lg'),
          fontWeight: theme('fontWeight.medium'),
        },
        '.alert-info': {
          backgroundColor: theme('colors.blue.100'),
          color: theme('colors.blue.800'),
        },
        '.alert-success': {
          backgroundColor: theme('colors.green.100'),
          color: theme('colors.green.800'),
        },
        '.alert-warning': {
          backgroundColor: theme('colors.yellow.100'),
          color: theme('colors.yellow.800'),
        },
        '.alert-danger': {
          backgroundColor: theme('colors.red.100'),
          color: theme('colors.red.800'),
        },
      });
    }),
  ],
};

export default config;
