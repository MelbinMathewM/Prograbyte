import { Router } from "express";
import container from "@/di/container";
import { WishlistController } from "@/controllers/implementations/wishlistController";

const wishlistRouter = Router();
const wishlistController = container.get<WishlistController>(WishlistController);

// Wishlist routes
wishlistRouter.get("/:userId", wishlistController.getWishlist.bind(wishlistController));
wishlistRouter.post("/", wishlistController.addToWishlist.bind(wishlistController));
wishlistRouter.delete("/:userId/:courseId", wishlistController.removeFromWishlist.bind(wishlistController));

export default wishlistRouter;
