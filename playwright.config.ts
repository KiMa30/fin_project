import { defineConfig, devices } from '@playwright/test';
import { testPlanFilter } from "allure-playwright/testplan";

export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  // testDir: './tests/e2e',
  testDir: './tests',
  // timeout: 4 * 60 * 1000,

  // Run all tests in parallel.
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // Retry on CI only.
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,
  // workers: 1,
  // Reporter to use
  // reporter: 'html',

  use: {
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true,
    },
    // Base URL to use in actions like `await page.goto('/')`.
    // baseURL: 'http://127.0.0.1:3000',

    // Collect trace when retrying the failed test.
    trace: 'on-first-retry',
    testIdAttribute: 'data-ui-id'
  },
  
  // Configure projects for major browsers.
  projects: [
    {
      name: 'UI_E2E_LUMA',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Chrome'] 

      },
    },
    {
      name: 'Booker_api',
      testDir: './tests/api',
    }
  ],
  grep: testPlanFilter(),
  reporter: [["line"], ["allure-playwright"]],
  // Run your local dev server before starting the tests.
//   webServer: {
//     command: 'npm run start',
//     url: 'http://127.0.0.1:3000',
//     reuseExistingServer: !process.env.CI,
//   },
});