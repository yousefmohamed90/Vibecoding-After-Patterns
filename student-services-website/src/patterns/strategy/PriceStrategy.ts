import { ISearchStrategy } from './ISearchStrategy'

export class PriceStrategy implements ISearchStrategy {
  async search(_query: string) { return [] }
}
