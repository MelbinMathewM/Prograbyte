import { injectable, inject } from "inversify";
import { ILiveService } from "@/services/interfaces/ILive.service";
import { ILiveRepository } from "@/repositories/interfaces/ILive.repository";
import { ILiveClass } from "@/models/live-schedule.model";
import { createHttpError } from "@/utils/http-error.util";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import { Server, Socket } from "socket.io";
import { SOCKET_EVENTS } from "@/configs/socket.config";

injectable()
export class LiveService implements ILiveService {
    private io: Server;

    constructor(
        @inject("ILiveRepository") private liveRepository: ILiveRepository,
        @inject("SocketIO") io: Server
    ) { 
        this.io = io;
        this.initSocketListener();
    }

    async postLiveSchedule(data: ILiveClass): Promise<void> {

        await this.liveRepository.create(data);

    }

    async getLiveScheduleByTutorId(tutor_id: string): Promise<ILiveClass[]> {
        const schedules = await this.liveRepository.findAll({tutor_id});

        return schedules;
    }

    async changeLiveStatus(schedule_id: string, status: Partial<ILiveClass>): Promise<void> {

        await this.liveRepository.updateById(schedule_id, status);
    }

    async checkLiveStatus(schedule_id: string): Promise<boolean> {

        const schedule = await this.liveRepository.findById(schedule_id);
        if(!schedule){
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.LIVE_SCHEDULE_NOT_FOUND);
        }

        const now = new Date();
        const scheduledTime = new Date(schedule.scheduled_date);

        if (now >= scheduledTime || now >= new Date(scheduledTime.getTime() - 5 * 60000)) {
            return true;
        } else {
            return false;
        }
    }

    public initSocketListener(): void {
        this.io.on(SOCKET_EVENTS.CONNECTION, (socket: Socket) => {
            console.log("📡 New WebRTC Connection:", socket.id);

            socket.on(SOCKET_EVENTS.LIVE_JOIN, (roomId: string) => {
                socket.join(roomId);
                console.log(`👥 User joined live session: ${roomId}`);
            });

            socket.on(SOCKET_EVENTS.LIVE_OFFER, (data) => {
                console.log("📡 Forwarding WebRTC Offer:", data);
                socket.to(data.roomId).emit(SOCKET_EVENTS.LIVE_OFFER, data);
            });

            socket.on(SOCKET_EVENTS.LIVE_ANSWER, (data) => {
                console.log("✅ Forwarding WebRTC Answer:", data);
                socket.to(data.roomId).emit(SOCKET_EVENTS.LIVE_ANSWER, data);
            });

            socket.on(SOCKET_EVENTS.LIVE_ICE_CANDIDATE, (data) => {
                console.log("🔗 Forwarding ICE Candidate:", data);
                socket.to(data.roomId).emit(SOCKET_EVENTS.LIVE_ICE_CANDIDATE, data);
            });

            socket.on(SOCKET_EVENTS.DISCONNECT, () => {
                console.log("🔴 User disconnected from WebRTC:", socket.id);
            });
        });
    }
}