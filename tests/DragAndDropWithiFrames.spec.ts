import { test, expect } from "@playwright/test";

test(" Drag & Drop with iFrames", async ({ page }) => {
  await page.goto("https://www.globalsqa.com/demo-site/draganddrop/");

  // creating a frame locator
  const frame = page.frameLocator('[rel-title="Photo Manager"] iframe');

  // clicking second image
  await frame
    .locator("li", { hasText: "High Tatras 2" })
    .dragTo(frame.locator("#trash"));

  // performing drag and drop controlling the mouse (more precise control)
  await frame.locator("li", { hasText: "High Tatras 4" }).hover();
  await page.mouse.down();
  await frame.locator("#trash").hover();
  // releasing the mouse
  await page.mouse.up();

  await expect(frame.locator("#trash li h5")).toHaveText(["High Tatras 2", "High Tatras 4"]);
});
