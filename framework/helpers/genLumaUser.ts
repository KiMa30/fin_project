import { faker } from '@faker-js/faker';

function genLumaCreds() {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
  }
}

function genLumaPerson() {
  return {
    name: faker.person.firstName(),
    lastname: faker.person.lastName(),
  }
}

export {
    genLumaCreds,
    genLumaPerson
}