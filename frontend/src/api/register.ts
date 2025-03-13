import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_API_URL;

export const registerUser = async (name: string, username: string,email: string, password: string, role: string, isEmailVerified: boolean) => {
    try{
        const response = await axios.post(`${BASE_URL}/user/register`,{name, username, email, password, role, isEmailVerified});
        return response.data;
    }catch(err){
        console.log("error registering user");
        throw err;
    }
}

export const sendOtpToEmail = async (email: string) => {
    try{
        const response = await axios.post(`${BASE_URL}/auth/send-otp`,{email});
        return response.data;
    }catch(error){
        console.log("Error sending otp to email");
        throw error;
    }
}

export const verifyOtpEmail = async (email: string, otp: string) => {
    try{
        const response = await axios.post(`${BASE_URL}/auth/verify-otp`,{email,otp});
        return response.data;
    }catch(error){
        console.log("Error verifying otp");
        throw error;
    }
}