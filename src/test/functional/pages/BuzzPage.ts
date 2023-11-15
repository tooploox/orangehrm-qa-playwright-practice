import { BasePage, Label } from './BasePage';
import { Locator } from "@playwright/test";
export class BuzzPage extends BasePage {
 
    public getMostLikedTab(
      ): Locator {
        return this.page.getByRole('button', { name: Label.MOST_LIKED_POST })
      }
    
    public getMostCommentedTab(
      ): Locator {
        return this.page.getByRole('button', { name: Label.MOST_COMMENTED_POST})
      }
    
    public getTextPostBody(
      ): Locator {
        return this.page.locator('.orangehrm-buzz-post-body-text')
      }
    
    public getVideoBody(
      ): Locator {
        return this.page.locator('.orangehrm-buzz-video')
      }

    protected getSubmitSimplePostButton(
      ): Locator {
        return this.page.getByRole('button', { name: Label.POST, exact: true })
      }

    protected getPostMessageInput(
      ): Locator {
        return this.page.getByPlaceholder(Label.WHAT_ON_YOUR_MIND)
      }
    
    protected getShareVideoTitle(
      ): Locator {
        return this.page.getByRole('dialog').getByPlaceholder(Label.WHAT_ON_YOUR_MIND)
      }
    
    protected getVideoUrlTextarea(
      ): Locator {
        return this.page.getByPlaceholder(Label.PASTE_VIDEO_URL)
      }
    
    protected getShareVideoButton(
      ): Locator {
        return this.page.getByRole('button', { name: Label.SHARE_VIDEO })
      }
    
    protected getConfirmEditedPostButton(
      ): Locator {
        return this.page.getByRole('dialog').getByRole('button', { name: Label.POST })
      }
    
    protected getPostEditTextarea(
      ): Locator {
        return this.page.getByRole('dialog').locator('textarea')
      }
    
    protected getConfirmDeleteButton(
      ): Locator {
        return this.page.getByRole('button', { name: Label.YES_DELETE});
      }
    
    protected getEditButton(
      ): Locator {
        return this.page.getByText(Label.EDIT_POST);
      }

    protected getDeletePostButton(
      ): Locator {
        return this.page.getByText(Label.DELETE_POST);
      }

    public getThreeDotsButton(
      ): Locator {
        return this.page.getByRole('button', { name: '' });
      }

    public getSharingSubmitButton(
      ): Locator {
        return this.page.getByRole('button', { name: Label.SHARE, exact: true })
      }

    protected getFileInputButton(
      ): Locator {
        return this.page.locator('input[type="file"]')
      }

    protected getSharePhotoButton(
    ): Locator {
      return this.page.getByRole('button', { name: Label.SHARE_PHOTOS })
    }

    public getCommentInput(
      title: string
    ): Locator {
      return this.page
        .locator('.oxd-sheet')
        .filter({hasText:title})
        .getByPlaceholder(Label.WRITE_YOUR_COMMENT)
    }

    public getResharedPostButtonByTitle(
      title: string
    ): Locator {
      return this.page
        .locator('.oxd-sheet')
        .filter({hasText:title})
        .locator('.bi-share-fill')
    }

    public getHeartButtonByTitle(
      title: string
    ): Locator {
      return this.page
        .locator('.oxd-sheet')
        .filter({hasText:title})
        .locator('svg')
    }

    public getCommentPostButtonByTitle(
      title: string
    ): Locator {
      return this.page
        .locator('.oxd-sheet')
        .filter({hasText:title})
        .locator('.bi-chat-text-fill')
    }

    public getPostWithTitleAndPhoto(
      title: string
    ): Locator {
      return this.page
        .locator('.orangehrm-buzz-post-body')
        .filter({hasText:title})
        .filter({has: this.page.locator('.orangehrm-buzz-photos')})
        .locator('.orangehrm-buzz-post-body-text')
    }

    // public getPostWithTitleAndPhoto(title: string): Locator {
    //   return this.page.locator(`.orangehrm-buzz-post-body:has(:text('${title}')):has(.orangehrm-buzz-photos) .orangehrm-buzz-post-body-text`);
    // }
    // this also works, let's keep it in codebase for poor times

    public getOriginalTextOfReSharedPostWithPhoto(
      title: string
    ): Locator {
      return this.page
        .locator('.orangehrm-buzz-post-body')
        .filter({hasText:title})
        .filter({has: this.page.locator('.orangehrm-buzz-photos')})
        .locator('.orangehrm-buzz-post-body-original-text')
    }
    
    public getPostWithTitleWithoutPhoto(
      title: string
    ): Locator {
      return this.page
        .locator('.orangehrm-buzz-post-body')
        .filter({hasText:title})
        .locator('.orangehrm-buzz-post-body-text')
    }

    // public getPostWithTitleWithoutPhoto(title: string): Locator {
    //   return this.page.locator(`.orangehrm-buzz-post-body:has(:text("${title}")) .orangehrm-buzz-post-body-text`);
    // }
    // this also works, let's keep it in codebase for poor times

    async sharePostWithPhoto(filePath:string, title:string): Promise<void> {
        await this.getSharePhotoButton().click();
        await this.getShareVideoTitle().type(title)
        const fileInput =  this.getFileInputButton();
        if (!fileInput) {
          console.error('File input element not found.');
          return;
        }
        await fileInput.setInputFiles(filePath);
        await this.getSharingSubmitButton().click({force:true});
    }

    async shareVideo(title:string, videoUrl:string): Promise<void> {
      const generateIt = (request: any) => {
        return request.url().startsWith('https://jnn-pa.googleapis.com') && request.url().endsWith('/GenerateIT');
      };
      await this.page.waitForLoadState('networkidle', { timeout: 7000 })
      await this.getShareVideoButton().click();
      await this.getShareVideoTitle().type(title)
      await this.getVideoUrlTextarea().type(videoUrl)
      await this.page.waitForRequest(generateIt)
      await this.getSharingSubmitButton().click()
      await this.page.waitForRequest(generateIt)
  }

   async deleteTheNewestPost(containsVideo?: boolean | null): Promise<void> {
        if (containsVideo === true) {
          const generateIt = (request: any) => {
            return request.url().startsWith('https://jnn-pa.googleapis.com') && request.url().endsWith('/GenerateIT');
          };
          await this.page.waitForRequest(generateIt, { timeout: 7000 });
        }
        else {
          await this.page.waitForTimeout(1500)
        }
        await this.getThreeDotsButton().first().dblclick({force:true})
        await this.getDeletePostButton().click();
        await this.getConfirmDeleteButton().click();
    }

   async editTheNewestPost(finalPostText: string): Promise<void> {
      await this.getThreeDotsButton().first().click()
      await this.getEditButton().click();
      await this.getPostEditTextarea().fill(finalPostText)
      await this.getConfirmEditedPostButton().click()  
  }

  async sendSimplePost(simplePostMessage:string): Promise<void> {
    await this.getPostMessageInput().type(simplePostMessage)
    await this.getSubmitSimplePostButton().click()
 }

  async reshareOtherPost(oldTitle:string, newTitle:string): Promise<void> {
    await this.getResharedPostButtonByTitle(oldTitle).click()
    await this.getShareVideoTitle().type(newTitle)
    await this.getSharingSubmitButton().click()
  }
}
