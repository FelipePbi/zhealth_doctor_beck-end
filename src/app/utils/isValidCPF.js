export default function isValidCPF(inputCPF) {
  let soma = 0;
  let resto;

  if (
    inputCPF === '00000000000' ||
    inputCPF === '11111111111' ||
    inputCPF === '22222222222' ||
    inputCPF === '33333333333' ||
    inputCPF === '44444444444' ||
    inputCPF === '55555555555' ||
    inputCPF === '66666666666' ||
    inputCPF === '77777777777' ||
    inputCPF === '88888888888' ||
    inputCPF === '99999999999'
  ) {
    return false;
  }

  for (let i = 1; i <= 9; i += 1) {
    soma += parseInt(inputCPF.substring(i - 1, i), 0) * (11 - i);
  }
  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) {
    resto = 0;
  }
  if (resto !== parseInt(inputCPF.substring(9, 10), 0)) {
    return false;
  }

  soma = 0;
  for (let i = 1; i <= 10; i += 1) {
    soma += parseInt(inputCPF.substring(i - 1, i), 0) * (12 - i);
  }
  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) {
    resto = 0;
  }
  if (resto !== parseInt(inputCPF.substring(10, 11), 0)) {
    return false;
  }
  return true;
}
