

import  {test, expect, request} from "@playwright/test";

test("Likes counter", async ({page}) => {
await page.goto("https://angularjs.realworld.io/#/");
await page.getByText('Global Feed').click();
// getting first article
const firstLikeButton = page.locator('app-articlr-preview').first().locator('button');
await firstLikeButton.click();
});

