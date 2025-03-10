import mongoose, {Schema, Document, ObjectId} from "mongoose";

export interface ITutor extends Document {
    _id: string | ObjectId;
    email: string;
    name: String;
    bio?: string;
    profile_pic?: string;
}

const tutorSchema = new Schema<ITutor>({
    _id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    bio: {
        type: String,
    },
    profile_pic: {
        type: String
    }
}, { timestamps: true });

const Tutor = mongoose.model("Tutor", tutorSchema);

export default Tutor;