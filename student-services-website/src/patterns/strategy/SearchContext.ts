import { ISearchStrategy } from './ISearchStrategy';

export class SearchContext {
  private strategy: ISearchStrategy | null = null;

  constructor(strategy?: ISearchStrategy) {
    if (strategy) this.strategy = strategy;
  }

  setStrategy(strategy: ISearchStrategy) {
    this.strategy = strategy;
  }

  executeSearch(query: string, items: any[]): any[] {
    if (!this.strategy) {
      return items;
    }
    return this.strategy.search(query, items);
  }
}
