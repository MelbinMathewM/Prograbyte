import axios from "axios";
import Cookies from "js-cookie";
import { store } from "@/redux/store";
import { setUserToken, logout } from "@/redux/slices/authSlice";

const BASE_URL = import.meta.env.VITE_BASE_API_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    console.log(token,'gg')
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
       const role = Cookies.get("role")
        const refreshResponse = await axios.post(
          `${BASE_URL}/auth/refresh_token`,
          {role},
          { withCredentials: true }
        );

        console.log(refreshResponse.data,'dz')
        const newAccessToken = refreshResponse.data;
        
        Cookies.set("accessToken", newAccessToken);
        store.dispatch(setUserToken({ accessToken: newAccessToken, role: store.getState().auth.role }));

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        store.dispatch(logout());
        Cookies.remove("accessToken");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
