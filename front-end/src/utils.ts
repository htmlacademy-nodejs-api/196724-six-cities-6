import { MAX_PERCENT_STARS_WIDTH, STARS_COUNT } from './const';

export const formatDate = (date: string) => new Intl.DateTimeFormat(
  'en-US',
  {'month':'long','year':'numeric'}
).format( new Date(date) );

export const getStarsWidth = (rating: number) =>
  `${(MAX_PERCENT_STARS_WIDTH * Math.round(rating)) / STARS_COUNT}%`;

export const getRandomElement = <T>(array: readonly T[]): T => array[Math.floor(Math.random() * array.length)];
export const pluralize = (str: string, count: number) => count === 1 ? str : `${str}s`;
export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export class Token {
  private static _name = 'six-cities-auth-token';

  static get() {
    const token = localStorage.getItem(this._name);

    return token ?? '';
  }

  static save(token: string) {
    localStorage.setItem(this._name, token);
  }

  static drop() {
    localStorage.removeItem(this._name);
  }
}

export const getRandomNumber = (min: number, max: number, isDecimal?: boolean): number => {
  if(min > max) {
    throw Error('Max argument should be greater than min.');
  }

  if(min === max) {
    return min;
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
