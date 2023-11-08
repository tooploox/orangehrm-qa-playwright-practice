import { Page, Browser, chromium, Locator } from '@playwright/test';
import config from '../../playwright.config';

export class BasePage {
  private browser: Browser | null = null;
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async initialize(): Promise<void> {
    this.browser = await chromium.launch();
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async navigateToMainPage(): Promise<void> {
    await this.page.goto(config.baseUrl);
    await this.page.waitForURL(config.baseUrl);
  }

  public async navigateToSubPage(subPage: SubPage): Promise<void> {
    await this.page.getByRole('link', { name: subPage }).click();
  }

  protected getTextboxByPlaceholder(placeholder: string): Locator {
    return this.page.getByPlaceholder(placeholder);
  }

  protected getTextboxByTextLabel(label: string): Locator {
    return this.page.getByText(label, { exact: true }).locator('xpath=../..').getByRole('textbox');
  }

  public getToggleByTextLabel(label: string): Locator {
    return this.page.getByText(label, { exact: true }).locator('xpath=../..').locator('span');
  }

  public chooseDropdownOptionByText(option: string) {
    return this.page.getByRole('banner').getByText(option)
  }

  protected getDatePickerByTextLabel(label: string): Locator {
    return this.page
      .locator('form div')
      .filter({
        hasText: label,
      })
      .getByPlaceholder('yyyy-mm-dd');
  }

  protected getRadiobuttonByTextLabel(label: string): Locator {
    return this.page.getByText(label, { exact: true }).locator('xpath=../..');
  }

  protected getDropdownByTextLabel(label: string): Locator {
    return this.page
      .getByText(label, { exact: true })
      .locator('xpath=../..')
      .getByText('-- Select --');
  }
  
  public getSaveButtonByHeadingSection(heading: string): Locator {
    return this.page
      .getByRole('heading', { name: heading })
      .locator('xpath=..')
      .getByRole('button', { name: Labels.SAVE })
  }

  protected getSpanByText(text: string): Locator {
    return this.page
    .locator('span')
    .filter({hasText: text})
  }

  protected getMenuItemByText(text: string): Locator {
    return this.page
    .getByRole('menuitem')
    .filter({ hasText: text })
  }

  protected getUsernameInput(): Locator {  
    return this.page.getByPlaceholder(Labels.USERNAME);
  }

  protected getPasswordInput(): Locator {  
    return this.page.getByPlaceholder(Labels.PASSWORD);
  }
  
  protected getLoginButton(): Locator {
    return this.page.getByRole('button', { name: Labels.LOGIN });
  }

  async loginUser(mail: string, password: string): Promise<void> {
    await this.getUsernameInput().type(mail);
    await this.getPasswordInput().type( password);
    await this.getLoginButton().click();
}

public async logOut(){
  await this.getSpanByText('Admin User').click()
  await this.getMenuItemByText(Labels.LOGOUT).click()
}


}

  export enum SubPage {
    ADMIN = 'Admin',
    PIM = 'PIM',
    LEAVE = 'Leave',
    TIME = 'Time',
    RECRUITMENT = 'Recruitment',
    MY_INFO = 'My Info',
    PERFORMANCE = 'Performance',
    DASHBOARD = 'Dashboard',
    DIRECTORY = 'Directory',
    MAINTENANCE = 'Maintenance',
    CLAIM = 'Claim',
    BUZZ = 'BUZZ',
    ADD_EMPLOYEE = 'Add Employee'
  }

  export enum Labels {
    USERNAME = 'Username',
    PASSWORD = 'Password',
    CONFIRM_PASSWORD = 'Confirm Password',
    LOGIN_DETAILS = 'Create Login Details',
    SHARE_PHOTOS = 'Share Photos',
    ADD = 'Add',
    FIRST_NAME = 'First Name',
    LAST_NAME = 'Last Name',
    MIDDLE_NAME = 'Middle Name',
    SAVE = 'Save',
    YES_DELETE  = 'Yes, Delete',
    DELETE_SELECTED = 'Delete Selected',
    TYPE_FOR_HINTS = 'Type for hints...',
    SEARCH = "Search",
    RESET = "Reset",
    LOGIN = 'Login',
    LOGOUT = 'Logout',
  }
