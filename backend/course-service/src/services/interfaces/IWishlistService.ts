import { IWishlist } from "@/models/wishlistModel";

export interface IWishlistService {
  getWishlist(userId: string): Promise<IWishlist>;
  addWishlist(userId: string, courseId: string): Promise<IWishlist>;
  removeWishlist(userId: string, courseId: string): Promise<void>;
}
