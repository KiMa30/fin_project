import { expect, Locator, Page } from '@playwright/test';
import { logger } from '../helpers/logger';

export class LumaPage {
  readonly page: Page;

  readonly mainPageBanner: Locator;

  readonly logIn: Locator;

  readonly createAcc: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainPageBanner = page.locator('//span[contains(text(), "New Luma Yoga Collection")]');
    this.logIn = page.locator('(//div[@class="panel header"]//li[@class="authorization-link"][1])');
    this.createAcc = page.locator('(//div[@class="panel header"]//li//a[contains(text(), "Create an Account")])');
  }

  async checkOnMainPage() {
    await expect(this.mainPageBanner).toBeVisible();
    logger.info('Открылась главная страница сайта Luma');   
  }

  async clickSignIn() {
    await this.logIn.click();
    logger.info('Сделан клик по ссылке Sign In');
  }

  async clickCreateAcc() {
    await this.createAcc.click();
    logger.info('Сделан клик по ссылке Create an Account');
  }

  async pageTitleCheck(uiIdName: string, pageTitle: string) {
    await expect(this.page.getByTestId(`${uiIdName}`)).toHaveText(`${pageTitle}`);
    logger.info(`Открыта страница ${pageTitle}`);
  }

  async fillInput(inputTitle: string, inputData: string) {
    await this.page.locator(`(//input[@title="${inputTitle}"])`).fill(inputData);
    logger.info(`В инпут ${inputTitle} введено значение ${inputData}`)
  }


  async fillCredentionals(loginInput: string, passwordInput: string, loginCred: string, passwordCred: string) {
    await this.page.locator(`(//input[@title="${loginInput}"])`).fill(loginCred);
    await this.page.locator(`(//input[@title="${passwordInput}"])`).fill(passwordCred);
    logger.info(`Логин: ${loginCred} и пароль: ${passwordCred} заполнены`);
  }


  async submitButton(buttonText: string) {
    await this.page.locator(`(//span[contains(text(), "${buttonText}")
        and not(preceding::span[contains(text(), "${buttonText}")])])`).click();
  }

  async authFailed() {
    await expect(this.page.getByText(`The account sign-in was incorrect
        or your account is disabled temporarily.`)).toBeVisible({ timeout: 3 * 1000 });
    logger.info('Были введены невалидные логин и пароль');
  }
}

