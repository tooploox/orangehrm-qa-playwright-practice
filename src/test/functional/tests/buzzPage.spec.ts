import { LoginPage } from '../pages/LoginPage';
import { BuzzPage } from '../pages/BuzzPage';
import { test, expect } from '@playwright/test';
import { adminUserTestData } from '../data';
import { generateRandomString } from '../utils/helper';
import { SubPage } from '../pages/BasePage';

const expectedPostTextAfterEdition = 'post edited';
const filePath = '../test/functional/files/file1.png';
const videoTitle = 'Video is shared';
const mostLiked = 'Most Liked';
const mostCommented = 'Most commented';
const newComment = 'New comment';
const simplePostMessage = 'This is new post message'

const videoUrl = 'https://www.youtube.com/watch?v=7jMlFXouPk8';
const videoUrl2 = 'https://www.youtube.com/watch?v=HhtpBDmBY9w';
const videoUrl3 = 'https://www.youtube.com/watch?v=zvrJbxWrMBQ';

test.describe('Share, edit and delete post', () => {
  let loginPage: LoginPage;
  let buzzPage: BuzzPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    buzzPage = new BuzzPage(page);
    await loginPage.initialize();
    await loginPage.navigateToMainPage();
    await loginPage.loginUser(
      adminUserTestData.userName,
      adminUserTestData.password
    );
  });

  test.afterEach(async ({ page }) => {
    buzzPage = new BuzzPage(page);
    const lpicture = await buzzPage.getThreeDotsButton().count()
    for (let i = 0; i < lpicture; i++) {
      await buzzPage.deleteTheNewestPost(false);
    }
  });

  test('Post should be shared', async ({ page }) => {
    const title = generateRandomString(8);
    await buzzPage.navigateToSubPage(SubPage.BUZZ);
    await buzzPage.sharePostWithPhoto(filePath, title);
    await page.reload();
    await expect(buzzPage.getPostWithTitleAndPhoto(title)).toBeVisible();
  });

  test('Post should be edited', async ({ page }) => {
    const title = generateRandomString(8);
    await buzzPage.navigateToSubPage(SubPage.BUZZ);
    await buzzPage.sharePostWithPhoto(filePath, title);
    await page.reload();
    await buzzPage.editTheNewestPost(expectedPostTextAfterEdition);
    await expect(buzzPage.getPostWithTitleAndPhoto(expectedPostTextAfterEdition)).toBeVisible();
  });
});

test.describe('Most liked and most commented post', () => {
  let loginPage: LoginPage;
  let buzzPage: BuzzPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    buzzPage = new BuzzPage(page);
    await loginPage.initialize();
    await loginPage.navigateToMainPage();
    await loginPage.loginUser(
      adminUserTestData.userName,
      adminUserTestData.password
    );
    await buzzPage.navigateToSubPage(SubPage.BUZZ);
    await buzzPage.shareVideo(videoTitle, videoUrl);
    await buzzPage.shareVideo(mostLiked, videoUrl2);
    await buzzPage.shareVideo(mostCommented, videoUrl3);
  });

  test.afterEach(async ({ page }) => {
    buzzPage = new BuzzPage(page);
    const lvideo = await buzzPage.getThreeDotsButton().count()
    for (let i = 0; i < lvideo; i++) {
      await buzzPage.deleteTheNewestPost(true);
    }
  });

  test('User should upload 3 videos and verify if most liked is on 1st position in most liked tab', async ({ page }) => {
    await buzzPage.getHeartButtonByTitle(mostLiked).click()
    await buzzPage.getMostLikedTab().click();
    await expect(buzzPage.getTextPostBody().first()).toHaveText(mostLiked);
    await expect(buzzPage.getVideoBody()).toHaveCount(3);
  });

  test.only('User should upload 3 videos and verify if most commented is on 1st position in most commented tab', async ({ page }) => {
    await buzzPage.getCommentPostButtonByTitle(mostCommented).click()
    await buzzPage.getCommentInput(mostCommented).type(newComment);
    await page.keyboard.press('Enter');
    await buzzPage.getMostCommentedTab().click();
    await expect(buzzPage.getTextPostBody().first()).toHaveText(mostCommented);
    await expect(buzzPage.getVideoBody()).toHaveCount(3);
  });
});

test.describe('User should be able to write and share post', () => {
  let loginPage: LoginPage;
  let buzzPage: BuzzPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    buzzPage = new BuzzPage(page);
    await loginPage.initialize();
    await loginPage.navigateToMainPage();
    await loginPage.loginUser(
      adminUserTestData.userName,
      adminUserTestData.password
    );
    await buzzPage.navigateToSubPage(SubPage.BUZZ);
  }); 

  test.afterEach(async ({ page }) => {
    buzzPage = new BuzzPage(page);
    const lvideo = await buzzPage.getThreeDotsButton().count()
    for (let i = 0; i < lvideo; i++) {
      await buzzPage.deleteTheNewestPost(false);
    }
  })

  test('User shoud be able to write simple post', async ({ page }) => {
    await buzzPage.sendSimplePost(simplePostMessage)
    await page.reload();
    await expect(buzzPage.getPostWithTitleWithoutPhoto(simplePostMessage)).toBeVisible();
  });

  test('User should be able to share post of other', async ({ page }) => {
    const title = generateRandomString(8);
    const titleForReSharedPost = generateRandomString(8)
    await buzzPage.sharePostWithPhoto(filePath, title);
    await page.reload();
    await buzzPage.reshareOtherPost(title, titleForReSharedPost)
    await expect(buzzPage.getPostWithTitleAndPhoto(titleForReSharedPost)).toBeVisible();
    await expect(buzzPage.getOriginalTextOfReSharedPostWithPhoto(title)).toBeVisible();
  });
});
