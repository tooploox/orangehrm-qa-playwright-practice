import { test, expect, Page } from "@playwright/test";
import { PimPage } from "../pages/PimPage";
import { LoginPage } from "../pages/LoginPage";
import { adminUserTestData, normalUserTestData } from "../data";
import { SubPage } from "../pages/BasePage";
import { generateRandomString } from "../utils/helper";
import { newEmployeeTestData } from "../data";

async function tableCellsGotByName(page: Page) {
  const pimPage = new PimPage(page);
  const adminUserCell = await pimPage.getCellByEmployeeName(
    adminUserTestData.userName.slice(0, adminUserTestData.userName.indexOf(" "))
  );
  const normalUserCell = await pimPage.getCellByEmployeeName(
    normalUserTestData.userName.slice(
      0,
      normalUserTestData.userName.indexOf(" ")
    )
  );
  return [adminUserCell, normalUserCell];
}

test.describe("Admin user should be able to manage on pim page", () => {
  let loginPage: LoginPage;
  let pimPage: PimPage;
  const newEmployeeName = generateRandomString(3);
  const newEmployeeNameForEditing = generateRandomString(3);
  const editedEmployeeName = generateRandomString(3) + "Edited";
  const nameForMultiplyDelete1 = generateRandomString(3);
  const nameForMultipluDelete2 = generateRandomString(3);

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    pimPage = new PimPage(page);
    await loginPage.initialize();
    await loginPage.navigateToMainPage();
    await loginPage.loginUser(
      adminUserTestData.userName,
      adminUserTestData.password
    );
    await pimPage.navigateToSubPage(SubPage.PIM);
  });

  test("Admin user should add employee", async ({ page }) => {
    await pimPage.addEmployee(
      newEmployeeTestData.firstName + newEmployeeName
    );
    await pimPage.navigateToSubPage(SubPage.PIM);
    await page.waitForLoadState("networkidle");
    await expect(
      pimPage.getCellByEmployeeName(newEmployeeName)
    ).toBeVisible();
  });

  test("Admin user should edit previousely created employee with dynamically created name", async ({
    page,
  }) => {
    await pimPage.addEmployee(
      newEmployeeTestData.firstName + newEmployeeNameForEditing
    );
    await pimPage.navigateToSubPage(SubPage.PIM);
    await pimPage
      .getEditIconByEmployeeName(newEmployeeNameForEditing)
      .click();
    await pimPage.editEmployee(editedEmployeeName);
    await pimPage.navigateToSubPage(SubPage.PIM);
    await page.waitForLoadState("networkidle");
    await expect(
      pimPage.getCellByEmployeeName(editedEmployeeName)
    ).toBeVisible();
  });

  test("Delete mulitiply users", async ({ page }) => {
    await pimPage.addEmployee(
      newEmployeeTestData.firstName + nameForMultiplyDelete1
    );
    await pimPage.navigateToSubPage(SubPage.PIM);
    await pimPage.addEmployee(
      newEmployeeTestData.firstName + nameForMultipluDelete2
    );
    await pimPage.navigateToSubPage(SubPage.PIM);
    await pimPage
      .getCheckIconByEmployeeName(nameForMultiplyDelete1)
      .click();
    await pimPage
      .getCheckIconByEmployeeName(nameForMultipluDelete2)
      .click();
    await pimPage.getMultiplyDeleteButton().click();
    await pimPage.getConfirmDeleteButton().click();
    await expect(pimPage.getCheckIconByEmployeeName(nameForMultiplyDelete1)).toHaveCount(0);
    await expect(pimPage.getCheckIconByEmployeeName(nameForMultipluDelete2)).toHaveCount(0);
  });

  test('User should search for employee by name', async ({ page }) => {
    const tableCells = await tableCellsGotByName(page);
    await pimPage.searchEmployeeByName(adminUserTestData.userName)
    await page.waitForLoadState('networkidle')
    await expect((tableCells[0])).toBeVisible();
    await expect((tableCells[1])).not.toBeVisible()
  })

  test('User should reset search that was done by name', async ({ page }) => {
    await pimPage.searchEmployeeByName(adminUserTestData.userName)
    const tableCells = await tableCellsGotByName(page);
    await page.waitForLoadState('networkidle')
    await expect.soft((tableCells[0])).toBeVisible();
    await expect.soft((tableCells[1])).not.toBeVisible()
    await pimPage.getResetButton().click()
    await page.waitForLoadState('networkidle')
    await expect((tableCells[0])).toBeVisible();
    await expect((tableCells[1])).toBeVisible()
  })

  test('User should search for employee by id', async ({ page }) => {
    const tableCells = await tableCellsGotByName(page);
    await pimPage.searchEmployeeById(adminUserTestData.id)
    await page.waitForLoadState('networkidle')
    await expect((tableCells[0])).toBeVisible();
    await expect((tableCells[1])).not.toBeVisible()
  })

  test('User should reset search that was done by id', async ({ page }) => {
    await pimPage.searchEmployeeById(adminUserTestData.id)
    const tableCells = await tableCellsGotByName(page);
    await page.waitForLoadState('networkidle')
    await expect.soft((tableCells[0])).toBeVisible();
    await expect.soft((tableCells[1])).not.toBeVisible()
    await pimPage.getResetButton().click()
    await page.waitForLoadState('networkidle')
    await expect((tableCells[0])).toBeVisible();
    await expect((tableCells[1])).toBeVisible()
  })

  test("Admin user should delete employee//Clean all data after tests..", async ({
    page,
  }) => {
    const pimPage = new PimPage(page);
    await pimPage
      .getTrashBinByEmployeeName(newEmployeeName)
      .click();
    await pimPage.getConfirmDeleteButton().click();
    await pimPage
      .getTrashBinByEmployeeName(editedEmployeeName)
      .click();
    await pimPage.getConfirmDeleteButton().click();
    await expect(
      pimPage.getTrashBinByEmployeeName(newEmployeeName)
    ).toHaveCount(0);
    await expect(
      pimPage.getTrashBinByEmployeeName(editedEmployeeName)
    ).toHaveCount(0);
  });

  test('Admin user should add employee from sub page: Add employee', async ({ page }) => {
    const newEmployeeName = generateRandomString(3);
    const firstName = newEmployeeTestData.firstName + newEmployeeName
    await pimPage.addEmployee(firstName, true);
    await pimPage.navigateToSubPage(SubPage.PIM);
    await page.waitForLoadState('networkidle')
    await expect((pimPage.getCellByEmployeeName(newEmployeeName))).toBeVisible();
  });

  test('Admin user should add employee from sub page "Add employee" with loging details', async ({ page }) => {
    const newEmployeeName = generateRandomString(3);
    const firstName = newEmployeeTestData.firstName + newEmployeeName
    const fullName = newEmployeeTestData.firstName + newEmployeeName + ' ' + newEmployeeTestData.lastName
    const messagestUrl = 'http://localhost:8888/web/index.php/core/i18n/messages'
    await pimPage.addEmployeeWithLoginDetails(firstName, true);
    await page.waitForRequest(messagestUrl)
    await pimPage.logOut()
    await pimPage.loginUser(firstName, adminUserTestData.password )
    await expect(loginPage.chooseDropdownOptionByText(newEmployeeName)).toHaveText(fullName);
  });

  test('Admin user should add employee with loging details', async ({ page }) => {
    const newEmployeeName = generateRandomString(3);
    const firstName = newEmployeeTestData.firstName + newEmployeeName
    const fullName = newEmployeeTestData.firstName + newEmployeeName + ' ' + newEmployeeTestData.lastName
    const messagestUrl = 'http://localhost:8888/web/index.php/core/i18n/messages'
    await pimPage.addEmployeeWithLoginDetails(firstName);
    await page.waitForRequest(messagestUrl)
    await pimPage.logOut()
    await pimPage.loginUser(firstName, adminUserTestData.password )
    await expect(loginPage.chooseDropdownOptionByText(newEmployeeName)).toHaveText(fullName);
  })
});
