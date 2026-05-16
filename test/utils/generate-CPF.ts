const generateCPF = (formatted: boolean = false): string => {
  const randomDigit = () => Math.floor(Math.random() * 10);

  const digits = Array.from({ length: 9 }, randomDigit);

  if (digits.every((d) => d === digits[0])) {
    return generateCPF(formatted);
  }

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  const digit1 = remainder === 10 || remainder === 11 ? 0 : remainder;
  digits.push(digit1);

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += digits[i] * (11 - i);
  }
  remainder = (sum * 10) % 11;
  const digit2 = remainder === 10 || remainder === 11 ? 0 : remainder;
  digits.push(digit2);

  const cpfString = digits.join('');

  if (formatted) {
    return cpfString.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  return cpfString;
};

export default generateCPF;
