import { JsonCollection } from '../db/dbStore';

/**
 * Generic repository wrapping a JsonCollection data source.
 * Isolates services from underlying persistence details so storage can be swapped
 * without changing service or controller logic.
 */
export class BaseRepository<T extends { id?: string; _id?: string }> {
  protected readonly collection: JsonCollection<T>;

  constructor(collection: JsonCollection<T>) {
    this.collection = collection;
  }

  findAll(): T[] {
    return this.collection.read();
  }

  findById(id: string): T | null {
    return this.collection.read().find((item) => item.id === id || item._id === id) || null;
  }

  async find(query: Partial<T> = {}): Promise<T[]> {
    return this.collection.find(query);
  }

  async findOne(query: Partial<T>): Promise<T | null> {
    return this.collection.findOne(query);
  }

  async create(item: T): Promise<T> {
    return this.collection.insert(item);
  }

  async upsert(query: Partial<T>, update: Partial<T>): Promise<T> {
    return this.collection.upsert(query, update);
  }

  async updateById(id: string, update: Partial<T>): Promise<T | null> {
    return this.collection.update(id, update);
  }

  async deleteById(id: string, reason?: string): Promise<boolean> {
    return this.collection.delete(id, reason);
  }

  async softDelete(query: Partial<T>, reason?: string): Promise<boolean> {
    return this.collection.softDelete(query, reason);
  }

  async hardDelete(id: string): Promise<boolean> {
    return this.collection.hardDelete(id);
  }

  replaceAll(items: T[]): void {
    this.collection.write(items);
  }
}

