import { AUTHOR_PROPERTIES, OFFER_TRANSFORM_PROPERTIES, USER_TRANSFORM_PROPERTIES } from '../storage-path.constants.js';
import { Offer, User } from '../../../types/index.js';

const isUserAvatarKey = (key: string) => USER_TRANSFORM_PROPERTIES.includes(key);
const isOfferUrl = (key: string) => OFFER_TRANSFORM_PROPERTIES.includes(key);
const isAuthorKey = (key: string) => AUTHOR_PROPERTIES === key;

export const getTransformPaths = (
  data: Record<string, unknown>,
  transformAvatarUrl: (fileName: string) => Pick<User, 'avatarUrl'>,
  transformOfferUrl: (value: string | string[]) => Partial<Pick<Offer, 'previewUrl' | 'urls'>>
): Record<string, unknown> => Object.keys(data).reduce((acc, key) => {
  if (isAuthorKey(key)) {
    const author = data[key] as Record<string, unknown>;
    return {...acc, author: getTransformPaths(author, transformAvatarUrl, transformOfferUrl)};
  }

  if (isUserAvatarKey(key)) {
    return {...acc, ...{...data, ...transformAvatarUrl(data[key] as string)}};
  }

  if (isOfferUrl(key)) {
    return {...acc, ...transformOfferUrl(data[key] as string | string[])};
  }


  return acc;
}, data);
