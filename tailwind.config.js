/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette ultra-moderne 2026 - Tons frais et sophistiqués
        'marron': {
          DEFAULT: '#B89F91',  // Greige moderne (gris + beige)
          light: '#D4C4B7',    // Sable clair
          dark: '#8B7A6A',     // Taupe profond
        },
        'ivoire': {
          DEFAULT: '#FCFAF7',  // Blanc chaud minimaliste
          dark: '#F5F2ED',     // Lin premium
        },
        'dore': {
          DEFAULT: '#C9A87C',  // Champagne doré
          light: '#E5D4B8',    // Crème de champagne
          dark: '#A68B5B',     // Or mat vintage
        },
        // Accents ultra-modernes et frais
        'accent': {
          sage: '#A4B8A4',      // Sage eucalyptus
          mauve: '#BEA5B8',     // Mauve poudré
          clay: '#C4A29E',      // Argile rose
          slate: '#9BA5AF',     // Bleu-gris ardoise
          cream: '#F0E6D8',     // Crème café
          mist: '#D8E3E0',      // Brume verte
        },
      },
      fontFamily: {
        'sans': ['Montserrat', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(135deg, #FCFAF7 0%, #F0E6D8 30%, #C9A87C 70%, #B89F91 100%)',
        'gradient-cool': 'linear-gradient(135deg, #D8E3E0 0%, #A4B8A4 50%, #9BA5AF 100%)',
        'gradient-neutral': 'linear-gradient(135deg, #F5F2ED 0%, #D4C4B7 50%, #B89F91 100%)',
        'gradient-elegant': 'linear-gradient(135deg, #BEA5B8 0%, #C4A29E 33%, #C9A87C 66%, #A4B8A4 100%)',
      },
      boxShadow: {
        'soft': '0 4px 24px rgba(184, 159, 145, 0.12)',
        'medium': '0 8px 32px rgba(184, 159, 145, 0.16)',
        'strong': '0 12px 48px rgba(184, 159, 145, 0.20)',
        'glow': '0 0 32px rgba(201, 168, 124, 0.25)',
      }
    },
  },
  plugins: [],
}
