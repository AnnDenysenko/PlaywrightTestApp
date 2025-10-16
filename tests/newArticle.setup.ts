import {test as setup} from "@playwright/test";

setup("Create new article", async ({page}) => {
    await page.goto("https://angularjs.realworld.io/#/");
    await page.getByText('Global Feed').click();
    const firstLikeButton = page.locator('app-articlr-preview').first().locator('button');
    await firstLikeButton.click();
});