import { inject } from "inversify";
import { injectable } from "inversify";
import { IWishlistRepository } from "@/repositories/interfaces/IWishlist.repository";
import { IWishlist } from "@/models/wishlist.model";
import { convertToObjectId } from "@/utils/convert-objectid.util";
import { createHttpError } from "@/utils/http-error.util";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import { IWishlistService } from "../interfaces/IWishlist.service";

@injectable()
export class WishlistService implements IWishlistService {
    constructor(@inject("IWishlistRepository") private wishlistRepository: IWishlistRepository) { }

    async getWishlist(userId: string): Promise<IWishlist> {
        let wishlist = await this.wishlistRepository.getWishlistByUserId(userId);

        const objectIdUser = convertToObjectId(userId)
        if (!wishlist) {
            wishlist = await this.wishlistRepository.create({ userId: objectIdUser, items: [] });
        }

        return wishlist;
    }

    async addWishlist(userId: string, courseId: string): Promise<IWishlist> {

        let wishlist = await this.wishlistRepository.getWishlistByUserId(userId);

        const objectIdCourse = convertToObjectId(courseId);
        const objectIdUser = convertToObjectId(userId);

        if (!wishlist) {
            wishlist = await this.wishlistRepository.create({ userId: objectIdUser, items: [objectIdCourse] });
        } else {
            const itemExists = wishlist.items.some(item => item.toString() === courseId);
            if (!itemExists) {
                wishlist.items.push(objectIdCourse);
            } else {
                throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.COURSE_EXIST_WISHLIST);
            }
        }

        const newWishlist = await this.wishlistRepository.save(wishlist);

        return newWishlist;
    }

    async removeWishlist(userId: string, courseId: string): Promise<void> {
        const wishlist = await this.wishlistRepository.getWishlistByUserId(userId);
        if (!wishlist) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.WISHLIST_NOT_FOUND);
        }

        const itemIndex = wishlist.items.findIndex(item => item._id.toString() === courseId);

        if (itemIndex === -1) {
            throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.COURSE_NOT_FOUND_WISHLIST);
        }

        wishlist.items.splice(itemIndex, 1);

        await this.wishlistRepository.save(wishlist);
    }
}