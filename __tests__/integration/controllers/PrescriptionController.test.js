import request from 'supertest';
import app from '../../../src/app';
import truncate from '../../truncate';

import factory from '../../factories';

describe('Prescription', () => {
  let token = '';

  beforeEach(async () => {
    await truncate();

    const doctor = await factory.attrs('Doctor');
    doctor.confirmPassword = doctor.password;

    await request(app)
      .post('/api/doctor')
      .send(doctor);

    const response = await request(app)
      .post('/api/auth')
      .send({
        email: doctor.email,
        password: doctor.password,
      });

    token = response.body.result.token;
  });

  it('should be able to create prescription', async () => {
    const prescription = await factory.attrs('Prescription');
    const medicament1 = await factory.attrs('Medicament');
    const medicament2 = await factory.attrs('Medicament');

    prescription.medicament_list = [medicament1, medicament2];

    const reponse = await request(app)
      .post('/api/prescription')
      .set('Authorization', `Bearer ${token}`)
      .send(prescription);

    expect(reponse.status).toBe(200);
    expect(reponse.body.success).toBe(true);
  });

  it('should not be able to create prescription with invalid cpf_pacient', async () => {
    const prescription = await factory.attrs('Prescription');
    const medicament1 = await factory.attrs('Medicament');
    const medicament2 = await factory.attrs('Medicament');

    prescription.medicament_list = [medicament1, medicament2];
    prescription.cpf_patient = '25252525555';

    const reponse = await request(app)
      .post('/api/prescription')
      .set('Authorization', `Bearer ${token}`)
      .send(prescription);

    expect(reponse.status).toBe(400);
    expect(reponse.body.success).toBe(false);
    expect(reponse.body.error).toBe('cpf_patient invalid.');
  });

  it('should not be able to create prescription without cpf_pacient', async () => {
    const prescription = await factory.attrs('Prescription');
    const medicament1 = await factory.attrs('Medicament');
    const medicament2 = await factory.attrs('Medicament');

    prescription.medicament_list = [medicament1, medicament2];
    prescription.cpf_patient = undefined;

    const reponse = await request(app)
      .post('/api/prescription')
      .set('Authorization', `Bearer ${token}`)
      .send(prescription);

    expect(reponse.status).toBe(400);
    expect(reponse.body.success).toBe(false);
    expect(reponse.body.error).toHaveProperty('cpf_patient');
  });

  it('should not be able to create prescription with invalid token', async () => {
    const prescription = await factory.attrs('Prescription');
    const medicament1 = await factory.attrs('Medicament');
    const medicament2 = await factory.attrs('Medicament');

    prescription.medicament_list = [medicament1, medicament2];

    const reponse = await request(app)
      .post('/api/prescription')
      .set('Authorization', `Bearer ${token}2`)
      .send(prescription);

    expect(reponse.status).toBe(401);
    expect(reponse.body.success).toBe(false);
    expect(reponse.body.error).toBe('Invalid Token');
  });

  it('should not be able to create prescription with invalid', async () => {
    const prescription = await factory.attrs('Prescription');
    const medicament1 = await factory.attrs('Medicament');
    const medicament2 = await factory.attrs('Medicament');

    prescription.medicament_list = [medicament1, medicament2];

    const reponse = await request(app)
      .post('/api/prescription')
      .set('Authorization', `Bearer ${token}2`)
      .send(prescription);

    expect(reponse.status).toBe(401);
    expect(reponse.body.success).toBe(false);
    expect(reponse.body.error).toBe('Invalid Token');
  });

  it('should be able to view prescription', async () => {
    const prescription = await factory.attrs('Prescription');
    const medicament1 = await factory.attrs('Medicament');
    const medicament2 = await factory.attrs('Medicament');

    prescription.medicament_list = [medicament1, medicament2];

    await request(app)
      .post('/api/prescription')
      .set('Authorization', `Bearer ${token}`)
      .send(prescription);

    const reponse = await request(app)
      .get('/api/prescription')
      .set('Authorization', `Bearer ${token}`);

    expect(reponse.status).toBe(200);
    expect(reponse.body.success).toBe(true);
    expect(reponse.body.result.length).toBe(1);
    expect(reponse.body.result[0].medicament_list.length).toBe(2);
  });

  it('should not be able to view prescription', async () => {
    const prescription = await factory.attrs('Prescription');
    const medicament1 = await factory.attrs('Medicament');
    const medicament2 = await factory.attrs('Medicament2');

    prescription.medicament_list = [medicament1, medicament2];

    await request(app)
      .post('/api/prescription')
      .set('Authorization', `Bearer ${token}`)
      .send(prescription);

    const doctor2 = await factory.attrs('Doctor2');
    doctor2.confirmPassword = doctor2.password;

    await request(app)
      .post('/api/doctor')
      .send(doctor2);

    const responseAuth = await request(app)
      .post('/api/auth')
      .send({
        email: doctor2.email,
        password: doctor2.password,
      });

    const token2 = responseAuth.body.result.token;

    const reponse = await request(app)
      .get('/api/prescription')
      .set('Authorization', `Bearer ${token2}`);

    expect(reponse.status).toBe(200);
    expect(reponse.body.success).toBe(true);
    expect(reponse.body.result.length).toBe(0);
  });
});
