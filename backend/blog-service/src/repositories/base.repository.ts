import { Model, Document, FilterQuery, UpdateQuery } from "mongoose";
import { IBaseRepository } from "./IBase.repository";

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    const createdDoc = new this.model(data);
    return await createdDoc.save();
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return await this.model.findOne(filter);
  }

  async find(filter: FilterQuery<T> = {}): Promise<T[]> {
    return await this.model.find(filter);
  }

  async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async updateMany(filter: FilterQuery<T>, data: UpdateQuery<T>, options: object = {}): Promise<void> {
    await this.model.updateMany(filter, data, options);
  }

  async delete(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id);
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return await this.model.countDocuments(filter);
  }

  async populate(
    filter: FilterQuery<T> = {},
    populateFields: string | string[]
  ): Promise<T[]> {
    return await this.model.find(filter).populate(populateFields);
  }
  

  async populateOne(
    filter: FilterQuery<T> = {},
    populateFields: string | any
  ): Promise<T | null> {
    return await this.model.findOne(filter).populate(populateFields);
  }

  async save(document: T): Promise<T> {
    return document.save();
  }
}
