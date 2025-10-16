import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Form Layouts page", () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
  });

  test("Input fields", async ({ page }) => {
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
    await usingTheGridEmailInput.pressSequentially("test2@test.com", {
      delay: 500,
    });

    // assertions of the input fields
    // generic assertions
    const inputValue = await usingTheGridEmailInput.inputValue(); // inputValue() will extract value from the input field and assign to const
    expect(inputValue).toEqual("test2@test.com");

    // locator assertions
    await expect(usingTheGridEmailInput).toHaveValue("test2@test.com"); //toHaveText() will not work
    // for input filed use toHaveValue();
  });

  test("Radio buttons", async ({ page }) => {
    const usingTheGridForm = page.locator("nb-card", {
      hasText: "Using the Grid",
    });

    await usingTheGridForm.getByLabel("Option 1").check({ force: true }); // method to select a checkbox, with "force" we bypass validation (class = visually-hidden)

    await usingTheGridForm
      .getByRole("radio", { name: "Option 1" })
      .check({ force: true });

    const radioStatus = await usingTheGridForm
      .getByRole("radio", { name: "Option 1" })
      .isChecked(); // will check if checkbox is selected or not, returns boolean

    expect(radioStatus).toBeTruthy();

    await expect(
      await usingTheGridForm.getByRole("radio", { name: "Option 1" })
    ).toBeChecked();

    // selecting the second checkbox
    await usingTheGridForm.getByLabel("Option 2").check({ force: true });

    //validate that first checkbox is not checked
    expect(
      await usingTheGridForm
        .getByRole("radio", { name: "Option 1" })
        .isChecked()
    ).toBeFalsy();

    expect(
      await usingTheGridForm
        .getByRole("radio", { name: "Option 2" })
        .isChecked()
    ).toBeTruthy();
  });
});

test("Checkboxes", async ({ page }) => {
  await page.getByText("Modal & Overlays").click();
  await page.getByText("Toastr").click();

  await page
    .getByRole("checkbox", { name: "Hide on click" })
    .uncheck({ force: true });

  await page
    .getByRole("checkbox", { name: "Prevent arising of duplicate toast" })
    .check({ force: true });

  // check() method will check the status of the checkbox and if checkbox already checked - it will not unselect this checkbox
  // click() perfoms the click and doesn't validate a status of checkbox

  // check all checkboxes on the page
  const allBoxes = page.getByRole("checkbox");

  for (const box of await allBoxes.all()) {
    await box.check({ force: true });

    expect(await box.isChecked()).toBeTruthy();

    await box.uncheck({ force: true });

    expect(await box.isChecked()).toBeFalsy();

    // loop for can be used with arrays only and .all() will turn all values into array
  }
});

test("Lists and dropdowns", async ({ page }) => {
  const dropdownMenu = page.locator("ngx-header nb-select"); // nb-select is child to ngx-header

  await dropdownMenu.click();

  //to interact with the list
  page.getByRole("list"); // when the list has a UL tag
  page.getByRole("listitem"); // when the list has LI tag

  // const optionList = page.getByRole('list').locator('nb-option');

  // more compact way
  const optionList = page.locator("nb-option-list nb-option"); // return an array

  await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]); //items expected to be in the array

  // select an item from the list
  await optionList.filter({ hasText: "Cosmic" }).click();

  // validate a background color
  const header = page.locator("nb-layout-header");
  await expect(header).toHaveCSS("background-color", "rgb(50, 50, 89)");

  // validate every color and every selection option from the dropdown list
  // defining all the expectations

  const colors = {
    Light: "rgb(255, 255, 255)",
    Dark: "rgb(34, 43, 69)",
    Cosmic: "rgb(50, 50, 89)",
    Corporate: "rgb(255, 255, 255)",
  };

  // making a loop through the list of colors
  await dropdownMenu.click();
  for (const color in colors) {
    await optionList.filter({ hasText: color }).click();
    await expect(header).toHaveCSS("background-color", colors[color]);
    if (color != "Corporate") {
      await dropdownMenu.click();
    }
  }
});

test("Tooltips", async ({ page }) => {
  await page.getByText("Modal & Overlays").click();
  await page.getByText("Tooltip").click();

  const toolTipCard = page.locator("nb-card", {
    hasText: "Tooltip Placements",
  });
  await toolTipCard.getByRole("button", { name: "Top" }).hover();

  // another way of identyfying a tooltip (only would work if you have a role tooltip created for your web-element)
  page.getByRole("tooltip");
  const tooltip = await page.locator("nb-tooltip").textContent();
  expect(tooltip).toEqual("This is a tooltip");
});

test("Dialogue boxes", async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();

  // to overcome cancelling a popping up dialogue box call page.on() dialog listener
  page.on("dialog", (dialog) => {
    expect(dialog.message()).toEqual("Are you sure you want to delete?");
    dialog.accept();
  });

  await page
    .getByRole("table")
    .locator("tr", { hasText: "mdo@gmail.com" })
    .locator(".nb-trash")
    .click(); // automatically Playwright cancels a popping up dialogue box

  // validate that the first row doesnt have a deleted email
  await expect(page.locator("table tr").first()).not.toHaveText(
    "mdo@gmail.com"
  );
});

test("Web Tables", async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();

  // get the row by any text in this row
  const targetRow = page.getByRole("row", { name: "twitter@outlook.com" });
  await targetRow.locator(".nb-edit").click();
  await page.locator("input-editor").getByPlaceholder("Age").clear();
  await page.locator("input-editor").getByPlaceholder("Age").fill("35");
  await page.locator(".nb-checkmark").click();

  // get the row based on the value in the specific column
  // navigate to the 2nd page
  await page.locator(".ng2-smart-pagination-nav").getByText("2").click();

  // using filter since multiple rows with the same value are returned
  const targetRowById = page
    .getByRole("row", { name: "11" })
    .filter({ has: page.locator("td").nth(1) })
    .getByText("11");

  //.nth(1) selects the second element (index starts at 0) in the set of elements matched by page.locator("td")

  await targetRowById.locator(".nb-edit").click();

  // changing value in email field
  await page.locator("input-editor").getByPlaceholder("Email").clear();
  await page
    .locator("input-editor")
    .getByPlaceholder("Email")
    .fill("test@test.com");
  await page.locator(".nb-checkmark").click();

  await expect(targetRowById.locator("td").nth(5)).toHaveText("test@test.com");
});

test("Web tables 2", async ({ page }) => {
  // test filter of the table
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();

  // defining test data I want to use
  const ages = ["20", "30", "40", "200"];

  //trying each of these values and validating the result
  for (let age of ages) {
    await page.locator("input-filter").getByPlaceholder("Age").clear();
    await page.locator("input-filter").getByPlaceholder("Age").fill(age);
    await page.waitForTimeout(500);
    const ageRows = page.locator("tbody tr");

    // all will create an array of ages
    for (let row of await ageRows.all()) {
      const cellValue = await row.locator("td").last().textContent();

      if (age == "200") {
        expect(await page.getByRole("table").textContent()).toContain(
          "No data found"
        );
      } else {
        expect(cellValue).toEqual(age);
      }
    }
  }
});

test("Date picker", async ({ page }) => {
  await page.getByText("Forms").click();
  await page.getByText("Datepicker").click();

  const calendarInputField = page.getByPlaceholder("Form Picker");
  await calendarInputField.click();

  // selecting all elements related to the current month (June in the example)
  await page
    .locator('[class="day-cell ng-star-inserted"]')
    .getByText("1", { exact: true })
    .click();

  // getByText() looks for a partial match, for exact match provide {exact: true}

  await expect(calendarInputField).toHaveValue("June 1, 2023");
});

test("Date picker 2", async ({ page }) => {
  await page.getByText("Forms").click();
  await page.getByText("Datepicker").click();

  const calendarInputField = page.getByPlaceholder("Form Picker");
  await calendarInputField.click();

  // introducing the new text object

  let date = new Date(); // object to perform operations with date and time
  date.setDate(date.getDate() + 100); //getting the next day
  const expectedDate = date.getDate().toString();
  // creating a const for the month
  const expectedMonthShort = date.toLocaleString("En-US", { month: "short" });
  const expectedMonthLong = date.toLocaleString("En-US", { month: "long" });
  const expectedYear = date.getFullYear();
  // creating a date to represent the assertion using JS interpolation
  const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

  let calendarMonthAndYear =
    (await page.locator("nb-calendar-view-mode").textContent()) || "";
  const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`;

  // creating a loop to compare the expected calendar date with the actual one
  while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
    await page
      .locator("nb-calendar-pageable-navigation [data-name='chevron-right']")
      .click();
    calendarMonthAndYear =
      (await page.locator("nb-calendar-view-mode").textContent()) || "";
  }

  // selecting all elements related to the current month (June in the example)
  await page
    .locator('[class="day-cell ng-star-inserted"]')
    .getByText(expectedDate, { exact: true })
    .click();

  // getByText() looks for a partial match, for exact match provide {exact: true}

  await expect(calendarInputField).toHaveValue(dateToAssert);
});

test("Sliders", async ({ page }) => {
  // 1st shortcut method
  // Update slider attribute
  const tempGauge = page.locator(
    '[tabtitle="Temperature"] ngx-temperature-dragger circle'
  );

  // // getting cy and cx coordinates
  // await tempGauge.evaluate((node) => {
  //   node.setAttribute("cx", "232.630");
  //   node.setAttribute("cy", "232.630");
  // });

  // await tempGauge.click();

  // 2nd more verbose method (simulate actual mouse movement);
  // Mouse movement
  const tempBox = page.locator(
    '[tabtitle="Temperature"] ngx-temperature-dragger'
  );
  // making sure the entire box is visible
  await tempBox.scrollIntoViewIfNeeded();

  // defining a bounding box
  const box = await tempBox.boundingBox();

  if (!box) {
    throw new Error("Temperature box element not found or not visible");
  }

  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;

  // start moving mouse from the center of the box

  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 100, y);
  await page.mouse.move(x + 100, y + 100);
  await page.mouse.up(); // releasing the mouse

  await expect(tempBox).toContainText("30");
});

test(" Drag & Drop with iFrames", async ({ page }) => {});
