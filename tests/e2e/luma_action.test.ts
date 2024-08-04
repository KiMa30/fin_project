import { test } from '@playwright/test';
import { config } from '../../framework/config/config';
import { LumaPage } from '../../framework/pageobjects/LumaPage';
import { genLumaCreds, genLumaPerson } from '../../framework/helpers/genLumaUser';

test.describe.configure({ mode: 'serial'});

test.describe('UI тесты магазина товаров для йоги', () => {
  const url: string = config.uiURL;

  const lumaUser = genLumaCreds();
  const lumaEmail = lumaUser.email;
  const lumaPassword = lumaUser.password;

  const lumaPerson = genLumaPerson();
  const lumaName = lumaPerson.name;
  const lumaSurname = lumaPerson.lastname;

  let firstItem: string = '';
  let secondItem: string = '';

  test('Создание нового юзера', async ({ page }) => {
    // Переходим на страницу
    await page.goto(url);
    await page.waitForLoadState('domcontentloaded'  );

    // Подключаем стрницу магазина Luma Yoga
    const Luma = new LumaPage(page);

    // Проверяем, что находимся на главной странице
    await Luma.checkOnMainPage();

    // Кликаем на ссылку страницы создания аккаунта
    await Luma.clickCreateAcc();

    // Проверяем,что открылась страница создания юзера
    await Luma.pageTitleCheck('page-title-wrapper', 'Create New Customer Account');

    // Заполняем поля формы регистрации
    await Luma.fillInput('First Name', `${lumaName}`);
    await Luma.fillInput('Last Name', `${lumaSurname}`);
    await Luma.fillInput('Email', `${lumaEmail}`);
    await Luma.fillInput('Password', `${lumaPassword}`);
    await Luma.fillInput('Confirm Password', `${lumaPassword}`);
    
    // Отправляем форму регистрации
    await Luma.submitButton('Create an Account');

    // Проверяем, что аккаунт создан и мы авторизованы
    await Luma.resultOfSubmit();
    await Luma.pageTitleCheck('page-title-wrapper', 'My Account');

    // Проверяем, что данные Имя, Фамилия и Почта записаны корректно
    await Luma.checkAccountData(lumaName, lumaSurname, lumaEmail);
  })

  test('Добавление товара в корзину', async ({ page }) => {
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

    // Отправляем форму авторизации
    await Luma.submitButton('Sign In');

    // Проверяем, что авторизовались под выбранным пользователем
    await page.waitForTimeout(2 * 1000);
    await Luma.checkAfterAuth(lumaName, lumaSurname);

    // Переходим в раздел рюкзаков
    const gear = 4;
    const bags = 1;
    await Luma.choiceOfMenuOption(gear, bags);

    // Проверяем, что находимся в разделе рюкзаков
    await page.waitForTimeout( 2 * 1000);
    await Luma.pageTitleCheck('page-title-wrapper', 'Bags');

    // Запоминаем имя первого и второго товара в списке
    firstItem = await Luma.getItemName(1);
    secondItem = await Luma.getItemName(2);

    // Добавляем первый товар в корзину
    await Luma.addItemsToBasket(1, firstItem);
    await Luma.addItemsToBasket(2, secondItem);

    // Переходим в корзину
    await Luma.action('action showcart');
    await Luma.action('action viewcart');

    // Проверяем,что открылась корзина пользователя
    await page.waitForTimeout(4 * 1000);
    await Luma.pageTitleCheck('page-title-wrapper', 'Shopping Cart');

    // Проверяем, что товары добавлены в корзину
    await Luma.itemAdded(firstItem);
    await Luma.itemAdded(secondItem);
  })

  test('Удаление товара из корзины', async ({ page }) => {
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

    // Отправляем форму авторизации
    await Luma.submitButton('Sign In');

    // Проверяем, что авторизовались под выбранным пользователем
    await page.waitForTimeout(2 * 1000);
    await Luma.checkAfterAuth(lumaName, lumaSurname);

    // Переходим в корзину
    await Luma.action('action showcart');
    await Luma.action('action viewcart');

    // Проверяем,что открылась корзина пользователя
    await page.waitForTimeout(4 * 1000);
    await Luma.pageTitleCheck('page-title-wrapper', 'Shopping Cart');

    // Проверяем, что товары добавлены в корзину
    await Luma.itemAdded(firstItem);
    await Luma.itemAdded(secondItem);

    // Уаляем товар из корзины
    await Luma.itemAction(secondItem, 'Remove item');

    // Проверяем, что удален только выбранный товар
    await Luma.itemAdded(firstItem);
    await Luma.itemNotAdded(secondItem);
  })
});