const MAX_RANDOM_INT = 5;
const MIN_RANDOM_INT = 1;

export const getRandomNumber = (min?: number, max?: number): number => {
  const minInt = Math.ceil(min ?? MIN_RANDOM_INT);
  const maxInt = Math.floor(max ?? MAX_RANDOM_INT);
  return Math.floor(Math.random() * (maxInt - minInt) + minInt);
};

export const getRandomBoolean = (): boolean => !!getRandomNumber(0, 1);
