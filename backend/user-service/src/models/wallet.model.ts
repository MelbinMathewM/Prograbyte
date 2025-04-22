import { Schema, Document, model, Types } from "mongoose";

export interface IWallet extends Document {
    user_id: Types.ObjectId;
    type: "debit" | "credit";
    source: 'course' | 'premium';
    source_id?: Types.ObjectId;
    amount: Number;
    date: Date;
    description: string;
}

const walletSchema = new Schema<IWallet> ({
    user_id: {
        type: Schema.ObjectId,
        required: true
    },
    type: {
        type: String,
        enum: ["debit", "credit"],
    },
    source: {
        type: String,
        enum: ["course", "premium"]
    },
    source_id: {
        type: Schema.ObjectId
    },
    amount: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String
    }
}, { timestamps: true });

const Wallet = model<IWallet>("Wallet", walletSchema);

export default Wallet;