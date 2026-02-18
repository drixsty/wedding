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
        },
        content: {
          primary: 'rgb(var(--color-text-primary-rgb) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary-rgb) / <alpha-value>)',
          muted: 'rgb(var(--color-text-muted-rgb) / <alpha-value>)',
          inverse: 'rgb(var(--color-text-inverse-rgb) / <alpha-value>)'
        },
        surface: {
          base: 'rgb(var(--color-surface-base-rgb) / <alpha-value>)',
          elevated: 'rgb(var(--color-surface-elevated-rgb) / <alpha-value>)',
          subtle: 'rgb(var(--color-surface-subtle-rgb) / <alpha-value>)',
          strong: 'rgb(var(--color-surface-strong-rgb) / <alpha-value>)'
        },
        border: {
          soft: 'rgb(var(--color-border-soft-rgb) / <alpha-value>)'
        },
        success: {
          DEFAULT: 'rgb(var(--color-success-rgb) / <alpha-value>)',
          soft: 'rgb(var(--color-success-soft-rgb) / <alpha-value>)'
        },
        warning: {
          DEFAULT: 'rgb(var(--color-warning-rgb) / <alpha-value>)',
          soft: 'rgb(var(--color-warning-soft-rgb) / <alpha-value>)'
        },
        danger: {
          DEFAULT: 'rgb(var(--color-danger-rgb) / <alpha-value>)',
          soft: 'rgb(var(--color-danger-soft-rgb) / <alpha-value>)'
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Playfair Display', 'serif']
      },
      fontSize: {
        'title-lg': ['var(--font-size-title-lg)', { lineHeight: '1.2' }],
        'title-md': ['var(--font-size-title-md)', { lineHeight: '1.25' }],
        'body-lg': ['var(--font-size-body-lg)', { lineHeight: '1.6' }],
        'body': ['var(--font-size-body)', { lineHeight: '1.6' }],
        'body-sm': ['var(--font-size-body-sm)', { lineHeight: '1.5' }]
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
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)'
      }
    }
  },
  plugins: []
}
