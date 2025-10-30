import { test, expect } from "../test-options";

test("Input fields", async ({ page }) => {
  await page.goto("/", { waitUntil: 'domcontentloaded' });
  await page.locator(".sidebar-toggle").waitFor({ state: "visible" });
  await page.locator(".sidebar-toggle").click();
  await page.getByText("Forms").click();
  await page.getByText("Form Layouts").click();
  await page.locator(".sidebar-toggle").waitFor({ state: "visible" });
  await page.locator(".sidebar-toggle").click();

  const usingTheGridEmailInput = page
    .locator("nb-card", { hasText: "Using the Grid" })
    .getByRole("textbox", { name: "Email" });

  await usingTheGridEmailInput.fill("test@test.com");
  await usingTheGridEmailInput.clear(); // to clear the entered text from "fill" step. clear cannot be chained to fill

  // method to simulate the keystrokes of the keyboard
  await usingTheGridEmailInput.pressSequentially("test2@test.com");
  await usingTheGridEmailInput.clear();

  // pressSequentially() method can create a delay between keystrokes
  // method to simulate the keystrokes of the keyboard
  await usingTheGridEmailInput.pressSequentially("test2@test.com");

  // assertions of the input fields
  // generic assertions
  const inputValue = await usingTheGridEmailInput.inputValue(); // inputValue() will extract value from the input field and assign to const
  expect(inputValue).toEqual("test2@test.com");

  // locator assertions
  await expect(usingTheGridEmailInput).toHaveValue("test2@test.com"); //toHaveText() will not work
  // for input filed use toHaveValue();
});
