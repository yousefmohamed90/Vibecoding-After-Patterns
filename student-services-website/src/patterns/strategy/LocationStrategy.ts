import { ISearchStrategy } from './ISearchStrategy'

export class LocationStrategy implements ISearchStrategy {
  async search(_query: string) { return [] }
}
