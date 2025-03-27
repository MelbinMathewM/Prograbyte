import { injectable } from "inversify";
import { BaseRepository } from "../base.repository";
import Wishlist, { IWishlist } from "../../models/wishlist.model";

@injectable()
export class WishlistRepository extends BaseRepository<IWishlist> {
    constructor() {
        super(Wishlist);
    }

    async getWishlistByUserId(userId: string): Promise<IWishlist | null> {
        try {
            return await this.model.findOne({ userId }).populate({
                path: "items",
                select: "title price poster_url",
            });
        } catch (error) {
            console.error("Error fetching wishlist:", error);
            throw new Error("Failed to fetch wishlist");
        }
    }
}
