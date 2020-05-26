import isValidCpf from '../../../src/app/utils/isValidCPF';

describe('isValidCpf', () => {
  it('should be valid cpf 04038196011', async () => {
    const reponse = isValidCpf('04038196011');

    expect(reponse).toBe(true);
  });

  it('should not be valid cpf 04038196013', async () => {
    const reponse = isValidCpf('04038196013');

    expect(reponse).toBe(false);
  });

  it('should not be valid cpf 00000000000', async () => {
    const reponse = isValidCpf('00000000000');

    expect(reponse).toBe(false);
  });

  it('should not be valid cpf 12345678900', async () => {
    const reponse = isValidCpf('12345678900');

    expect(reponse).toBe(false);
  });
});
