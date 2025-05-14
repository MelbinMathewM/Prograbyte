import mongoose, { Schema, Document, Types, model } from "mongoose";

export interface IWishlist extends Document {
    userId: Types.ObjectId;
    items: Types.ObjectId[];
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

const Wishlist = model<IWishlist>("Wishlist", WishlistSchema);

export default Wishlist;
