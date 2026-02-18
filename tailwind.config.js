/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        marron: {
          DEFAULT: 'rgb(var(--color-marron-rgb) / <alpha-value>)',
          light: 'rgb(var(--color-marron-light-rgb) / <alpha-value>)',
          dark: 'rgb(var(--color-marron-dark-rgb) / <alpha-value>)'
        },
        ivoire: {
          DEFAULT: 'rgb(var(--color-ivoire-rgb) / <alpha-value>)',
          dark: 'rgb(var(--color-ivoire-dark-rgb) / <alpha-value>)'
        },
        dore: {
          DEFAULT: 'rgb(var(--color-dore-rgb) / <alpha-value>)',
          light: 'rgb(var(--color-dore-light-rgb) / <alpha-value>)',
          dark: 'rgb(var(--color-dore-dark-rgb) / <alpha-value>)'
        },
        accent: {
          sage: 'rgb(var(--color-sage-rgb) / <alpha-value>)',
          mauve: 'rgb(var(--color-mauve-rgb) / <alpha-value>)',
          clay: 'rgb(var(--color-clay-rgb) / <alpha-value>)',
          slate: 'rgb(var(--color-slate-rgb) / <alpha-value>)',
          cream: 'rgb(var(--color-cream-rgb) / <alpha-value>)',
          mist: 'rgb(var(--color-mist-rgb) / <alpha-value>)'
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Playfair Display', 'serif']
      },
      backgroundImage: {
        'gradient-warm': 'var(--gradient-warm)',
        'gradient-cool': 'var(--gradient-cool)',
        'gradient-neutral': 'var(--gradient-neutral)',
        'gradient-elegant': 'var(--gradient-elegant)'
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        medium: 'var(--shadow-medium)',
        strong: 'var(--shadow-strong)',
        glow: 'var(--shadow-glow)'
      }
    }
  },
  plugins: []
}
