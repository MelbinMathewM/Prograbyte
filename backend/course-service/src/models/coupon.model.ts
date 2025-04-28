import { Document, model, Schema, Types } from "mongoose";

export interface ICoupon extends Document {
    code: string;
    discount: number;
    isLiveStream: boolean;
    usedBy: Types.ObjectId[];
}

const couponSchema = new Schema<ICoupon>({
    code: {
        type: String,
        required: true,
        unique: true
    },
    discount: {
        type: Number,
        required: true
    },
    isLiveStream: {
        type: Boolean,
        default: false
    },
    usedBy: {
        type: [Schema.Types.ObjectId],
        default: []
    }
}, { timestamps: true });

const Coupon = model<ICoupon>("Coupon", couponSchema);

export default Coupon;