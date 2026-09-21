import { defineConfig, devices } from '@playwright/test'

// Los servidores se lanzan manualmente: backend en https://localhost:5001 y
// frontend en http://localhost:5173 (proxy /api -> backend). Playwright no los
// arranca; conecta con la app ya en marcha.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
  ],
})
