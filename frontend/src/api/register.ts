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