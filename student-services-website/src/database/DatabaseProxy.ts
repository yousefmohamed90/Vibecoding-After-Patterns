import { IDatabaseAccess } from './IDatabaseAccess';
import { DatabaseManager } from './DatabaseManager';

// Proxy Pattern: Database Access Control & Logging
export class DatabaseProxy implements IDatabaseAccess {
  private realDatabase: DatabaseManager;
  private accessLog: Array<{ query: string; timestamp: Date; status: string }> = [];
  private currentUser: string | null = null;

  constructor() {
    this.realDatabase = DatabaseManager.getInstance();
    console.log('🛡️ DatabaseProxy: Created (Proxy Pattern)');
  }

  public setCurrentUser(userId: string): void {
    this.currentUser = userId;
  }

  public connect(): void {
    if (this.checkAccess('CONNECT')) {
      this.logAccess('CONNECT', 'SUCCESS');
      this.realDatabase.connect();
    } else {
      this.logAccess('CONNECT', 'DENIED');
      throw new Error('Access denied: Cannot connect to database');
    }
  }

  public disconnect(): void {
    this.logAccess('DISCONNECT', 'SUCCESS');
    this.realDatabase.disconnect();
  }

  public executeQuery(query: string): any {
    if (!this.checkAccess('QUERY')) {
      this.logAccess(query, 'DENIED');
      throw new Error('Access denied: Unauthorized query execution');
    }

    try {
      this.logAccess(query, 'EXECUTING');
      const result = this.realDatabase.executeQuery(query);
      this.logAccess(query, 'SUCCESS');
      return result;
    } catch (error) {
      this.logAccess(query, 'ERROR');
      throw error;
    }
  }

  public beginTransaction(): void {
    if (this.checkAccess('TRANSACTION')) {
      this.logAccess('BEGIN_TRANSACTION', 'SUCCESS');
      this.realDatabase.beginTransaction();
    } else {
      this.logAccess('BEGIN_TRANSACTION', 'DENIED');
      throw new Error('Access denied: Cannot start transaction');
    }
  }

  public commit(): void {
    this.logAccess('COMMIT', 'SUCCESS');
    this.realDatabase.commit();
  }

  public rollback(): void {
    this.logAccess('ROLLBACK', 'SUCCESS');
    this.realDatabase.rollback();
  }

  private checkAccess(operation: string): boolean {
    // Simulate access control check
    // In production, this would check user permissions
    console.log(`🔐 DatabaseProxy: Checking access for ${operation}`);

    // For now, allow all operations (can be enhanced with role-based access)
    return true;
  }

  private logAccess(query: string, status: string): void {
    const logEntry = {
      query,
      timestamp: new Date(),
      status,
      user: this.currentUser || 'ANONYMOUS'
    };

    this.accessLog.push(logEntry);
    console.log('📊 DatabaseProxy: Access Log', logEntry);

    // Store logs (optional)
    const logs = localStorage.getItem('database_access_logs');
    const allLogs = logs ? JSON.parse(logs) : [];
    allLogs.push(logEntry);

    // Keep only last 100 logs
    if (allLogs.length > 100) {
      allLogs.shift();
    }

    localStorage.setItem('database_access_logs', JSON.stringify(allLogs));
  }

  public getAccessLogs(): Array<{ query: string; timestamp: Date; status: string }> {
    return [...this.accessLog];
  }

  public clearLogs(): void {
    this.accessLog = [];
    localStorage.removeItem('database_access_logs');
    console.log('🗑️ DatabaseProxy: Access logs cleared');
  }
}
