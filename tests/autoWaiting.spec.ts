import { test, expect } from "@playwright/test";
import { allowedNodeEnvironmentFlags } from "process";

// test.beforeAll(async ({ page }) => {});

test.beforeEach(async ({ page }, testInfo) => {
  // Using the ngx-admin app instead of uitestingplayground due to certificate issues
  await page.goto("/");
  
  // Navigate to a page with AJAX functionality
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();
  
  // Click on a button that will trigger AJAX request (like search)
  await page.getByPlaceholder("Search...").click();

  testInfo.setTimeout(testInfo.timeout + 2000); // setting timeout for the whole test suit and it will be applied to each test
});

test("Auto waiting", async ({ page }) => {
  const successButton = page.locator(".bg-success");

  //   await successButton.click();

  // with text content
  const text = await successButton.textContent(); // grab text from this element

  expect(text).toEqual("Data loaded with AJAX get request.");

  //   const text = await successButton.allTextContents(); // will not wait

  await successButton.waitFor({ state: "attached" }); // for methods without implemented auto wait logic

  expect(text).toEqual("Data loaded with AJAX get request."); // toEqual for strings, toContain for arrays

  await expect(successButton).toHaveText("Data loaded with AJAX get request.");

  // using increased timeout (increase from default timeout which is 5 seconds)
  await expect(successButton).toHaveText("Data loaded with AJAX get request.", {
    timeout: 20000,
  });
});

// dealing with methods that do not have auto waiting implememted
test("Alternative waits", async ({ page }) => {
  const successButton = page.locator(".bg-success");

  // ___wait for element
  await page.waitForSelector(".bg-success");

  // ___wait for particular response
  await page.waitForResponse("https://uitestingplayground.com/ajaxdata"); // waiting for networking request to be successfully completed and then will go to the next step

  // ___wait for network calls to be completed (not recommended);
  await page.waitForLoadState("networkidle"); // waiting for all api calls to be completed (not all api calls may be required for UI, that's why it's not always recommended)

  await page.waitForTimeout(5000);

  await page.waitForURL("*/"); // when waiting for specific page to open

  const text = await successButton.allTextContents(); // will not wait

  expect(text).toContain("Data loaded with AJAX get request."); // toEqual for strings, toContain for arrays
});

test("Timeouts", async ({ page }) => {
  test.setTimeout(60000); // setting timeout for the whole test
  test.slow(); // will increase the default timeout of the test in 3 times
  const successButton = page.locator(".bg-success");

  await successButton.click(); // in web click on this button takes 15 seconds for the button to show up

  // timeoouts can be configured in playwright.config.ts

  // timeout can be overrided in config
  await successButton.click({ timeout: 20000 });
});
