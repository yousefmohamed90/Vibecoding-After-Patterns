import { IDatabaseAccess } from '../database/IDatabaseAccess';
import { IRepository } from './IRepository';

export class Repository implements IRepository {
  constructor(private dbAccess: IDatabaseAccess) {
    console.log('📦 Repository: Created (Repository Pattern)');
  }

  save(entity: any, tableName: string): void {
    console.log(`📦 Repository: Saving to ${tableName}`, entity);
    const query = `INSERT ${tableName} ${JSON.stringify(entity)}`;
    this.dbAccess.executeQuery(query);
  }

  findById(id: string, tableName: string, idField: string = 'id'): any | null {
    console.log(`📦 Repository: Finding by ID in ${tableName}:`, id);
    const criteria = { [idField]: id };
    const query = `SELECT ${tableName} ${JSON.stringify(criteria)}`;
    return this.dbAccess.executeQuery(query);
  }

  delete(id: string, tableName: string, idField: string = 'id'): void {
    console.log(`📦 Repository: Deleting from ${tableName}:`, id);
    const criteria = { [idField]: id };
    const query = `DELETE ${tableName} ${JSON.stringify(criteria)}`;
    this.dbAccess.executeQuery(query);
  }

  update(entity: any, tableName: string, idField: string): void {
    console.log(`📦 Repository: Updating in ${tableName}`, entity);
    const criteria = { [idField]: entity[idField] };
    const updateData = { criteria, data: entity };
    const query = `UPDATE ${tableName} ${JSON.stringify(updateData)}`;
    this.dbAccess.executeQuery(query);
  }

  findAll(tableName: string): any[] {
    console.log(`📦 Repository: Finding all in ${tableName}`);
    const query = `SELECT_ALL ${tableName}`;
    const result = this.dbAccess.executeQuery(query);
    // Handle Promise if needed
    if (result instanceof Promise) {
      return [];
    }
    return Array.isArray(result) ? result : [];
  }

  findByQuery(criteria: Record<string, any>, tableName: string): any[] {
    console.log(`📦 Repository: Finding by query in ${tableName}`, criteria);
    const allRecords = this.findAll(tableName);
    return allRecords.filter((record: any) => {
      return Object.keys(criteria).every(key => record[key] === criteria[key]);
    });
  }
}
