import { Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class FormLayoutsPage extends HelperBase {
  // creating new fileds for the page
  // private readonly page: Page;

  // creating constructor
  constructor(page: Page) {
    super(page);
    // this.page = page;
  }

  async submitUsingGridFormWithCredentialsAndSelectOption(
    email: string,
    password: string,
    optionText: string
  ) {
    const usingTheGridForm = this.page.locator("nb-card", {
      hasText: "Using the Grid",
    });

    await usingTheGridForm.getByRole("textbox", { name: "Email" }).fill(email);
    await usingTheGridForm
      .getByRole("textbox", { name: "Password" })
      .fill(password);
    await usingTheGridForm
      .getByRole("radio", { name: optionText })
      .check({ force: true });
    await usingTheGridForm.getByRole("button").click();
  }

  /**
   * Submit inline form with name, email and checkbox
   * @param name - name to be filled in the form
   * @param email - email to be filled in the form
   * @param rememberMeCheckbox - boolean value to determine whether to check the checkbox or not
   */
  async submitInlineFormWithNameEmailAndCheckbox(
    name: string,
    email: string,
    rememberMeCheckbox: boolean
  ) {
    const inlineForm = this.page.locator("nb-card", {
      hasText: "Inline form",
    });

    await inlineForm.getByRole("textbox", { name: "Jane Doe" }).fill(name);
    await inlineForm.getByRole("textbox", { name: "Email" }).fill(email);

    if (rememberMeCheckbox) {
      await inlineForm.getByRole("checkbox").check({ force: true });
      await inlineForm.getByRole("button").click();
    }
  }
}
