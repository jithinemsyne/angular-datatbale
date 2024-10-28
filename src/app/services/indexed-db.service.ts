import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface MyDB extends DBSchema {
  users: {
    key: string;
    value: {
      name: string;
      data: number;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
  private db!: Promise<IDBPDatabase<MyDB>>;

  constructor() {
    this.db = this.initDB();
  }

  private async initDB(): Promise<IDBPDatabase<MyDB>> {
    return openDB<MyDB>('my-database', 1, {
      upgrade(db) {
        db.createObjectStore('users', { keyPath: 'name' });
      },
    });
  }

  async addUser(user: { name: string; data: number }) {
    const db = await this.db;
    await db.put('users', user);
  }

  async getUser(name: string) {
    const db = await this.db;
    return db.get('users', name);
  }

  async getAllUsers() {
    const db = await this.db;
    return db.getAll('users');
  }

  async deleteUser(name: string) {
    const db = await this.db;
    return db.delete('users', name);
  }

  async clearUsers() {
    const db = await this.db;
    return db.clear('users');
  }
}
