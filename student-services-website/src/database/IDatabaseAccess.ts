// Database Access Interface
export interface IDatabaseAccess {
  connect(): void;
  disconnect(): void;
  executeQuery(query: string): any;
  beginTransaction(): void;
  commit(): void;
  rollback(): void;
}
