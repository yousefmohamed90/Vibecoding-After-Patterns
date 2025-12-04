import { ISearchStrategy } from './ISearchStrategy';
import { Accommodation } from '../../entities/Accommodation';

export class PriceStrategy implements ISearchStrategy {
  search(query: string, items: Accommodation[]): Accommodation[] {
    const [min, max] = query.split('-').map(Number);
    if (isNaN(min) || isNaN(max)) return items;
    return items.filter(item => item.pricePerNight >= min && item.pricePerNight <= max);
  }
}
