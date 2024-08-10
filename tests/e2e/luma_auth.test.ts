import { test } from '@playwright/test';
import { config } from '../../framework/config/config';
import { LumaPage } from '../../framework/pageobjects/LumaPage';
import { genLumaCreds } from '../../framework/helpers/genLumaUser';

test.describe('Авторизация в магазине товаров для йоги Luma', () => {
  const url: string = config.uiURL;

  const lumaUser = genLumaCreds();
  const lumaEmail = lumaUser.email;
  const lumaPassword = lumaUser.password;

  test('Авторизация с невалидными кредами', async ({ page }) => {
    
    await page.route('**/*', (route, request) => {
      const urlFailed = request.url();
      if (urlFailed.includes('connect.facebook.net') || urlFailed.includes('doubleclick')) {
        // route.abort();
        route.fulfill({
          status: 200,
          body: 'mocked response',
        });
      } else {
        route.continue();
      }
    });

    // Переходим на страницу ресурса
    await page.goto(url);
    await page.waitForLoadState('load');


    // Подключаем стрницу магазина Luma Yoga
    const Luma = new LumaPage(page);
    // await page.pause();
    // Проверяем, что находимся на главной странице
    await Luma.checkOnMainPage();

    // Кликаем на ссылку страницы авторизации
    await Luma.clickSignIn();

    // Проверяем,что открылась страница авторизации
    // await Luma.pageTitleCheck('page-title-wrapper', 'Логин');
    await Luma.pageTitleCheck('page-title-wrapper', 'Customer Login');


    // Вводим рандомно сгенерированные логин и пароль
    await Luma.fillInput('Email', `${lumaEmail}`);
    await Luma.fillInput('Password', `${lumaPassword}`);

    // Отправляем форму авторизации
    await Luma.submitButton('Sign In');

    // Проверям текст ошибки в связи с вводом невалидных данных
    await Luma.resultOfSubmit();
  })

  test('Авторизация активным юзером', async ({ page }) => {
    // Переходим на страницу ресурса
    await page.goto(url);
    await page.waitForLoadState('load');


    // Подключаем стрницу магазина Luma Yoga
    const Luma = new LumaPage(page);

    // Проверяем, что находимся на главной странице
    await Luma.checkOnMainPage();

    // Кликаем на ссылку страницы авторизации
    await Luma.clickSignIn();

    // Проверяем,что открылась страница авторизации
    await Luma.pageTitleCheck('page-title-wrapper', 'Customer Login');

    // Вводим валидные креды
    await Luma.fillInput('Email', `${config.uiLogin}`);
    await Luma.fillInput('Password', `${config.uiPassword}`);

    // Отправляем форму авторизации
    await Luma.submitButton('Sign In');

    // Проверяем, что авторизовались под выбранным пользователем
    await page.waitForTimeout(2 * 1000);
    await Luma.checkAfterAuth(`${config.uiName}`, `${config.uiLastname}`);
  })

  test('Логаут после авторизации', async ({ page }) => {
    // Переходим на страницу ресурса
    await page.goto(url);
    await page.waitForLoadState('load');


    // Подключаем стрницу магазина Luma Yoga
    const Luma = new LumaPage(page);

    // Проверяем, что находимся на главной странице
    await Luma.checkOnMainPage();

    // Кликаем на ссылку страницы авторизации
    await Luma.clickSignIn();

    // Проверяем,что открылась страница авторизации
    await Luma.pageTitleCheck('page-title-wrapper', 'Customer Login');

    // Вводим валидные креды
    await Luma.fillInput('Email', `${config.uiLogin}`);
    await Luma.fillInput('Password', `${config.uiPassword}`);

    // Отправляем форму авторизации
    await Luma.submitButton('Sign In');

    // Проверяем, что авторизовались под выбранным пользователем
    await page.waitForTimeout(2 * 1000);
    await Luma.checkAfterAuth(`${config.uiName}`, `${config.uiLastname}`);

    //Нажимаем на меню аккаунта
    await Luma.action('action switch');

    //Деавторизуемся из личного кабинета
    await Luma.accountMenuOptions('Sign Out');

    //Юзер разлогинен
    await Luma.pageTitleCheck('page-title-wrapper', 'You are signed out');
  })
})