import { injectable } from "inversify";
import { BaseRepository } from "../base.repository";
import LiveClass, { ILiveClass } from "@/models/live-schedule.model";
import { ILiveRepository } from "../interfaces/ILive.repository";

@injectable()
export class LiveRepository extends BaseRepository<ILiveClass> implements ILiveRepository {
    constructor() {
        super(LiveClass);
    }
}