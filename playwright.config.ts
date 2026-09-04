import { defineConfig, devices } from '@playwright/test'
import 'dotenv/config'
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 120000,
  workers: 1,
  reporter: 'list',
  use: { baseURL: 'http://localhost:3001', trace: 'retain-on-failure' },
  projects: [{ name: 'edge', use: { ...devices['Desktop Edge'], channel: 'msedge' } }],
  webServer: {
    command: 'npm run dev -- --port 3001',
    reuseExistingServer: true,
    url: 'http://localhost:3001',
    timeout: 120000,
  },
})
