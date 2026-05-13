import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],

  theme: {
    extend: {

      colors: {

        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },

        primary: {
          DEFAULT: '#111827',
          foreground: '#ffffff',
        },

        success: {
          DEFAULT: '#16a34a',
          foreground: '#ffffff',
        },

        warning: {
          DEFAULT: '#d97706',
          foreground: '#ffffff',
        },

        danger: {
          DEFAULT: '#dc2626',
          foreground: '#ffffff',
        },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },

      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
        lg: '10px',
      },

      boxShadow: {

        sm: '0 1px 2px rgba(0,0,0,0.05)',

        DEFAULT:
          '0 1px 3px rgba(0,0,0,0.08)',

        md:
          '0 4px 8px rgba(0,0,0,0.08)',
      },

      backgroundImage: {

        subtle-grid:
          'linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)',
      },

      animation: {

        fade:
          'fade 0.2s ease-out',
      },

      keyframes: {

        fade: {
          '0%': {
            opacity: '0',
          },

          '100%': {
            opacity: '1',
          },
        },
      },
    },
  },

  plugins: [],
};

export default config;