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

  public getInputByTextLabel(textLabel:string): Locator {
    return this.page.getByText(textLabel)
    .locator('xpath=../..')
    .locator('input')
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
    return this.page.getByRole('listbox').getByText(option)
  }

  public getDatePickerByTextLabel(label: string): Locator {
    return this.page
      .locator('form div')
      .filter({
        hasText: label,
      })
      .getByPlaceholder('yyyy-mm-dd');
  }

  public getRadiobuttonByTextLabel(label: string): Locator {
    return this.page.getByText(label, { exact: true }).locator('xpath=../..');
  }

  public getDropdownByTextLabel(label: string): Locator {
    return this.page
      .getByText(label, { exact: true })
      .locator('xpath=../..')
      .getByText('-- Select --');
  }
  
  public getSaveButtonByHeadingSection(heading: string): Locator {
    return this.page
      .getByRole('heading', { name: heading })
      .locator('xpath=..')
      .getByRole('button', { name: Label.SAVE })
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
    return this.page.getByPlaceholder(Label.USERNAME);
  }

  protected getPasswordInput(): Locator {  
    return this.page.getByPlaceholder(Label.PASSWORD);
  }
  
  protected getLoginButton(): Locator {
    return this.page.getByRole('button', { name: Label.LOGIN });
  }

  async loginUser(mail: string, password: string): Promise<void> {
    await this.getUsernameInput().type(mail);
    await this.getPasswordInput().type( password);
    await this.getLoginButton().click();
}

public async logOut(){
  await this.getSpanByText('Admin User').click()
  await this.getMenuItemByText(Label.LOGOUT).click()
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

  export enum Label {
    USERNAME = 'Username',
    PASSWORD = 'Password',
    CONFIRM_PASSWORD = 'Confirm Password',
    LOGIN_DETAILS = 'Create Login Details',
    SHARE_PHOTOS = 'Share Photos',
    SHARE_VIDEOS = 'Share Videos',
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
    SHARE = 'Share',
    DELETE_POST = 'Delete Post',
    EDIT_POST = 'Edit Post',
    POST = 'Post',
    WHAT_ON_YOUR_MIND = 'What\'s on your mind?',
    MOST_LIKED_POST =' Most Liked Posts ',
    MOST_COMMENTED_POST = ' Most Commented Posts ',
    WRITE_YOUR_COMMENT = 'Write your comment...',
    SHARE_VIDEO = 'Share Video',
    PASTE_VIDEO_URL = 'Paste Video URL'
  }
