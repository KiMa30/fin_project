import { clientRestfulBooker } from "../helpers/clientAPI";
import { logger } from "../helpers/logger";

// Проверка соединения
async function checkAPI() {
    const response = await clientRestfulBooker.get(`ping`);
    return response;    
}

// ################################################################################################################
// Создание токена 
async function tokenCreate({ userName, passWord}: { userName: string | undefined, passWord: string | undefined }) {
  const data = {
    username: userName,
    password: passWord,
  }
  
  const response = await clientRestfulBooker.post(`/auth`, data);
  logger.info('Получен ответ на создание токена');
  return response;
}

// ################################################################################################################
// Cоздание брони
async function createBooking({
  name,
  surname,
  price,
  deposit,
  checkIn,
  checkOut,
  addInfo
}: {
  name: string | number,
  surname: string,
  price: number,
  deposit: boolean,
  checkIn: string,
  checkOut: string,
  addInfo: string
}) {
  const data = {
    firstname: name,
    lastname: surname,
    totalprice: price,
    depositpaid: deposit,
    bookingdates: {
      checkin: checkIn,
      checkout: checkOut
    },
    additionalneeds: addInfo
  };

  const response = await clientRestfulBooker.post(`/booking`, data,
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
  );
  logger.info('Получен ответ при создании брони');
  return response;
}

// ################################################################################################################
// Обновление брони
async function updateBooking(
  {
    id,
    authToken,
    name,
    surname,
    price,
    deposit,
    checkIn,
    checkOut,
    addInfo
  }: {
    id: number,
    authToken: string,
    name: string,
    surname: string,
    price: number,
    deposit: boolean,
    checkIn: string,
    checkOut: string,
    addInfo: string  
}) {
  const data = {
    firstname: name,
    lastname: surname,
    totalprice: price,
    depositpaid: deposit,
    bookingdates: {
      checkin: checkIn,
      checkout: checkOut
    },
    additionalneeds: addInfo
  };

  const response = await clientRestfulBooker.put(`/booking/${id}`, data,
  {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cookie': `token=${authToken}`,
    },
  },
);
  logger.info('Получен ответ при полном обновлении бронирования');
  return response;
}

// ################################################################################################################
// Частичное обновление брони
async function updatePartialBooking(
  {
    id,
    authToken,
    name,
    surname,
    addInfo
  }: {
    id: number,
    authToken: string,
    name: string,
    surname: string,
    addInfo: string
  }) {
  const data = {
    firstname: name,
    lastname: surname,
    additionalneeds: addInfo
  }
  const response = await clientRestfulBooker.patch(`/booking/${id}`, data,
  {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cookie': `token=${authToken}`,
    }
  }
);
  logger.info('Получен ответ при частичном обновлении брони');
  return response;
}

// ################################################################################################################
// Запрос брони по Id
async function getBookingById(id: number) {
  const response = await clientRestfulBooker.get(`/booking/${id}`, {
    headers: {
      'Accept': 'application/json',
      
    },
  });
  logger.info('Получен ответ при запросе брони по ID');
  return response;
}

// ################################################################################################################
// Удаление брони
async function deleteBooking(id: number, authToken: string) {
  const response = await clientRestfulBooker.delete(`/booking/${id}`, {
    headers: {
      'Cookie': `token=${authToken}`,
    }
  });
  logger.info('Получен ответ при удалении бронирования');
  return response;  
}

export default {
  check: checkAPI,
  auth: tokenCreate,
  create: createBooking,
  update: updateBooking,
  updatePart: updatePartialBooking,
  get: getBookingById,
  delete: deleteBooking,
};