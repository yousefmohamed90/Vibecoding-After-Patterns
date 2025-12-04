export interface IDatabaseAccess {
  connect(): Promise<void>
  disconnect(): Promise<void>
  executeQuery(query: string): Promise<any>
  beginTransaction(): Promise<void>
  commit(): Promise<void>
  rollback(): Promise<void>
}
