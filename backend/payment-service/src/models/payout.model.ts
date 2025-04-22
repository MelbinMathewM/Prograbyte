import { Schema, model, Types, Document } from "mongoose";

export interface IPayout extends Document {
    tutor_id: Types.ObjectId;
    type: "course" | "live";
    source_id: Types.ObjectId;
    amount: number;
    status: "pending" | "paid";
    viewers?: number;
    createdAt: Date;
    paidAt?: Date;
}

const payoutSchema = new Schema<IPayout>({
    tutor_id: {
        type: Schema.ObjectId,
        required: true
    },
    type: { 
        type: String, 
        enum: ["course", "live"], 
        required: true 
    },
    source_id: { 
        type: Schema.ObjectId, 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ["pending", "paid"], 
        default: "pending" 
    },
    viewers: { 
        type: Number 
    },
    paidAt: { 
        type: Date 
    }
}, { timestamps: true });

const Payout = model<IPayout>("Payout", payoutSchema);
export default Payout;
