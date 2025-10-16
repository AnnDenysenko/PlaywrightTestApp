import { expect } from "@playwright/test";
import { test } from "../test-options";

test(" Drag & Drop with iFrames", async ({ page, globalsQaUrl }) => {
  await page.goto(globalsQaUrl);

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

  await expect(frame.locator("#trash li h5")).toHaveText([
    "High Tatras 2",
    "High Tatras 4",
  ]);
});
