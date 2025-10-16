import {
  test as base,
  expect,
  PlaywrightTestConfig,
  PlaywrightTestOptions,
} from "@playwright/test";
import { PageManager } from "./page-objects/pageManager";

export type TestOptions = {
  globalsQaUrl?: string;
  formLayoutsPage: string;
  pageManager: PageManager;
};

// Declare the fixture
export const test = base.extend<TestOptions>({
  // Define the fixture value
  globalsQaUrl: async ({}, use) => {
    // This is where we would normally access the configuration
    // But for now we'll just use a default value
    await use("https://www.globalsqa.com/demo-site/draganddrop/");
  },
  formLayoutsPage: async ({ page }, use) => {
    await page.goto("/");
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
    await use("");
  }, //meaning that fixture should be automatically initialized as a very first thing before each test

  pageManager: async ({ page }, use) => {
    const pm = new PageManager(page);
    await use(pm);
  },
});

// Re-export expect
export { expect };

// Extend the PlaywrightTestConfig interface to include our custom options
declare module "@playwright/test" {
  interface PlaywrightTestOptions {
    globalsQaUrl?: string;
    formLayoutsPage: string;
  }
}
