import { faker } from '@faker-js/faker'

function getPersonName() {
  return {
    name: faker.person.firstName(),
    surname: faker.person.lastName(),
  }
}

export { getPersonName }
