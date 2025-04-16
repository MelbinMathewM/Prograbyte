import { injectable, inject } from "inversify";
import { ILiveService } from "@/services/interfaces/ILive.service";
import { ILiveRepository } from "@/repositories/interfaces/ILive.repository";
import { ILiveClass } from "@/models/live-schedule.model";
import { createHttpError } from "@/utils/http-error.util";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import { Server, Socket } from "socket.io";
import { SOCKET_EVENTS } from "@/configs/socket.config";
import axios from "axios";
import logger from "@/utils/logger.util";
import { env } from "@/configs/env.config";

injectable()
export class LiveService implements ILiveService {
    private _io: Server;

    constructor(
        @inject("ILiveRepository") private _liveRepository: ILiveRepository,
        @inject("SocketIO") _io: Server
    ) {
        this._io = _io;
        this.initSocketListener();
    }

    async postLiveSchedule(data: ILiveClass): Promise<void> {

        await this._liveRepository.create(data);

    }

    async getSchedule(schedule_id: string): Promise<ILiveClass | null> {
        
        const schedule = await this._liveRepository.findById(schedule_id);

        return schedule;
    }

    async getLiveScheduleByTutorId(tutor_id: string): Promise<ILiveClass[]> {
        const schedules = await this._liveRepository.findAll({ tutor_id });

        return schedules;
    };

    async getLiveScheduleByCourseId(course_id: string): Promise<ILiveClass[]> {
        const schedules = await this._liveRepository.findAll({ course_id });

        return schedules;
    }

    async changeLiveStatus(schedule_id: string, status: Partial<ILiveClass>): Promise<void> {

        await this._liveRepository.updateById(schedule_id, status);
    }

    async checkLiveStatus(schedule_id: string): Promise<boolean> {

        const schedule = await this._liveRepository.findById(schedule_id);
        if (!schedule) {
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

    async startStream(schedule_id: string, status: Partial<ILiveClass>, token: string): Promise<{streamUrl: string, streamKey: string}> {

        const liveStreamResponse = await axios.post(`${env.BASE_API_URL}/live/stream/start-stream`, {
            schedule_id,
        },
            {
                headers: {
                    "authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

        logger.log(liveStreamResponse.data);

        if (!liveStreamResponse.data.success) {
            throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, HttpResponse.START_STREAM_FAILED);
        }

        await this._liveRepository.updateById(schedule_id, {
            meeting_link: liveStreamResponse.data.hlsUrl,
            room_id: liveStreamResponse.data.streamKey,
            ...status,
        });
          

        return {
            streamUrl: liveStreamResponse.data.hlsUrl,
            streamKey: liveStreamResponse.data.streamKey
        };
    }

    async endStream(schedule_id: string, status: Partial<ILiveClass>, token: string): Promise<void> {

        const liveStreamResponse = await axios.post(
            `${env.BASE_API_URL}/live/stream/stop-stream`,
            { schedule_id },
            {
                headers: {
                    "authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!liveStreamResponse.data.success) {
            throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, HttpResponse.STOP_STREAM_FAILED);
        }

        await this._liveRepository.updateById(schedule_id, status);
    }

    public initSocketListener(): void {

        let roomViewers: Record<string, Set<string>> = {};

        this._io.on(SOCKET_EVENTS.CONNECTION, (socket: Socket) => {
            logger.info("New socket.io Connection:", socket.id);

            socket.on(SOCKET_EVENTS.JOIN, (roomId: string, username: string) => {
                socket.join(roomId);

                roomViewers[roomId] = roomViewers[roomId] || new Set();
                roomViewers[roomId].add(username);


                logger.info(`${username} joined live session: ${roomId}`);

                const count = roomViewers[roomId].size;

                this._io.emit(SOCKET_EVENTS.UPDATE_VIEWER_COUNT, { roomId, count });
            });

            socket.on(SOCKET_EVENTS.SEND_COMMENT, (data: { roomId: string; comment: any }) => {
                logger.info("Received comment:", { roomId: data.roomId, comment: data.comment });

                this._io.emit(SOCKET_EVENTS.RECEIVE_COMMENT, data);
            });

            socket.on(SOCKET_EVENTS.DISCONNECT, () => {
                logger.info("User disconnected from WebRTC:", socket.id);

                for (const roomId in roomViewers) {
                    if (roomViewers[roomId].has(socket.id)) {
                        roomViewers[roomId].delete(socket.id);
                        const count = roomViewers[roomId].size;
                        this._io.to(roomId).emit(SOCKET_EVENTS.UPDATE_VIEWER_COUNT, count);
                    }
                }
            });
        });
    }
}