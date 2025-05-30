import { test, expect } from "@playwright/test";
import { allowedNodeEnvironmentFlags } from "process";

// test.beforeAll(async ({ page }) => {});

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");

  await page.getByText("Forms").click();

  await page.getByText("Form Layouts").click();
});

test.skip("Locator syntax rules", async ({ page }) => {
  // by tag name
  page.locator("input").first().click(); //click the first found input on the page

  // by ID
  await page.locator("#inputEmail1").click();

  //by class
  page.locator(".shape-rectangle");

  // by attribute
  page.locator('[placehoder="Email"]');

  //by class value (full)
  page.locator(
    '[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]'
  );

  //combine different seelctors (to make it more unique)
  page.locator('input[placehoder="Email"] [nbinput]'); //element to have all 3 attributes

  //by Xpath (not recommended)
  page.locator('//*[@id="inputEmail1"]');

  //by partial text match
  page.locator(':text("Using")');

  //by exact text match
  page.locator(':text-is("Using the Grid")');
});

test.skip("User-facing locators", async ({ page }) => {
  await page.getByRole("textbox", { name: "Email" }).first().click();
  await page.getByRole("button", { name: "Sign in" }).first().click();

  await page.getByLabel("Email").first().click();

  await page.getByPlaceholder("Jane Doe").click();

  await page.getByText("Using the Grid").click();

  await page.getByTitle("IoT Dashboard").click();

  await page.getByTestId("SignIn").click(); //dedicated attribute in source code, but not user-facing
});

test.skip("Locating child elements", async ({ page }) => {
  await page.locator('nb-card nb-radio :text-is("Option 1")').click(); //chaining locators, the best approach
  // alternative to the 1st option
  await page
    .locator("nb-card")
    .locator("nb-radio")
    .locator(':text-is("Option 2")')
    .click();

  await page
    .locator("nb-card")
    .getByRole("button", { name: "Sign " })
    .first()
    .click(); //nb-card is not much needed in this example, regular locator methods can be mixed with user-facing locators

  // using index of the element, nth is index, starts from 0
  await page.locator("nb-card").nth(3).getByRole("button").click(); //the lease preferable because order of elements can be changed
});

test.skip("Locating parent elements", async ({ page }) => {
  await page
    .locator("nb-card", { hasText: "Using the Grid" })
    .getByRole("textbox", { name: "Email" })
    .click();

  await page
    .locator("nb-card", { has: page.locator("#inputEmail1") })
    .getByRole("textbox", { name: "Email" })
    .click();

  await page
    .locator("nb-card")
    .filter({ hasText: "Basic form" })
    .getByRole("textbox", { name: "Email" })
    .click();

  await page
    .locator("nb-card")
    .filter({ has: page.locator(".status-danger") })
    .getByRole("textbox", { name: "Password" })
    .click();

  await page
    .locator("nb-card") //found all nb-cards
    .filter({ has: page.locator("nb-checkbox") }) // found all nb-cards having checkbox
    .filter({ hasText: "Sign In" }) //checkbox with Sign In
    .getByRole("textbox", { name: "Email" })
    .click();

  // '..' - goes onw level up
  await page
    .locator(':text-is("Using the Grid")')
    .locator("..")
    .getByRole("textbox", { name: "Email" })
    .click();
});

test.skip("Reusing the locators", async ({ page }) => {
  const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });

  const emailField = basicForm.getByRole("textbox", { name: "Email" });

  await emailField.fill("test@test.com");

  await basicForm.getByRole("textbox", { name: "Password" }).fill("Welcome123");

  await basicForm.locator("nb-checkbox").click();

  await basicForm.getByRole("button").click();

  await expect(emailField).toHaveValue("test@test.com");
});

test("Extracting values", async ({ page }) => {
  // single text value
  const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });

  const buttonText = await basicForm.locator("button").textContent(); // extracting text from the web element using textContent()

  expect(buttonText).toEqual("Submit");

  // all text values
  const allRadioButtonsLabels = await page
    .locator("nb-radio")
    .allTextContents(); // extracting all values from all nb-radio elements

  expect(allRadioButtonsLabels).toContain("Option 1");

  // input fields values
  const emailField = basicForm.getByRole("textbox", { name: "Email" });

  await emailField.fill("test@test.com");

  const emailValue = await emailField.inputValue(); // to get properly value of input field which is not a text

  expect(emailValue).toEqual("test@test.com");

  // value of the attribute
  const placeholderValue = await emailField.getAttribute("placeholder"); // attribute that I need to get a value for, getting value of this particular attribute

  expect(placeholderValue).toEqual("Email");
});

// playwright has 2 types of assertions - GENERAL and LOCATORS assertions
test.skip("Assertions", async ({ page }) => {
  // general assertions
  const value = 5;

  expect(value).toEqual(5); // logic = comparing value on the left to the value on the right

  const basicFormButton = page
    .locator("nb-card")
    .filter({ hasText: "Basic form" })
    .locator("button");

  const text = await basicFormButton.textContent();

  expect(text).toEqual("Submit");

  // locator assertions
  await expect(basicFormButton).toHaveText("Submit"); // toHaveTxt() method will search for the text inside of this web element and then will make an asserion
  // locator assertions will always wait for elements

  // soft assertions(to continue test even if assertion has failed)
  await expect.soft(basicFormButton).toHaveText("Submit"); // if we fail this test will continue and still will click the button
  await basicFormButton.click();

  // SOFT can be used to allow to fail but proceed to catch others validations

  /* there are 2 types of assertions
  general assertions will not wait for any conditions
  locator assertions can interact and wait for a web element up to 5 seconds 
  */
});

/***************************************************************************************************** */

// test("The first test", async ({ page }) => {
//   await page.getByText("Form Layouts").click();
// });

// test("Navigate to Datepicker page", async ({ page }) => {
//   await page.getByText("Datepicker").click();
// });

// test.afterEach();
// test.afterAll();

// test.describe('Test suit 1', () => {
//     test("The first test", () => {

//     });
// })
