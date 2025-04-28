import { Schema, Document, model } from "mongoose";

export interface IOffer extends Document {
  title: string;
  description: string;
  discount: number;
  expiryDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const OfferSchema: Schema = new Schema<IOffer>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      min: [1, "Minimum discount is 1%"],
      max: [100, "Maximum discount is 100%"],
    },
    expiryDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Offer = model<IOffer>("Offer", OfferSchema);

export default Offer;
