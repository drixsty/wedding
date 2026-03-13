/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        ivory: 'rgb(var(--color-ivory-rgb) / <alpha-value>)',
        stone: 'rgb(var(--color-stone-rgb) / <alpha-value>)',
        ebony: 'rgb(var(--color-ebony-rgb) / <alpha-value>)',
        gold: {
          muted: 'rgb(var(--color-gold-muted-rgb) / <alpha-value>)'
        },
        dore: {
          DEFAULT: 'rgb(var(--color-gold-muted-rgb) / <alpha-value>)',
          dark: 'rgb(20% var(--color-gold-muted-rgb) / <alpha-value>)'
        },
        marron: {
          DEFAULT: '#4A4540',
          dark: '#2D2A27'
        },
        ivoire: 'rgb(var(--color-ivory-rgb) / <alpha-value>)',
        content: {
          primary: 'var(--color-content-primary)',
          secondary: 'var(--color-content-secondary)',
          muted: 'var(--color-content-muted)',
          inverse: 'var(--color-content-inverse)'
        },
        surface: {
          base: 'var(--color-surface-base)',
          subtle: 'var(--color-surface-subtle)',
          strong: 'var(--color-surface-strong)'
        },
        accent: 'var(--color-accent)'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif']
      },
      boxShadow: {
        editorial: 'var(--shadow-editorial)',
        floating: 'var(--shadow-floating)'
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)'
      },
      transitionDuration: {
        'luxury': '1.2s',
        'standard': '0.6s'
      },
      letterSpacing: {
        'widest': 'var(--tracking-widest)',
        'tight': 'var(--tracking-tight)'
      }
    }
  },
  plugins: []
}
