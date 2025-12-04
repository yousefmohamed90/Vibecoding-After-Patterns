import { IDatabaseAccess } from './IDatabaseAccess';

// Minimal in-memory DatabaseManager stub that conforms to IDatabaseAccess.
// Replace with a real DB integration (IndexedDB, REST, or server) as needed.
export class DatabaseManager implements IDatabaseAccess {
  private static instance: DatabaseManager | null = null;
  private inTransaction = false;

  private constructor() { }

  static getInstance() {
    if (!DatabaseManager.instance) DatabaseManager.instance = new DatabaseManager();
    return DatabaseManager.instance;
  }

  connect(): void {
    // No-op for in-browser stub
    console.log('DatabaseManager: connect()');
  }

  disconnect(): void {
    console.log('DatabaseManager: disconnect()');
  }

  executeQuery(query: string): any {
    console.log('DatabaseManager: executeQuery', query);

    // Parse query to determine operation
    const upperQuery = query.toUpperCase();

    if (upperQuery.startsWith('INSERT')) {
      // Extract table name and data
      const match = query.match(/INSERT (\w+) (.+)/);
      if (match) {
        const tableName = match[1];
        const data = JSON.parse(match[2]);
        const key = `db_${tableName}`;
        const rows = JSON.parse(localStorage.getItem(key) || '[]');
        rows.push(data);
        localStorage.setItem(key, JSON.stringify(rows));
        return { success: true };
      }
    }

    if (upperQuery.startsWith('SELECT ')) {
      // Extract table name and criteria
      const match = query.match(/SELECT (\w+) (.+)/);
      if (match) {
        const tableName = match[1];
        const criteria = JSON.parse(match[2]);
        const key = `db_${tableName}`;
        const rows = JSON.parse(localStorage.getItem(key) || '[]');
        const result = rows.find((row: any) => {
          return Object.keys(criteria).every(k => row[k] === criteria[k]);
        });
        return result || null;
      }
    }

    if (upperQuery.startsWith('SELECT_ALL')) {
      const match = query.match(/SELECT_ALL (\w+)/);
      if (match) {
        const tableName = match[1];
        const key = `db_${tableName}`;
        return JSON.parse(localStorage.getItem(key) || '[]');
      }
    }

    if (upperQuery.startsWith('DELETE')) {
      const match = query.match(/DELETE (\w+) (.+)/);
      if (match) {
        const tableName = match[1];
        const criteria = JSON.parse(match[2]);
        const key = `db_${tableName}`;
        const rows = JSON.parse(localStorage.getItem(key) || '[]');
        const filtered = rows.filter((row: any) => {
          return !Object.keys(criteria).every(k => row[k] === criteria[k]);
        });
        localStorage.setItem(key, JSON.stringify(filtered));
        return { success: true };
      }
    }

    if (upperQuery.startsWith('UPDATE')) {
      const match = query.match(/UPDATE (\w+) (.+)/);
      if (match) {
        const tableName = match[1];
        const updateData = JSON.parse(match[2]);
        const { criteria, data } = updateData;
        const key = `db_${tableName}`;
        const rows = JSON.parse(localStorage.getItem(key) || '[]');
        const updated = rows.map((row: any) => {
          const matches = Object.keys(criteria).every(k => row[k] === criteria[k]);
          return matches ? { ...row, ...data } : row;
        });
        localStorage.setItem(key, JSON.stringify(updated));
        return { success: true };
      }
    }

    return { ok: true };
  }

  beginTransaction(): void {
    this.inTransaction = true;
    console.log('DatabaseManager: beginTransaction');
  }

  commit(): void {
    this.inTransaction = false;
    console.log('DatabaseManager: commit');
  }

  rollback(): void {
    this.inTransaction = false;
    console.log('DatabaseManager: rollback');
  }
}
