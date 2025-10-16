import { test } from "../test-options";
import { PageManager } from "../page-objects/pageManager";
import { faker } from "@faker-js/faker";

// test.beforeEach(async ({ page }) => {
//   await page.goto("/");
// });

test("Parametrized methods", async ({ pageManager, formLayoutsPage }) => {
//   const pm = new PageManager(page);
  const randomFullName = faker.person.fullName();
  const randomEmail = `${randomFullName.replace(" ", "")}${faker.number.int(
    100
  )}@gmail.com`;
  // const navigateTo = new NavigationPage(page);
  // const formLayoutPage = new FormLayoutsPage(page);
  // const datePickerPage = new DatePickerPage(page);

  //   await pm.navigateTo().formLayoutsPage();
  await pageManager
    .onFormLayoutsPage()
    .submitUsingGridFormWithCredentialsAndSelectOption(
      "test@test.com",
      "test",
      "Option 1"
    );

  await pageManager
    .onFormLayoutsPage()
    .submitInlineFormWithNameEmailAndCheckbox(
      randomFullName,
      randomEmail,
      true
    );

  //   // taking a screenshot after this step
  //   await page
  //     .locator("nb-card", { hasText: "Inline form" })
  //     .screenshot({ path: "screenshots/inlineForm.png" });

  //   // saving screensot as a binary
  //   const buffer = await page.screenshot({
  //     path: "screenshots/inlineFormBinary.png",
  //   });
  //   console.log(buffer.toString("base64"));

  //   await pm.navigateTo().datepickerPage();
  //   await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(5);
  //   await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(5, 10);
});
