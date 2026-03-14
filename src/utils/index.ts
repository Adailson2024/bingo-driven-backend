export function generateRandomNumber(minNumber: number, maxNumber: number) {
  return Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
}

export function generateRandomNumberNotUsed(numbers: number[], min: number, max: number) {
  const allNumbersAlreadyUsed = numbers.length >= max - min + 1;
  if (allNumbersAlreadyUsed) return null;

  let nextNumber = generateRandomNumber(min, max);
  let nextNumberFound = false;

  do {
    const numberAlreadyUsed = numbers.find(number => number === nextNumber);
    if (!numberAlreadyUsed) nextNumberFound = true;
    else {
      nextNumber = generateRandomNumber(min, max);
    }
  } while (!nextNumberFound);

  return nextNumber;
}