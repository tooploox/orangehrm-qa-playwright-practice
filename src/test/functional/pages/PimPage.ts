import { BasePage, SubPage, Labels } from "./BasePage";
import { adminUserTestData, newEmployeeTestData } from "../data";
import { Locator } from "@playwright/test";

export class PimPage extends BasePage {

  protected getAddEmployeeButtonn(
    ): Locator {
      return this.page.getByRole("button", {
        name: Labels.ADD,
      });
    }

  protected getFirstNameInput(
    ): Locator {
      return  this.page.getByPlaceholder(Labels.FIRST_NAME);
    }

  protected getMiddleNameInput(
    ): Locator {
      return  this.page.getByPlaceholder(Labels.MIDDLE_NAME);
    }

  protected getLastNameInput(
    ): Locator {
      return  this.page.getByPlaceholder(Labels.LAST_NAME);
    }

  protected getSaveUserButton(
    ): Locator {
      return  this.page.getByRole("button", {
        name: Labels.SAVE,
      });    
    }

  public getConfirmDeleteButton(
    ): Locator {
      return  this.page.getByRole("button", {
        name: Labels.YES_DELETE,
      });
    }

  public getMultiplyDeleteButton(
    ): Locator {
      return  this.page.getByRole("button", {
        name: Labels.DELETE_SELECTED,
      });
    }
  
  protected getEmployeeNameInput(
    ): Locator {
      return  this.page
      .getByPlaceholder(Labels.TYPE_FOR_HINTS)
      .first();
    }

  protected getEmployeeIdInput(
    ): Locator {
      return  this.page.getByRole("textbox").nth(2);
    }

  protected getSearchEmployeeButton(
    ): Locator {
      return  this.page.getByRole("button", {
        name: Labels.SEARCH,
      });
    }

  public getResetButton(
    ): Locator {
      return  this.page.getByRole("button", {
        name: Labels.RESET,
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

  public async addEmployee(firstRandomName: string, bySubtub?: boolean | null) {
    if (bySubtub === true) {
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
    bySubtub?: boolean | null
  ) {
    if (bySubtub === true) {
      await this.navigateToSubPage(SubPage.ADD_EMPLOYEE);
    } else {
      await this.getAddEmployeeButtonn().click();
    }
    await this.getFirstNameInput().type(firstRandomName);
    await this.getMiddleNameInput().type(newEmployeeTestData.middleName);
    await this.getLastNameInput().type(newEmployeeTestData.lastName);
    await this.getToggleByTextLabel(Labels.LOGIN_DETAILS).click();
    await this.getInputByLabelText(Labels.USERNAME).type(firstRandomName);
    await this.getInputByLabelText(Labels.PASSWORD).type(adminUserTestData.password);
    await this.getInputByLabelText(Labels.CONFIRM_PASSWORD).type(adminUserTestData.password);
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
