import next from 'eslint-config-next/core-web-vitals'
import ts from 'eslint-config-next/typescript'
const config = [
  ...next,
  ...ts,
  {
    ignores: [
      '.next/**',
      'src/payload-types.ts',
      'src/migrations/**',
      'src/app/(payload)/admin/importMap.js',
    ],
  },
]
export default config
