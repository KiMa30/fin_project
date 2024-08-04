import { expect, Locator, Page } from '@playwright/test';
import { logger } from '../helpers/logger';

export class LumaPage {
  readonly page: Page;

  readonly mainPageBanner: Locator;

  readonly logIn: Locator;

  readonly createAcc: Locator;

  readonly accountWholeName: Locator;

  readonly welcomeMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainPageBanner = page.locator('//span[contains(text(), "New Luma Yoga Collection")]');
    this.logIn = page.locator('(//div[@class="panel header"]//li[@class="authorization-link"][1])');
    this.createAcc = page.locator('(//div[@class="panel header"]//li//a[contains(text(), "Create an Account")])');
    this.accountWholeName = page.locator('div.box.box-information > div.box-content > p');
    this.welcomeMenu = page.locator('(//span[@class="logged-in" and not(preceding::span[@class="logged-in"])])');
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

  async submitButton(buttonText: string) {
    await this.page.locator(`(//span[contains(text(), "${buttonText}")
        and not(preceding::span[contains(text(), "${buttonText}")])])`).click();
  }

  async resultOfSubmit() {
    const submitMsg = await this.page.locator(`((//div[@data-ui-id="message-error"]//following::div)[1]
      | (//div[@data-ui-id="message-success"]//following::div)[1])`).textContent() || '';
    const trimmedMsg = submitMsg.trim();
    
    if (trimmedMsg.includes(`The account sign-in was incorrect or your account is disabled temporarily.`)) {
      logger.info(`Введены невалидные креды и получена ошибка: ${submitMsg}`);
      return;
    }
    
    if (trimmedMsg.includes(`Thank you for registering with Main Website Store.`)) {
      logger.info(`Регистрация прошла успешно, получено сообщение: ${submitMsg}`);
      return;
    }
    
    logger.info('Результат отправки формы не получен');
}

  async checkAccountData(firstName: string, lastName: string, eMail: string) {
    const wholeName = `${firstName} ${lastName}\n${eMail}`;
    const receivedWholeName = (await this.accountWholeName.textContent() || '').trim();

    if (wholeName === receivedWholeName) {
        logger.info(`Контакты в аккаунте: ${wholeName}`);
    } else {
      throw new Error(`Отправленное в форме имя ${wholeName} не соответствует указанному в профиле ${receivedWholeName}`);
    }
  }

  async checkAfterAuth(firstName: string, lastName: string) {
    await expect(this.welcomeMenu).toHaveText(`Welcome, ${firstName} ${lastName}!`);
    logger.info(`Авторизация для юзера ${firstName} ${lastName} прошла успешно`);
  }

  async choiceOfMenuOption(firstOption: number, secondOption: number) {
    const mainCataloLocator = this.page.locator(`(//li[contains(@class, "level0 nav-${firstOption} category-item")])`);
    await mainCataloLocator.hover({ timeout: 3 * 1000 });
    await this.page.waitForTimeout(1000);

    const subCatalogLocator = this.page.locator(`//li[contains(@class,
      "level1 nav-${firstOption}-${secondOption}")]//a//span`);
    await subCatalogLocator.waitFor({ state: 'visible', timeout: 3 * 1000 });
    const catalogOption = await subCatalogLocator.textContent() || '';
    await subCatalogLocator.click();

    logger.info(`Переходим в подкатегорию ${catalogOption}`);
  }

  async getItemName(itemNumber: number) {
    const item = this.page.locator(`((//li[@class="item product product-item"])[${itemNumber}]
      //a[@class="product-item-link"])`);
    const itemName = (await item.textContent() || '').trim();
    logger.info(`Сохраняем название товара для добавления в корзину: ${itemName}`);
    return itemName;
  }

  async addItemsToBasket(itemNumber: number, itemName: string) {
    const item = this.page.locator(`((//li[@class="item product product-item"])[${itemNumber}]
      //a[@class="product-item-link"])`);
    await item.hover({ timeout: 2 * 1000})
    await this.page.waitForTimeout(1000);

    const buttonCart = this.page.locator(`(//li[.//a[contains(text(), "${itemName}")]]//button[@title="Add to Cart"])`);
    await buttonCart.waitFor({state: 'visible', timeout: 1000 });
    await buttonCart.click();

    await this.page.waitForTimeout(3 * 1000);

    logger.info(`В корзину добавлен товар: ${itemName}`);
  }

  async clickButton(buttonName: string) {
    await this.page.locator(`(//button[contains(text(), "${buttonName}")])`).click();
    logger.info(`Кнопка ${buttonName} нажата`);
  }

  async action(actionClass: string) {
    await this.page.locator( `((//*[@class="${actionClass}"])[1])`).click();
    logger.info(`Выполнено действие: ${actionClass}`);
  }

  async itemAdded(itemName: string) {
    await expect(this.page.locator(`//div[@class="cart table-wrapper"]
      //a[contains(text(), "${itemName}")]`)).toBeVisible();
    logger.info( `Товар ${itemName} добавлен в корзину`);
  }

  async itemNotAdded(itemName: string) {
    await expect(this.page.locator(`//div[@class="cart table-wrapper"]
      //a[contains(text(), "${itemName}")]`)).not.toBeVisible();
    logger.info( `Товар ${itemName} отсутствует в корзине`);
  }

  async accountMenuOptions(option: string) {
    await this.page.locator(`(//a[contains(text(), "${option}") and ancestor::div[@aria-hidden="false"]][1])`).click();
    logger.info(`Выбрана опция меню аккаунта: ${option}`);
  }

  async itemAction(itemName: string, actionType: string) {
    await this.page.locator(`((//div[@class="cart table-wrapper"]//a[contains(text(), "${itemName}")]
      //following::a[@title="${actionType}"])[1])`).click();
    logger.info(`Производенено действие ${actionType} над товаром ${itemName}`);
  }
}

