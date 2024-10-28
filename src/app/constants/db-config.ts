import { DBConfig } from "ngx-indexed-db";

export const dbConfig: DBConfig = {
  name: 'MyDatabase',
  version: 1,
  objectStoresMeta: [{
    store: 'bookmarks',
    storeConfig: { keyPath: 'title', autoIncrement: false },
    storeSchema: [
      { name: 'title', keypath: 'title', options: { unique: true } },
      { name: 'data', keypath: 'data', options: { unique: false } }
    ]
  }]
};