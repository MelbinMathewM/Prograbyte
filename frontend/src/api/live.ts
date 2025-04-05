import axiosInstance from "@/configs/axiosConfig";
import { ILiveClassSchedule } from "@/types/live";

export const createLiveSchedule = async (data: ILiveClassSchedule) => {
    try{
        const response = await axiosInstance.post(`/course/live`,data);
        return response.data;
    }catch(err){
        console.error("Error creating live schedule",err);
        throw err;
    }
}

export const getLiveSchedules = async (tutor_id: string) => {
    try{
        const response = await axiosInstance.get(`/course/live`,{ params: {tutor_id} });
        return response.data;
    }catch(err){
        console.error("Error fetching live schedules",err);
        throw err;
    }
}

export const changeLiveSchedule = async (schedule_id: string, status: string) => {
    try{
        const response = await axiosInstance.patch(`/course/live/${schedule_id}/status`, {status} );
        return response.data;
    }catch(err){
        console.error("Error canceling live",err);
        throw err;
    }
}

export const checkLiveStart = async (schedule_id: string) => {
    try{
        const response = await axiosInstance.get(`/course/live/${schedule_id}/check`);
        return response.data;
    }catch(err){
        console.error("Error checking live time",err);
        throw err;
    }
}