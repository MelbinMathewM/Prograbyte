import { IWishlist } from "../../models/wishlistModel";
import { IBaseRepository } from "../IBaseRepository";

export interface IWishlistRepository extends IBaseRepository<IWishlist> {
    getWishlistByUserId(userId: string): Promise<IWishlist | null>;
}
