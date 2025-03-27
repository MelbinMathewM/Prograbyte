import { IWishlist } from "@/models/wishlist.model";

export interface IWishlistService {
  getWishlist(userId: string): Promise<IWishlist>;
  addWishlist(userId: string, courseId: string): Promise<IWishlist>;
  removeWishlist(userId: string, courseId: string): Promise<void>;
}
