export interface ILiveClassSchedule {
    _id?: string;
    course_id: string;
    topic_id: string;
    tutor_id: string;
    title: string;
    description: string;
    scheduled_date: Date;
    duration: number;
    status: "scheduled" | "live" | "completed" | "canceled";
    room_id?: string;
    meeting_link?: string;
    attendees?: Attendees[];

  }

export interface Attendees {
    student_id: string;
    joined_at: Date;
}