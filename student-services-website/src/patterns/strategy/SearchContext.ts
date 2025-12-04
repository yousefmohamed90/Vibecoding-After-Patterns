import { ISearchStrategy } from './ISearchStrategy'

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
      throw new Error('Search strategy not set');
    }
    // Return results synchronously (not awaiting Promise)
    const result = this.strategy.search(query);
    if (result instanceof Promise) {
      return []; // Fallback for async strategies
    }
    return result;
  }
}
