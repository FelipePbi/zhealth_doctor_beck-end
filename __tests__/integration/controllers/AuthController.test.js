import request from 'supertest';
import app from '../../../src/app';
import truncate from '../../truncate';

import factory from '../../factories';

describe('Auth', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to authenticate', async () => {
    const doctor = await factory.attrs('Doctor');
    doctor.confirmPassword = doctor.password;

    await request(app)
      .post('/api/doctor')
      .send(doctor);

    const reponse = await request(app)
      .post('/api/auth')
      .send({
        email: doctor.email,
        password: doctor.password,
      });

    expect(reponse.body.success).toBe(true);
    expect(reponse.body.result).toHaveProperty('doctorName');
    expect(reponse.body.result).toHaveProperty('token');
    expect(reponse.body.result.doctorName).toBe(doctor.name);
  });

  it('should not be able to authenticate with invalid email', async () => {
    const doctor = await factory.attrs('Doctor');
    doctor.confirmPassword = doctor.password;

    await request(app)
      .post('/api/doctor')
      .send(doctor);

    const reponse = await request(app)
      .post('/api/auth')
      .send({
        email: 'felipe3@felipe',
        password: doctor.password,
      });

    expect(reponse.body.success).toBe(false);
    expect(reponse.body.error.email).toBe('email must be a valid email');
  });

  it('should not be able to authenticate with unregistred email', async () => {
    const doctor = await factory.attrs('Doctor');
    doctor.confirmPassword = doctor.password;

    await request(app)
      .post('/api/doctor')
      .send(doctor);

    const reponse = await request(app)
      .post('/api/auth')
      .send({
        email: 'felipe5@felipe.com',
        password: doctor.password,
      });

    expect(reponse.body.success).toBe(false);
    expect(reponse.body.error).toBe('Email not registred');
  });

  it('should not be able to authenticate with incorrect password', async () => {
    const doctor = await factory.attrs('Doctor');
    doctor.confirmPassword = doctor.password;

    await request(app)
      .post('/api/doctor')
      .send(doctor);

    const reponse = await request(app)
      .post('/api/auth')
      .send({
        email: doctor.email,
        password: '666666',
      });

    expect(reponse.body.success).toBe(false);
    expect(reponse.body.error).toBe('Password does not match');
  });
});
