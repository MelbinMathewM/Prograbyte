import { ILiveClass } from "@/models/live-schedule.model";

export interface ILiveService {
    postLiveSchedule(data: ILiveClass): Promise<void>;
    getLiveScheduleByTutorId(tutor_id: string): Promise<ILiveClass[]>;
    changeLiveStatus(schedule_id: string, status: Partial<ILiveClass>): Promise<void>;
    checkLiveStatus(schedule_id: string): Promise<boolean>;
}