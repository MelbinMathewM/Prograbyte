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

@injectable()
export class LiveService implements ILiveService {
    private _io: Server;
    private roomViewers: Record<string, Map<string, { sessions: { joined_at: Date; left_at?: Date }[] }>> = {};

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
        return await this._liveRepository.findById(schedule_id);
    }

    async getLiveScheduleByTutorId(tutor_id: string): Promise<ILiveClass[]> {
        return await this._liveRepository.findAll({ tutor_id });
    }

    async getLiveScheduleByCourseId(course_id: string): Promise<ILiveClass[]> {
        return await this._liveRepository.findAll({ course_id });
    }

    async changeLiveStatus(schedule_id: string, status: Partial<ILiveClass>): Promise<void> {
        await this._liveRepository.updateById(schedule_id, status);
    }

    async checkLiveStatus(schedule_id: string): Promise<boolean> {
        const schedule = await this._liveRepository.findById(schedule_id);
        if (!schedule) throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.LIVE_SCHEDULE_NOT_FOUND);

        const now = new Date();
        const scheduledTime = new Date(schedule.scheduled_date);

        return now >= scheduledTime || now >= new Date(scheduledTime.getTime() - 5 * 60000);
    }

    async startStream(schedule_id: string, status: Partial<ILiveClass>, token: string): Promise<{ streamUrl: string; streamKey: string }> {
        const res = await axios.post(
            `${env.BASE_API_URL}/live/stream/start-stream`,
            { schedule_id },
            { headers: { authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );

        if (!res.data.success) {
            throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, HttpResponse.START_STREAM_FAILED);
        }

        await this._liveRepository.updateById(schedule_id, {
            meeting_link: res.data.hlsUrl,
            room_id: res.data.streamKey,
            ...status,
        });

        this._io.emit(SOCKET_EVENTS.LIVE_CLASS_STARTED, {
            schedule_id,
            streamUrl: res.data.streamUrl,
            streamKey: res.data.streamKey,
            message: `The live class has started!`
        });

        return { streamUrl: res.data.hlsUrl, streamKey: res.data.streamKey };
    }

    async endStream(schedule_id: string, status: Partial<ILiveClass>, token: string): Promise<void> {
        const res = await axios.post(
            `${env.BASE_API_URL}/live/stream/stop-stream`,
            { schedule_id },
            { headers: { authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );

        if (!res.data.success) {
            throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, HttpResponse.STOP_STREAM_FAILED);
        }

        const schedule = await this._liveRepository.findById(schedule_id);

        const roomMap = this.roomViewers[schedule?.room_id as string];
        const attendees: ILiveClass["attendees"] = [];
        let totalWatchMinutes = 0;

        if (roomMap) {
            for (const [userId, data] of roomMap.entries()) {
                for (const session of data.sessions) {
                    if (!session.left_at) session.left_at = new Date();

                    const duration = (new Date(session.left_at).getTime() - new Date(session.joined_at).getTime()) / 60000;
                    totalWatchMinutes += duration;

                    attendees.push({ student_id: userId, joined_at: session.joined_at, left_at: session.left_at } as any);
                }
            }
            delete this.roomViewers[schedule_id];
        }

        await this._liveRepository.updateById(schedule_id, {
            ...status,
            attendees,
            totalWatchMinutes: Math.round(totalWatchMinutes),
            viewersCount: attendees.length,
        });
    }

    public initSocketListener(): void {
        this._io.on(SOCKET_EVENTS.CONNECTION, (socket: Socket) => {
            logger.info("New socket.io Connection:", socket.id);
    
            socket.on(SOCKET_EVENTS.JOIN, (roomId: string, username: string) => {
                socket.join(roomId);
    
                if (!this.roomViewers[roomId]) {
                    this.roomViewers[roomId] = new Map();
                }
    
                const existing = this.roomViewers[roomId].get(username);
                const newSession = { joined_at: new Date() };
    
                if (existing) {
                    existing.sessions.push(newSession);
                } else {
                    this.roomViewers[roomId].set(username, { sessions: [newSession] });
                }
    
                logger.info(`${username} joined live session: ${roomId}`);
                const count = this.roomViewers[roomId].size;
                this._io.emit(SOCKET_EVENTS.UPDATE_VIEWER_COUNT, { roomId, count });
            });
    
            socket.on(SOCKET_EVENTS.SEND_COMMENT, (data: { roomId: string; comment: any }) => {
                logger.info("Received comment:", data);
                this._io.emit(SOCKET_EVENTS.RECEIVE_COMMENT, data);
            });
    
            socket.on(SOCKET_EVENTS.LEAVE, (roomId: string, username: string) => {
                const roomMap = this.roomViewers[roomId];
                if (roomMap) {
                    const userData = roomMap.get(username);
                    const lastSession = userData?.sessions[userData.sessions.length - 1];
    
                    if (lastSession && !lastSession.left_at) {
                        lastSession.left_at = new Date();
                        logger.info(`User ${username} left room ${roomId}`);
                    }
    
                    const count = roomMap.size;
                    this._io.emit(SOCKET_EVENTS.UPDATE_VIEWER_COUNT, { roomId, count });
                }
    
                socket.leave(roomId);
            });
    
            socket.on(SOCKET_EVENTS.END_STREAM, (roomId: string) => {
                logger.info(`END_STREAM received for room: ${roomId}`);
    
                const roomMap = this.roomViewers[roomId];
                if (roomMap) {
                    for (const [userId, data] of roomMap) {
                        const lastSession = data.sessions[data.sessions.length - 1];
                        if (lastSession && !lastSession.left_at) {
                            lastSession.left_at = new Date();
                            logger.info(`Session ended for ${userId} in room ${roomId}`);
                        }
                    }
    
                    // Optional cleanup if session is over
                    delete this.roomViewers[roomId];
                }
    
                this._io.emit(SOCKET_EVENTS.END_STREAM, { roomId });
            });
    
            socket.on(SOCKET_EVENTS.DISCONNECT, () => {
                for (const roomId of socket.rooms) {
                    const roomMap = this.roomViewers[roomId];
                    if (!roomMap) continue;
    
                    for (const [userId, data] of roomMap) {
                        const lastSession = data.sessions[data.sessions.length - 1];
                        if (lastSession && !lastSession.left_at) {
                            lastSession.left_at = new Date();
                            logger.info(`Session ended for ${userId} in room ${roomId}`);
                        }
                    }
    
                    const count = roomMap.size;
                    this._io.emit(SOCKET_EVENTS.UPDATE_VIEWER_COUNT, { roomId, count });
                }
            });
        });
    }    
}
