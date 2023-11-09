import { BasePage, Labels } from './BasePage';
import { Locator } from "@playwright/test";
export class BuzzPage extends BasePage {
    protected readonly sharePhotosButton = this.page.getByRole('button', { name: Labels.SHARE_PHOTOS })
    protected readonly fileInputButton = this.page.locator('input[type="file"]');
    public readonly sharingSubmitButton = this.page.getByRole('button', { name: Labels.SHARE, exact: true })
    public readonly threeDotsIcon = this.page.getByRole('button', { name: '' });
    protected readonly deletePostParagraphButton = this.page.getByText(Labels.DELETE_POST); 
    protected readonly editPostParagraphButton = this.page.getByText(Labels.EDIT_POST);
    protected readonly confirmDeleteButton = this.page.getByRole('button', { name: Labels.YES_DELETE})
    protected readonly inpostEditTextField = this.page.getByRole('dialog').locator('textarea')
    protected readonly confirmEditedPostButton = this.page.getByRole('dialog').getByRole('button', { name: Labels.POST })
    protected readonly shareVideoButton = this.page.getByRole('button', { name: Labels.SHARE_VIDEO })
    protected readonly pasteUrlTextarea = this.page.getByPlaceholder(Labels.PASTE_VIDEO_URL)
    protected readonly shareVideoParagraph = this.page.getByRole('dialog').getByPlaceholder(Labels.WHAT_ON_YOUR_MIND)
    public readonly heartButton = this.page.locator('#heart-svg')
    public readonly mostLikedTab = this.page.getByRole('button', { name: Labels.MOST_LIKED_POST })
    public readonly mostCommentedTab = this.page.getByRole('button', { name: Labels.MOST_COMMENTED_POST})
    public readonly textPostBody = this.page.locator('.orangehrm-buzz-post-body-text')
    public readonly commentPostCloudButtom = this.page.getByRole('button', { name: '' })
    public readonly commentInput = this.page.getByPlaceholder(Labels.WRITE_YOUR_COMMENT)
    public readonly photoBody = this.page.locator('.orangehrm-buzz-photos')
    public readonly videoBody = this.page.locator('.orangehrm-buzz-video')
    protected readonly simplePostMessageInput = this.page.getByPlaceholder(Labels.WHAT_ON_YOUR_MIND)
    protected readonly submitSimplePostButton = this.page.getByRole('button', { name: Labels.POST, exact: true })


    // public getPostWithRandomTitleAndPhoto(randomTitle: string): Locator {
    //   return this.page.locator(`.orangehrm-buzz-post-body:has(:text('${randomTitle}')):has(.orangehrm-buzz-photos) .orangehrm-buzz-post-body-text`);
    // }
    // this also works, let's keep it in codebase for poor times

    public getResharedPostButtonByRandomTitle(
      randomTitle: string
    ): Locator {
      return this.page
        .locator('.oxd-sheet')
        .filter({hasText:randomTitle})
        .locator('.bi-share-fill')
    }


    public getPostWithRandomTitleAndPhoto(
      randomTitle: string
    ): Locator {
      return this.page
        .locator('.orangehrm-buzz-post-body')
        .filter({hasText:randomTitle})
        .filter({has: this.page.locator('.orangehrm-buzz-photos')})
        .locator('.orangehrm-buzz-post-body-text')
    }

    public getOriginalTextOfReSharedPostWithPhoto(
      randomTitle: string
    ): Locator {
      return this.page
        .locator('.orangehrm-buzz-post-body')
        .filter({hasText:randomTitle})
        .filter({has: this.page.locator('.orangehrm-buzz-photos')})
        .locator('.orangehrm-buzz-post-body-original-text')
    }

    
    public getPostWithRandomTitleWithoutPhoto(
      randomTitle: string
    ): Locator {
      return this.page
        .locator('.orangehrm-buzz-post-body')
        .filter({hasText:randomTitle})
        .locator('.orangehrm-buzz-post-body-text')
    }

    // public getPostWithRandomTitleWithoutPhoto(randomTitle: string): Locator {
    //   return this.page.locator(`.orangehrm-buzz-post-body:has(:text("${randomTitle}")) .orangehrm-buzz-post-body-text`);
    // }
    // this also works, let's keep it in codebase for poor times


    async sharePost(filePath:string, title:string): Promise<void> {
        await this.sharePhotosButton.click();
        await this.shareVideoParagraph.type(title)
        const fileInput =  this.fileInputButton;
        if (!fileInput) {
          console.error('File input element not found.');
          return;
        }
        await fileInput.setInputFiles(filePath);
        await this.sharingSubmitButton.click({force:true});
    }

    async shareVideo(title:string, videoUrl:string): Promise<void> {
      const generateIt = (request: any) => {
        return request.url().startsWith('https://jnn-pa.googleapis.com') && request.url().endsWith('/GenerateIT');
      };
      await this.page.waitForLoadState('networkidle', { timeout: 7000 })
      await this.shareVideoButton.click();
      await this.shareVideoParagraph.type(title)
      await this.pasteUrlTextarea.type(videoUrl)
      await this.page.waitForRequest(generateIt)
      await this.sharingSubmitButton.click()
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
        await this.threeDotsIcon.first().click({force:true})
        await this.deletePostParagraphButton.click();
        await this.confirmDeleteButton.click();
    }

   async editTheNewestPost(finalPostText: string): Promise<void> {
      await this.threeDotsIcon.first().click()
      await this.editPostParagraphButton.click();
      await this.inpostEditTextField.clear()
      await this.inpostEditTextField.fill(finalPostText)
      await this.confirmEditedPostButton.click()  
  }

  async sendSimplePost(simplePostMessage:string): Promise<void> {
    await this.simplePostMessageInput.type(simplePostMessage)
    await this.submitSimplePostButton.click()
 }

  async resharePostOfOther(oldTitle:string, newTitle:string): Promise<void> {
    await this.getResharedPostButtonByRandomTitle(oldTitle).click()
    await this.shareVideoParagraph.type(newTitle)
    await this.sharingSubmitButton.click()
  }
}
