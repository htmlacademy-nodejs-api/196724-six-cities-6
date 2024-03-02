export class OfferMessages {
  static notFound = (id: string) => `Offer with id «${id}» does not exist.`;
  static new = (name: string) => `New offer created: ${name}`;
  static updated = (name: string) => `${name} offer updated.`;
  static deleted = (name: string) => `${name} offer deleted.`;
  static invalidLimit = (limit: unknown) => `Limit ${limit} is not a number.`;
  static invalidCity = (city: unknown) => `Not able to parse city: ${city}.`;
}
