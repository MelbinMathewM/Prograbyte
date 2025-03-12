import mongoose, { Schema, Document } from "mongoose";

export interface IWishlist extends Document {
    userId: mongoose.Types.ObjectId;
    items: mongoose.Types.ObjectId[];
}

const WishlistSchema = new Schema<IWishlist>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true
        }
    ]
},
    { timestamps: true }
);

const Wishlist = mongoose.model<IWishlist>("Wishlist", WishlistSchema);

export default Wishlist;
