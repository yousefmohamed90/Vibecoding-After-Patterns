export interface IRepository {
  save(entity: any, tableName: string): void;
  findById(id: string, tableName: string): any | null;
  delete(id: string, tableName: string): void;
  update(entity: any, tableName: string, idField: string): void;
  findAll(tableName: string): any[];
  findByQuery(criteria: Record<string, any>, tableName: string): any[];
}
