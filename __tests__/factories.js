import faker from 'faker';
import fakerbr from 'faker-br';
import Doctor from '../src/app/models/Doctor';
import Prescription from '../src/app/models/Prescription';
import Medicament from '../src/app/models/Medicament';
import GenderEnum from '../src/app/enums/GenderEnum';
import UfStateEnum from '../src/app/enums/UfStateEnum';

const { factory } = require('factory-girl');

factory.define('Doctor', Doctor, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  date_of_birth: faker.date.past(),
  cpf: fakerbr.br.cpf(),
  password: faker.internet.password(),
  crm: faker.random.number(),
  crm_state_registration: faker.random.arrayElement(UfStateEnum),
  gender: faker.random.arrayElement(GenderEnum),
});

factory.define('Doctor2', Doctor, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  date_of_birth: faker.date.past(),
  cpf: fakerbr.br.cpf(),
  password: faker.internet.password(),
  crm: faker.random.number(),
  crm_state_registration: faker.random.arrayElement(UfStateEnum),
  gender: faker.random.arrayElement(GenderEnum),
});

factory.define('Prescription', Prescription, {
  name_patient: faker.name.findName(),
  date_of_birt_patient: faker.date.past(),
  cpf_patient: fakerbr.br.cpf(),
});

factory.define('Medicament', Medicament, {
  description: faker.commerce.productName(),
  dosage: faker.random.number(),
  quantity: faker.random.number(),
  frequency_of_use: faker.random.number(),
});

factory.define('Medicament2', Medicament, {
  description: faker.commerce.productName(),
  dosage: faker.random.number(),
  quantity: faker.random.number(),
  frequency_of_use: faker.random.number(),
});

export default factory;
