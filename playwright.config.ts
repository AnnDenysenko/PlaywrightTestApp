import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // timeout: 10000,
  globalTimeout: 60000,

  // override timeout for locator assertions
  expect: {
    timeout: 2000,
  },
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true, // in CI we want to run tests in parallel within the same spec file
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0, // in CI we want to retry tests 2 times and locally we don't want to retry
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined, // in CI we want to run tests one by one and locally we want to run tests in parallel
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:4200/",

    /* Custom option for GlobalsQA URL */
    globalsQaUrl: "https://www.globalsqa.com/demo-site/draganddrop/",
    // baseURL:
    //   process.env.DEV === "1"
    //     ? "http://localhost:4200/"
    //     : process.env.STAGING === "1"
    //     ? "http://localhost:4201/"
    //     : process.env.PROD === "1"
    //     ? "http://localhost:4202/"
    //     : process.env.URL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    // actionTimeout: 5000,
    // navigationTimeout: 10000,
    video: { mode: "on", size: { width: 1920, height: 1080 } }, // record video for each test
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "dev",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:4201/",
      },
    },
    {
      name: "staging",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:4202/",
      },
    },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // Using the deployed version of the app instead of running locally
  // webServer: {
  //   command: "cd ../pw-practice-app && npm start",
  //   url: "http://localhost:4200",
  //   reuseExistingServer: !process.env.CI,
  // },
});
