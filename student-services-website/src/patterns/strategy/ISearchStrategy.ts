export interface ISearchStrategy {
    search(query: string, items: any[]): any[];
}
