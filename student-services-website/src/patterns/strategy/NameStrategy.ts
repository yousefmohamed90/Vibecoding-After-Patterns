import { ISearchStrategy } from './ISearchStrategy';
import { Transport } from '../../entities/Transport';

export class NameStrategy implements ISearchStrategy {
    search(query: string, items: Transport[]): Transport[] {
        if (!query) return items;
        const lowerQuery = query.toLowerCase();
        return items.filter(item => item.type.toLowerCase().includes(lowerQuery));
    }
}
