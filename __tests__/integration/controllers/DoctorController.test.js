import request from 'supertest';
import app from '../../../src/app';
import truncate from '../../truncate';

import factory from '../../factories';

describe('Doctor', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to register', async () => {
    const doctor = await factory.attrs('Doctor');
    doctor.confirmPassword = doctor.password;

    const reponse = await request(app)
      .post('/api/doctor')
      .send(doctor);

    expect(reponse.status).toBe(200);
    expect(reponse.body.success).toBe(true);
  });

  it('should not be able to register with duplicated email', async () => {
    const doctor = await factory.attrs('Doctor');
    doctor.confirmPassword = doctor.password;

    const doctorOther = await factory.attrs('Doctor');
    doctorOther.confirmPassword = doctorOther.password;
    doctorOther.email = doctor.email;

    await request(app)
      .post('/api/doctor')
      .send(doctor);

    const reponse = await request(app)
      .post('/api/doctor')
      .send(doctorOther);

    expect(reponse.status).toBe(400);
    expect(reponse.body.success).toBe(false);
  });

  it('should not be able to register with duplicated crm', async () => {
    const doctor = await factory.attrs('Doctor');
    doctor.confirmPassword = doctor.password;

    const doctorOther = await factory.attrs('Doctor');
    doctorOther.confirmPassword = doctorOther.password;
    doctorOther.crm = doctor.crm;

    await request(app)
      .post('/api/doctor')
      .send(doctor);

    const reponse = await request(app)
      .post('/api/doctor')
      .send(doctorOther);

    expect(reponse.status).toBe(400);
    expect(reponse.body.success).toBe(false);
  });

  it('should not be able to register with duplicated cpf', async () => {
    const doctor = await factory.attrs('Doctor');
    doctor.confirmPassword = doctor.password;

    const doctorOther = await factory.attrs('Doctor');
    doctorOther.confirmPassword = doctorOther.password;
    doctorOther.cpf = doctor.cpf;

    await request(app)
      .post('/api/doctor')
      .send(doctor);

    const reponse = await request(app)
      .post('/api/doctor')
      .send(doctorOther);

    expect(reponse.status).toBe(400);
    expect(reponse.body.success).toBe(false);
  });

  it('should not be able to register with invalid cpf', async () => {
    const doctor = await factory.attrs('Doctor');
    doctor.confirmPassword = doctor.password;
    doctor.cpf = '04038196013';

    const reponse = await request(app)
      .post('/api/doctor')
      .send(doctor);

    expect(reponse.status).toBe(400);
    expect(reponse.body.error).toBe('cpf invalid.');
    expect(reponse.body.success).toBe(false);
  });

  it('should not be able to register without name', async () => {
    const doctor = await factory.attrs('Doctor');
    doctor.confirmPassword = doctor.password;
    doctor.name = undefined;

    const reponse = await request(app)
      .post('/api/doctor')
      .send(doctor);

    expect(reponse.status).toBe(400);
    expect(reponse.body.error).toHaveProperty('name');
    expect(reponse.body.error.name).toBe('name is a required field');
    expect(reponse.body.success).toBe(false);
  });
});
