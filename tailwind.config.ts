import type { Config } from 'tailwindcss'
export default {
  content: ['./src/components/portfolio/**/*.{ts,tsx}', './src/app/(frontend)/**/*.{ts,tsx}'],
  theme: { extend: { fontFamily: { raleway: ['var(--font-raleway)', 'sans-serif'] } } },
  plugins: [],
} satisfies Config
