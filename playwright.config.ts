import { defineConfig } from '@playwright/test';

// El entorno del agente fija NO_COLOR; Playwright fija FORCE_COLOR en sus hijos.
// Evita el aviso de Node por la colisión de ambas opciones.
delete process.env.NO_COLOR;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:4321', trace: 'retain-on-failure' },
  projects: [
    {
      name: 'escritorio',
      use: { browserName: 'chromium', viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'tablet',
      use: { browserName: 'chromium', viewport: { width: 834, height: 1112 } },
    },
    {
      name: 'movil',
      use: {
        browserName: 'chromium',
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: 'node scripts/servidor-e2e.mjs',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
  },
});
