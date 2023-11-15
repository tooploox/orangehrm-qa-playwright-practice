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

  // public getLocatorByRandomNewEmplyeeName(randomNewEmpoyeeName: string):Locator {
  //   return this.page.locator(`.oxd-table-cell:has(:text("${randomNewEmpoyeeName}"))`);
  // } this also works, let's keep it in codebase for poor times
  
  public getCellByRandomNewEmplyeeName(
    randomNewEmployeeName: string
  ): Locator {
    return this.page
    .getByRole('cell', {name: randomNewEmployeeName})
  }

  // public getTrashBinByRandomEmployeeName(randomNewEmployeeName: string):Locator {
  //   return this.page.locator(`.oxd-table-card:has(:text("${randomNewEmployeeName}")) .oxd-icon.bi-trash`);
  // } 
  // this also works, let's keep it in codebase for poor times

  public getTrashBinByRandomEmployeeName(
    randomNewEmployeeName: string
  ): Locator {
    return this.page
      .getByText(randomNewEmployeeName)
      .locator("xpath=../..")
      .getByRole("button")
      .locator(".bi-trash");
  }

  // public  getEditIconByRandomEmployeeName(randomNewEmpoyeeName: string): Locator {
  //   return this.page.locator( `.oxd-table-card:has(:text("${randomNewEmpoyeeName}")) .oxd-icon.bi-pencil-fill`);
  // } 
  //this also works, let's keep it in codebase for poor times

  public getEditIconByRandomEmployeeName(randomNewEmployeeName: string): Locator {
    return this.page
    .getByText(randomNewEmployeeName)
    .locator('xpath=../..')
    .getByRole('button')
    .locator('.bi-pencil-fill')
  }

  // public  getCheckIconByRandomEmployeeName(randomNewEmpoyeeName: string):Locator {
  //   return this.page.locator(`.oxd-table-card:has(:text("${randomNewEmpoyeeName}")) .oxd-checkbox-input-icon`);
  // } 
  // this also works, let's keep it in codebase for poor times

  public getCheckIconByRandomEmployeeName(
    randomNewEmployeeName: string
  ): Locator {
    return this.page
      .getByText(randomNewEmployeeName)
      .locator("xpath=../..")
      .locator("span")
  }

  public getInputByLabelText(label: string): Locator {
    return this.page
      .getByText(label, { exact: true })
      .locator("xpath=../..")
      .locator("input");
  }

  public getOtherIdInput(): Locator {
    return this.page.getByText('Other Id')
    .locator('xpath=../..')
    .locator('input')
  }

  public getDrivingLicenseInput(): Locator {
    return this.page.getByText("Driver's License Number")
    .locator('xpath=../..')
    .locator('input')
  }



  public async addEmployee(firstRandomName: string, bySubtab?: boolean) {
    if (bySubtab) {
      await this.navigateToSubPage(SubPage.ADD_EMPLOYEE);
    } else {
      await this.getAddEmployeeButtonn().click();
    }
    await this.getFirstNameInput().type(firstRandomName);
    await this.getMiddleNameInput().type(newEmployeeTestData.middleName);
    await this.getLastNameInput().type(newEmployeeTestData.lastName);
    await this.getSaveUserButton().click();
  }

  public async addEmployeeWithLoginDetails(
    firstRandomName: string,
    bySubtab?: boolean
  ) {
    if (bySubtab) {
      await this.navigateToSubPage(SubPage.ADD_EMPLOYEE);
    } else {
      await this.getAddEmployeeButtonn().click();
    }
    await this.getFirstNameInput().type(firstRandomName);
    await this.getMiddleNameInput().type(newEmployeeTestData.middleName);
    await this.getLastNameInput().type(newEmployeeTestData.lastName);
    await this.getToggleByTextLabel(Label.LOGIN_DETAILS).click();
    await this.getInputByLabelText(Label.USERNAME).type(firstRandomName);
    await this.getInputByLabelText(Label.PASSWORD).type(adminUserTestData.password);
    await this.getInputByLabelText(Label.CONFIRM_PASSWORD).type(adminUserTestData.password);
    await this.getSaveButtonByHeadingSection(SubPage.ADD_EMPLOYEE).click();
  }

  public async editEmployee(randomEditedEmployeeName: string) {
    await this.page.waitForLoadState("load");
    await this.getFirstNameInput().fill(randomEditedEmployeeName);
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
