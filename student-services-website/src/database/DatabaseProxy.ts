import { IDatabaseAccess } from './IDatabaseAccess'
import { DatabaseManager } from './DatabaseManager'

// Proxy Pattern: Database Access Control & Logging
export class DatabaseProxy implements IDatabaseAccess {
  private realDatabase: DatabaseManager
  private accessLog: Array<{ query: string; timestamp: string; status: string; user: string }> = []
  private currentUser: string | null = null

  constructor() {
    this.realDatabase = DatabaseManager.getInstance()
    console.log('🛡️ DatabaseProxy: Created (Proxy Pattern)')
  }

  public setCurrentUser(userId: string): void {
    this.currentUser = userId
  }

  public async connect(): Promise<void> {
    if (this.checkAccess('CONNECT')) {
      this.logAccess('CONNECT', 'SUCCESS')
      await this.realDatabase.connect()
    } else {
      this.logAccess('CONNECT', 'DENIED')
      throw new Error('Access denied: Cannot connect to database')
    }
  }

  public async disconnect(): Promise<void> {
    this.logAccess('DISCONNECT', 'SUCCESS')
    await this.realDatabase.disconnect()
  }

  public async executeQuery(query: string): Promise<any> {
    if (!this.checkAccess('QUERY')) {
      this.logAccess(query, 'DENIED')
      throw new Error('Access denied: Unauthorized query execution')
    }

    try {
      this.logAccess(query, 'EXECUTING')
      const result = await this.realDatabase.executeQuery(query)
      this.logAccess(query, 'SUCCESS')
      return result
    } catch (error) {
      this.logAccess(query, 'ERROR')
      throw error
    }
  }

  public async beginTransaction(): Promise<void> {
    if (this.checkAccess('TRANSACTION')) {
      this.logAccess('BEGIN_TRANSACTION', 'SUCCESS')
      await this.realDatabase.beginTransaction()
    } else {
      this.logAccess('BEGIN_TRANSACTION', 'DENIED')
      throw new Error('Access denied: Cannot start transaction')
    }
  }

  public async commit(): Promise<void> {
    this.logAccess('COMMIT', 'SUCCESS')
    await this.realDatabase.commit()
  }

  public async rollback(): Promise<void> {
    this.logAccess('ROLLBACK', 'SUCCESS')
    await this.realDatabase.rollback()
  }

  private checkAccess(operation: string): boolean {
    // Simulate access control check
    // In production, this would check user permissions
    console.log(`🔐 DatabaseProxy: Checking access for ${operation}`)
    // For now, allow all operations (can be enhanced with role-based access)
    return true
  }

  private logAccess(query: string, status: string): void {
    const logEntry = {
      query,
      timestamp: new Date().toISOString(),
      status,
      user: this.currentUser || 'ANONYMOUS'
    }

    this.accessLog.push(logEntry)
    console.log('📊 DatabaseProxy: Access Log', logEntry)

    // Persist logs to localStorage (browser only)
    try {
      const logs = localStorage.getItem('database_access_logs')
      const allLogs = logs ? JSON.parse(logs) : []
      allLogs.push(logEntry)
      if (allLogs.length > 100) allLogs.shift()
      localStorage.setItem('database_access_logs', JSON.stringify(allLogs))
    } catch (e) {
      // localStorage may be unavailable in some environments; ignore
    }
  }

  public getAccessLogs(): Array<{ query: string; timestamp: string; status: string; user: string }> {
    return [...this.accessLog]
  }

  public clearLogs(): void {
    this.accessLog = []
    try { localStorage.removeItem('database_access_logs') } catch (e) {}
    console.log('🗑️ DatabaseProxy: Access logs cleared')
  }
}
