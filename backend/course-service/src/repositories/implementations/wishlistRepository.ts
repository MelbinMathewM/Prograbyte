import { injectable } from "inversify";
import { BaseRepository } from "../baseRepository";
import Wishlist, { IWishlist } from "../../models/wishlistModel";

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
