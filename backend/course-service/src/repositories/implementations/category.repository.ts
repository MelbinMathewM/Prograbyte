import { injectable } from "inversify";
import Category, { ICategory } from "../../models/category.model";
import { BaseRepository } from "../base.repository";
import { ICategoryRepository } from "../interfaces/ICategory.repository";

@injectable()
export class CategoryRepository extends BaseRepository<ICategory> implements ICategoryRepository{
    constructor() {
        super(Category);
    }

    async getCategoryByName(name: string): Promise<ICategory | null> {
        try {
            return await this.model.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
        } catch (error) {
            console.error("Error fetching category by name:", error);
            throw new Error("Failed to retrieve category");
        }
    }

    async getCategoryByNameAndNotId(name: string, id: string): Promise<ICategory | null> {
        try {
            return await this.model.findOne({
                name: { $regex: new RegExp(`^${name}$`, "i") },
                _id: { $ne: id }
            });
        } catch (error) {
            console.error("Error fetching category by name and not ID:", error);
            throw new Error("Failed to retrieve category");
        }
    }
}
