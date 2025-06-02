import { expect, Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class DatePickerPage extends HelperBase {
  // readonly page: Page;

  constructor(page: Page) {
    super(page);
    // this.page = page;
  }

  async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number) {
    const calendarInputField = this.page.getByPlaceholder("Form Picker");
    await calendarInputField.click();

    const dateToAssert = await this.selectDateInTheCalendar(
      numberOfDaysFromToday
    );

    await expect(calendarInputField).toHaveValue(dateToAssert);
  }

  async selectDatePickerWithRangeFromToday(
    startDateFromToday: number,
    endDateFromToday: number
  ) {
    const calendarInputField = this.page.getByPlaceholder("Range Picker");
    await calendarInputField.click();

    const startDate = await this.selectDateInTheCalendar(startDateFromToday);
    const endDate = await this.selectDateInTheCalendar(endDateFromToday);

    await expect(calendarInputField).toHaveValue(`${startDate} - ${endDate}`);
  }

  // creating a method to be used inside od the methods of this class
  private async selectDateInTheCalendar(numberOfDaysFromToday: number) {
    // introducing the new text object
    let date = new Date(); // object to perform operations with date and time
    date.setDate(date.getDate() + numberOfDaysFromToday); //getting the next day
    const expectedDate = date.getDate().toString();
    // creating a const for the month
    const expectedMonthShort = date.toLocaleString("En-US", { month: "short" });
    const expectedMonthLong = date.toLocaleString("En-US", { month: "long" });
    const expectedYear = date.getFullYear();
    // creating a date to represent the assertion using JS interpolation
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

    let calendarMonthAndYear =
      (await this.page.locator("nb-calendar-view-mode").textContent()) || "";
    const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`;

    // creating a loop to compare the expected calendar date with the actual one
    while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
      await this.page
        .locator("nb-calendar-pageable-navigation [data-name='chevron-right']")
        .click();
      calendarMonthAndYear =
        (await this.page.locator("nb-calendar-view-mode").textContent()) || "";
    }

    // selecting all elements related to the current month (June in the example)
    await this.page
      .locator(".day-cell.ng-star-inserted")
      .getByText(expectedDate, { exact: true })
      .click();

    // getByText() looks for a partial match, for exact match provide {exact: true}

    return dateToAssert;
  }
}
