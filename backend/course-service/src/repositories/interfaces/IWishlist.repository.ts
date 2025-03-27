import { IWishlist } from "../../models/wishlist.model";
import { IBaseRepository } from "../IBase.repository";

export interface IWishlistRepository extends IBaseRepository<IWishlist> {
    getWishlistByUserId(userId: string): Promise<IWishlist | null>;
}
