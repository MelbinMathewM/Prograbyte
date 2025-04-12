import { ILiveClass } from "@/models/live-schedule.model";

export interface ILiveService {
    postLiveSchedule(data: ILiveClass): Promise<void>;
    getSchedule(schedule_id: string): Promise<ILiveClass | null>;
    getLiveScheduleByTutorId(tutor_id: string): Promise<ILiveClass[]>;
    getLiveScheduleByCourseId(course_id: string): Promise<ILiveClass[]>;
    changeLiveStatus(schedule_id: string, status: Partial<ILiveClass>): Promise<void>;
    checkLiveStatus(schedule_id: string): Promise<boolean>;
    startStream(schedule_id: string, status: Partial<ILiveClass>, token: string): Promise<{streamUrl: string, streamKey: string}>;
    endStream(schedule_id: string, status: Partial<ILiveClass>, token: string): Promise<void>;
}