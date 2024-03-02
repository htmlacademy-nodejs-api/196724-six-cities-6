import { Location, CityName, SortName, type LightOffer} from './types/types';

export const CITIES = [
  'Paris',
  'Cologne',
  'Brussels',
  'Amsterdam',
  'Hamburg',
  'Dusseldorf',
];
export const TYPES = ['apartment', 'room', 'house', 'hotel'] as const;
export const GOODS = [
  'Breakfast',
  'Air conditioning',
  'Laptop friendly workspace',
  'Baby seat',
  'Washer',
  'Towels',
  'Fridge',
];

export const STARS_COUNT = 5;
export const MAX_PERCENT_STARS_WIDTH = 100;

export const URL_MARKER_DEFAULT = 'img/pin.svg';
export const URL_MARKER_CURRENT = 'img/pin-active.svg';
export const ZOOM = 13;

export const MAX_COMMENTS = 10;
export const MIN_COMMENT_LENGTH = 50;
export const MAX_COMMENT_LENGTH = 300;

export enum AppRoute {
  Root = '/',
  Login = '/login',
  Register = '/register',
  Favorites = '/favorites',
  Property = '/offer',
  Add = '/add',
  Edit = '/edit',
  NotFound = '/404',
}


export enum BaseRoutes {
  Users = '/users',
  Offers = '/offers',
  Comments = '/comments',
}
export enum ApiRoute {
  Offers = '/offers',
  Login = '/login',
  Logout = '/logout',
  Register = '/register',
  Avatar = '/avatar',
  Comments = '/comments',
  Favorite = '/favorites',
  Premium = '/premium',
}

export enum AuthorizationStatus {
  Auth = 'AUTH',
  NoAuth = 'NO_AUTH',
  Unknown = 'UNKNOWN',
}

export enum Sorting {
  Popular = 'Popular',
  PriceIncrease = 'Price: low to high',
  PriceDecrease = 'Price: high to low',
  TopRated = 'Top rated first',
}

export enum UserType {
  Pro = 'pro',
  Basic = 'basic'
}

export enum StoreSlice {
  SiteData = 'SITE_DATA',
  SiteProcess = 'SITE_PROCESS',
  UserProcess = 'USER_PROCESS',
}

export enum HttpCode {
  NotFound = 404,
  NoAuth = 401,
}

export enum SubmitStatus {
  Still = 'STILL',
  Pending = 'PENDING',
  Fullfilled = 'FULLFILLED',
  Rejected = 'REJECTED',
}

export const Comparator: {
  [key in SortName]: (a: LightOffer, b: LightOffer) => number;
} = {
  Popular: () => 0,
  PriceIncrease: (a, b) => a.price - b.price,
  PriceDecrease: (a, b) => b.price - a.price,
  TopRated: (a, b) => b.rating - a.rating,
};

export const CityLocation: { [key in CityName]: Location } = {
  Paris: {
    latitude: 48.85661,
    longitude: 2.351499,
  },
  Cologne: {
    latitude: 50.938361,
    longitude: 6.959974,
  },
  Brussels: {
    latitude: 50.846557,
    longitude: 4.351697,
  },
  Amsterdam: {
    latitude: 52.37454,
    longitude: 4.897976,
  },
  Hamburg: {
    latitude: 53.550341,
    longitude: 10.000654,
  },
  Dusseldorf: {
    latitude: 51.225402,
    longitude: 6.776314,
  },
};

export const OFFER_STATIC_URLS = [
  'amsterdam.jpg',
  'amsterdam@2x.jpg',
  'apartment-01.jpg',
  'apartment-02.jpg',
  'apartment-03.jpg',
  'apartment-small-03.jpg',
  'apartment-small-04.jpg',
];

export const MIN_OFFER_IMAGES = 6;

