import {Document, model, Schema, Types} from "mongoose";

export interface ILiveClass extends Document {
    tutor_id: Types.ObjectId;
    topic_id: Types.ObjectId;
    course_id: Types.ObjectId;
    title: string;
    description: string;
    scheduled_date: Date;
    duration: number;
    status: string;
    room_id: string;
    meeting_link: string;
    attendees: Attendees[];
}

interface Attendees extends Document {
    student_id: Types.ObjectId;
    joined_at: Date;
}

const LiveClassSchema = new Schema<ILiveClass>({
  tutor_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  topic_id: {
    type: Schema.Types.ObjectId,
    ref: "Topic",
    required: true,
  },
  course_id: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  scheduled_date: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["scheduled", "live", "completed", "canceled"],
    default: "scheduled",
  },
  room_id:{
    type: String,
    required: true
  },
  meeting_link: {
    type: String,
  },
  attendees: [
    {
      student_id: { 
        type: Schema.Types.ObjectId, 
    },
      joined_at: { type: Date },
    },
  ],
}, { timestamps: true });

const LiveClass = model<ILiveClass>("LiveClass", LiveClassSchema);

export default LiveClass;
