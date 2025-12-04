import { IDatabaseAccess } from './IDatabaseAccess'

// Minimal in-memory DatabaseManager stub that conforms to IDatabaseAccess.
// Replace with a real DB integration (IndexedDB, REST, or server) as needed.
export class DatabaseManager implements IDatabaseAccess {
  private static instance: DatabaseManager | null = null
  private inTransaction = false

  private constructor() {}

  static getInstance() {
    if (!DatabaseManager.instance) DatabaseManager.instance = new DatabaseManager()
    return DatabaseManager.instance
  }

  async connect(): Promise<void> {
    // No-op for in-browser stub
    console.log('DatabaseManager: connect()')
  }

  async disconnect(): Promise<void> {
    console.log('DatabaseManager: disconnect()')
  }

  async executeQuery(query: string): Promise<any> {
    console.log('DatabaseManager: executeQuery', query)
    // Very small demo: persist something to localStorage for queries that start with "INSERT"
    if (query.toUpperCase().startsWith('INSERT')) {
      const key = 'db_stub_rows'
      const rows = JSON.parse(localStorage.getItem(key) || '[]')
      rows.push({ id: Date.now(), query })
      localStorage.setItem(key, JSON.stringify(rows))
      return { success: true }
    }

    if (query.toUpperCase().startsWith('SELECT')) {
      const rows = JSON.parse(localStorage.getItem('db_stub_rows') || '[]')
      return rows
    }

    return { ok: true }
  }

  async beginTransaction(): Promise<void> {
    this.inTransaction = true
    console.log('DatabaseManager: beginTransaction')
  }

  async commit(): Promise<void> {
    this.inTransaction = false
    console.log('DatabaseManager: commit')
  }

  async rollback(): Promise<void> {
    this.inTransaction = false
    console.log('DatabaseManager: rollback')
  }
}
