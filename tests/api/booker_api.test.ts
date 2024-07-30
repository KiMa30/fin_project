import { test, expect } from '@playwright/test';
import { config } from "../../framework/config/config";
import { getPersonName } from "../../framework/helpers/genPersonName";
import BookerActionsHelper from "../../framework/helpers/BookerActionsHelper";

test.describe.configure({ mode: 'serial'});

test.describe('Авторизация и действия в сервисе букинга', () => {
  let apiToken: string;

  const person = getPersonName();
  const personName: string = person.name;
  const personLastName: string = person.surname;

  const personTwo = getPersonName();
  const personTwoName: string = personTwo.name;
  const personTwoLastName: string = personTwo.surname;

  const personThree = getPersonName();
  const personThreeName = personThree.name;
  const personThreeLastName = personThree.surname;

  let personId: number;
  
  test.beforeAll(async () => {
    const responseCreate = await BookerActionsHelper.check()
    expect(responseCreate.status).toBe(201);
  });

  test('Авторизация с не валидными кредами', async () => {
    const responseCreate = await BookerActionsHelper.auth({
      userName: "somebody",
      passWord: "something",
    });

    expect(responseCreate.status).toBe(200);
    expect(responseCreate.data.reason).toBe("Bad credentials");
  });

  test('Авторизация с валидными кредами', async () => {
    const responseCreate = await BookerActionsHelper.auth({
      userName: config.apiUsername,
      passWord: config.apiPassword,
    });

    expect(responseCreate.status).toBe(200);
    expect(responseCreate.data.token).toBeDefined();
    apiToken = responseCreate.data.token;
  });

  test('Создание брони с невалидным телом запроса', async () => {
    const responseCreate = await BookerActionsHelper.create({
      name: 123,
      surname: personLastName,
      price: 999,
      deposit: true,
      checkIn: "2024-07-31",
      checkOut: "2024-08-10",
      addInfo: "Breakfast every morning, please"
    })

    expect(responseCreate.status).toBe(500);
  })

  test('Создание брони с валидными данными в теле запроса', async () => {
    const responseCreate = await BookerActionsHelper.create({
      name: personName,
      surname: personLastName,
      price: 999,
      deposit: true,
      checkIn: "2024-07-31",
      checkOut: "2024-08-10",
      addInfo: "Breakfast every morning, please"
    })

    expect(responseCreate.status).toBe(200);
    expect(responseCreate.data.bookingid).toBeDefined();
    personId = responseCreate.data.bookingid;
    expect(responseCreate.data.booking.firstname).toBe(personName);
    expect(responseCreate.data.booking.lastname).toBe(personLastName);
    expect(responseCreate.data.booking.totalprice).toBe(999);
    expect(responseCreate.data.booking.bookingdates.checkin).toBe("2024-07-31");
    expect(responseCreate.data.booking.bookingdates.checkout).toBe("2024-08-10");
    expect(responseCreate.data.booking.depositpaid).toBe(true);
    expect(responseCreate.data.booking.additionalneeds).toBe("Breakfast every morning, please");
  })

  test('Запрос данных по созданной брони по id', async () => {
    const responseCreate = await BookerActionsHelper.get(personId);

    expect(responseCreate.status).toBe(200);
    expect(responseCreate.data.firstname).toBe(personName);
    expect(responseCreate.data.lastname).toBe(personLastName);
    expect(responseCreate.data.additionalneeds).toBe("Breakfast every morning, please");
  })

  test('Обновление всей брони', async () => {
    const responseCreate = await BookerActionsHelper.update(
      {
      id: personId,
      authToken: apiToken,
      name: personTwoName,
      surname: personTwoLastName,
      price: 888,
      deposit: true,
      checkIn: "2024-07-31",
      checkOut: "2024-08-10",
      addInfo: "Could you cancel breakfast, please"
    }
  )

    expect(responseCreate.status).toBe(200);
    expect(responseCreate.data.firstname).toBe(personTwoName);
    expect(responseCreate.data.lastname).toBe(personTwoLastName);
    expect(responseCreate.data.totalprice).toBe(888);
    expect(responseCreate.data.bookingdates.checkin).toBe("2024-07-31");
    expect(responseCreate.data.bookingdates.checkout).toBe("2024-08-10");
    expect(responseCreate.data.depositpaid).toBe(true);
    expect(responseCreate.data.additionalneeds).toBe("Could you cancel breakfast, please");
  })

  test('Запрос данных по обновленной брони по id', async () => {
    const responseCreate = await BookerActionsHelper.get(personId);

    expect(responseCreate.status).toBe(200);
    expect(responseCreate.data.firstname).toBe(personTwoName);
    expect(responseCreate.data.lastname).toBe(personTwoLastName);
    expect(responseCreate.data.additionalneeds).toBe("Could you cancel breakfast, please");
  })

  test('Обновление брони частично', async () => {
    const responseCreate = await BookerActionsHelper.updatePart(
      {
      id: personId,
      authToken: apiToken,
      name: personThreeName,
      surname: personThreeLastName,
      addInfo: "You are probably annoyed by the third change of booking. Sorry!"
    }
  )
    
    expect(responseCreate.status).toBe(200);
    expect(responseCreate.data.firstname).toBe(personThreeName);
    expect(responseCreate.data.lastname).toBe(personThreeLastName);
    expect(responseCreate.data.totalprice).toBe(888);
    expect(responseCreate.data.bookingdates.checkin).toBe("2024-07-31");
    expect(responseCreate.data.bookingdates.checkout).toBe("2024-08-10");
    expect(responseCreate.data.depositpaid).toBe(true);
    expect(responseCreate.data.additionalneeds).toBe("You are probably annoyed by the third change of booking. Sorry!");
  })

  test('Запрос данных по частично обновленной брони по id', async () => {
    const responseCreate = await BookerActionsHelper.get(personId);

    expect(responseCreate.status).toBe(200);
    expect(responseCreate.data.firstname).toBe(personThreeName);
    expect(responseCreate.data.lastname).toBe(personThreeLastName);
    expect(responseCreate.data.additionalneeds).toBe("You are probably annoyed by the third change of booking. Sorry!");
  })

  test('Удаление брони', async () => {
    const responseCreate = await BookerActionsHelper.delete(personId, apiToken);

    expect(responseCreate.status).toBe(201);
  })

  test('Запрос брони по id после удаления', async () => {
    const responseCreate = await BookerActionsHelper.get(personId);

    expect(responseCreate.status).toBe(404);
  })

})