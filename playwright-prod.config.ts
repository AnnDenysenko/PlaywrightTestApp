import { defineConfig, devices } from "@playwright/test";

import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });


export default defineConfig({
  // timeout: 10000,
  globalTimeout: 60000,

  // override timeout for locator assertions
  expect: {
    timeout: 2000,
  },
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:4200/",

    /* Custom option for GlobalsQA URL */
    globalsQaUrl: "https://www.globalsqa.com/demo-site/draganddrop/",
  },

  /* Configure projects for major browsers */
  projects: [

    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    }
  ]
});
