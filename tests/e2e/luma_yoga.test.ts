import { test } from '@playwright/test';
import { config } from '../../framework/config/config';
import { LumaPage } from '../../framework/pageobjects/LumaPage';
import { genLumaCreds } from '../../framework/helpers/genLumaUser';

test.describe('UI тесты магазина товаров для йоги', () => {
  const url: string = config.uiURL;

  const lumaUser = genLumaCreds();
  const lumaEmail = lumaUser.email;
  const lumaPassword = lumaUser.password;

  test('Авторизация с невалидными кредами', async ({ page }) => {
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

    // Вводим рандомно сгенерированные логин и пароль
    await Luma.fillInput('Email', `${lumaEmail}`);
    await Luma.fillInput('Password', `${lumaPassword}`);
    // await Luma.fillCredentionals('Email', 'Password', `${lumaEmail}`, `${lumaPassword}`);

    // Отправляем форму авторизации
    await Luma.submitButton('Sign In');

    // Проверям текст ошибки в связи с вводом невалидных данных
    await Luma.authFailed();
  })

  test.skip('Создание нового юзера', async ({ page }) => {
    // Переходим на страницу
    await page.goto(url);

    // Подключаем стрницу магазина Luma Yoga
    const Luma = new LumaPage(page);

    // Проверяем, что находимся на главной странице
    await Luma.checkOnMainPage();

    // Кликаем на ссылку страницы создания аккаунта
    await Luma.clickCreateAcc();

    // Проверяем,что открылась страница создания юзера
    await Luma.pageTitleCheck('page-title-wrapper', 'Create New Customer Account');
    
    
    

  })
});