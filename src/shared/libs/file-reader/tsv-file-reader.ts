import { FileReader } from './file-reader.interface.js';
import { readFileSync } from 'node:fs';
import { City, Facility, Location, Offer, PropertyType } from '../../types/index.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  private getLocation(location: string): Location {
    const [ long, lat ] = location.split(',');
    return { long: Number(long), lat: Number(lat) };
  }

  public mapToOffers(): Offer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map((values) => {
        const [name, description, postDate, city, previewUrl, urls, isPremium, isFavourite, rating, type, bedrooms, guests, price, facilities, createdBy, commentsCount, location] = values;
        return ({
          name,
          description,
          postDate: new Date(postDate),
          city: city as City,
          previewUrl,
          urls: urls.split(','),
          isPremium: !!Number(isPremium),
          isFavourite: !!Number(isFavourite),
          rating: Number(rating),
          price: Number.parseInt(price, 10),
          type: type as PropertyType,
          bedrooms: Number(bedrooms),
          guests: Number(guests),
          facilities: facilities.split(',') as Facility[],
          createdBy,
          location: this.getLocation(location),
          commentsCount: commentsCount ? Number(commentsCount) : undefined,
        });
      });
  }
}
