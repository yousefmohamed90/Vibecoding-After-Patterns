import { ISearchStrategy } from './ISearchStrategy';
import { Accommodation } from '../../entities/Accommodation';

export class LocationStrategy implements ISearchStrategy {
  search(query: string, items: Accommodation[]): Accommodation[] {
    if (!query) return items;
    const lowerQuery = query.toLowerCase();
    return items.filter(item => item.location.toLowerCase().includes(lowerQuery));
  }
}
