import { Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class NavigationPage extends HelperBase {
  // readonly page: Page;

  constructor(page: Page) {
    super(page);
    // // assigning page parameter to the Page field
    // this.page = page;
  }

  async formLayoutsPage() {
    // await this.page.getByText("Forms").click();
    await this.selectGroupMenuItem("Forms");
    await this.page.getByText("Form Layouts").click();
    await this.waitForNumberOfSeconds(2);
  }

  async datepickerPage() {
    // await this.page.getByText("Forms").click();
    await this.selectGroupMenuItem("Forms");
    await this.page.getByText("Datepicker").click();
  }

  async smartTablePage() {
    // await this.page.getByText("Tables & Data").click();
    await this.selectGroupMenuItem("Tables & Data");
    await this.page.getByText("Smart Table").click();
  }

  async toastrPage() {
    // await this.page.getByText("Modal & Overlays").click();
    await this.selectGroupMenuItem("Modal & Overlays");
    await this.page.getByText("Toastr").click();
  }

  async tooltipPage() {
    // await this.page.getByText("Modal & Overlays").click();
    await this.selectGroupMenuItem("Modal & Overlays");
    await this.page.getByText("Tooltip").click();
  }

  // creating a helper method which will be used only by methods of this class and it shouldn't be visible outside of the class
  private async selectGroupMenuItem(groupItemTitle: string) {
    const groupMenuItem = this.page.getByTitle(groupItemTitle);
    // getting value of the property
    const expandedState = await groupMenuItem.getAttribute("aria-expanded");
    if (expandedState === "false") {
      await groupMenuItem.click();
    }
  }
}
