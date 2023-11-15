import { BasePage, SubPage, Label } from "./BasePage";
import { adminUserTestData, newEmployeeTestData } from "../data";
import { Locator } from "@playwright/test";

export class PimPage extends BasePage {

  protected getAddEmployeeButtonn(
    ): Locator {
      return this.page.getByRole("button", {
        name: Label.ADD,
      });
    }

  protected getFirstNameInput(
    ): Locator {
      return  this.page.getByPlaceholder(Label.FIRST_NAME);
    }

  protected getMiddleNameInput(
    ): Locator {
      return  this.page.getByPlaceholder(Label.MIDDLE_NAME);
    }

  protected getLastNameInput(
    ): Locator {
      return  this.page.getByPlaceholder(Label.LAST_NAME);
    }

  protected getSaveUserButton(
    ): Locator {
      return  this.page.getByRole("button", {
        name: Label.SAVE,
      });    
    }

  public getConfirmDeleteButton(
    ): Locator {
      return  this.page.getByRole("button", {
        name: Label.YES_DELETE,
      });
    }

  public getMultiplyDeleteButton(
    ): Locator {
      return  this.page.getByRole("button", {
        name: Label.DELETE_SELECTED,
      });
    }
  
  protected getEmployeeNameInput(
    ): Locator {
      return  this.page
      .getByPlaceholder(Label.TYPE_FOR_HINTS)
      .first();
    }

  protected getEmployeeIdInput(
    ): Locator {
      return  this.page.getByRole("textbox").nth(2);
    }

  protected getSearchEmployeeButton(
    ): Locator {
      return  this.page.getByRole("button", {
        name: Label.SEARCH,
      });
    }

  public getResetButton(
    ): Locator {
      return  this.page.getByRole("button", {
        name: Label.RESET,
      });
    }

  // public getCellByEmployeeName(employeeName: string):Locator {
  //   return this.page.locator(`.oxd-table-cell:has(:text("${employeeName}"))`);
  // } 
  //this also works, let's keep it in codebase for poor times
  
  public getCellByEmployeeName(
    employeeName: string
  ): Locator {
    return this.page
    .getByRole('cell', {name: employeeName})
  }

  // public getTrashBinByEmployeeName(employeeName: string):Locator {
  //   return this.page.locator(`.oxd-table-card:has(:text("${employeeName}")) .oxd-icon.bi-trash`);
  // } 
  // this also works, let's keep it in codebase for poor times

  public getTrashBinByEmployeeName(
    employeeName: string
  ): Locator {
    return this.page
      .getByText(employeeName)
      .locator("xpath=../..")
      .getByRole("button")
      .locator(".bi-trash");
  }

  // public  getEditIconByEmployeeName(employeeName: string): Locator {
  //   return this.page.locator( `.oxd-table-card:has(:text("${employeeName}")) .oxd-icon.bi-pencil-fill`);
  // } 
  //this also works, let's keep it in codebase for poor times

  public getEditIconByEmployeeName(employeeName: string): Locator {
    return this.page
    .getByText(employeeName)
    .locator('xpath=../..')
    .getByRole('button')
    .locator('.bi-pencil-fill')
  }

  // public  getCheckIconByEmployeeName(employeeName: string):Locator {
  //   return this.page.locator(`.oxd-table-card:has(:text("${employeeName}")) .oxd-checkbox-input-icon`);
  // } 
  // this also works, let's keep it in codebase for poor times

  public getCheckIconByEmployeeName(
    employeeName: string
  ): Locator {
    return this.page
      .getByText(employeeName)
      .locator("xpath=../..")
      .locator("span")
  }

  public getInputByLabelText(label: string): Locator {
    return this.page
      .getByText(label, { exact: true })
      .locator("xpath=../..")
      .locator("input");
  }

  public async addEmployee(firstName: string, bySubtab?: boolean) {
    if (bySubtab) {
      await this.navigateToSubPage(SubPage.ADD_EMPLOYEE);
    } else {
      await this.getAddEmployeeButtonn().click();
    }
    await this.getFirstNameInput().type(firstName);
    await this.getMiddleNameInput().type(newEmployeeTestData.middleName);
    await this.getLastNameInput().type(newEmployeeTestData.lastName);
    await this.getSaveUserButton().click();
  }

  public async addEmployeeWithLoginDetails(
    firstName: string,
    bySubtab?: boolean
  ) {
    if (bySubtab) {
      await this.navigateToSubPage(SubPage.ADD_EMPLOYEE);
    } else {
      await this.getAddEmployeeButtonn().click();
    }
    await this.getFirstNameInput().type(firstName);
    await this.getMiddleNameInput().type(newEmployeeTestData.middleName);
    await this.getLastNameInput().type(newEmployeeTestData.lastName);
    await this.getToggleByTextLabel(Label.LOGIN_DETAILS).click();
    await this.getInputByLabelText(Label.USERNAME).type(firstName);
    await this.getInputByLabelText(Label.PASSWORD).type(adminUserTestData.password);
    await this.getInputByLabelText(Label.CONFIRM_PASSWORD).type(adminUserTestData.password);
    await this.getSaveButtonByHeadingSection(SubPage.ADD_EMPLOYEE).click();
  }

  public async editEmployee(newEmployeeName: string) {
    await this.page.waitForLoadState("load");
    await this.getFirstNameInput().fill(newEmployeeName);
    await this.getSaveUserButton().click();
  }

  public async searchEmployeeByName(employeeName: string) {
    await this.getEmployeeNameInput().type(employeeName);
    await this.getSearchEmployeeButton().click();
  }

  public async searchEmployeeById(employeeId: string) {
    await this.getEmployeeIdInput().type(employeeId);
    await this.getSearchEmployeeButton().click();
  }
}
