import { DateTime } from 'luxon';

export const getRandomNumber = (min: number, max: number, isDecimal?: boolean): number => {
  if(min >= max) {
    throw Error('Max argument should be greater than min.');
  }
  const minInt: number = Math.ceil(min);
  const maxInt: number = Math.floor(max);
  const randomNumber: number = Math.random() * (maxInt - minInt) + minInt;
  return isDecimal ? randomNumber : Math.round(randomNumber);
};

export const getRandomItem = (arr: string[]): string => {
  if(!arr.length) {
    return '';
  }

  const randomIndex = getRandomNumber(0, arr.length - 1);
  return arr[randomIndex];
};

export const getSlicedRandomArray = (arr: string[], max?: number): string[] => {
  const end: number = max ?? arr.length;
  return arr.sort(() => Math.random() - Math.random()).slice(0, end);
};

export const getRandomIsoDate = () => DateTime.fromObject({ ordinal: getRandomNumber(1, 365) }).toISODate();
