export function generateRandomCode(): string {
  let code = '';
  code += generateRandomLetter();
  code += generateRandomLetter();
  code += generateRandomLetter();
  code += generateRandomNumber();
  code += generateRandomNumber();
  code += generateRandomNumber();
  return code;
}

function generateRandomLetter(): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

function generateRandomNumber(): string {
  const numbers = '0123456789';
  return numbers[Math.floor(Math.random() * numbers.length)];
}
