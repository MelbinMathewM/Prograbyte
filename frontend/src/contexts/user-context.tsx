import { createContext, ReactNode, useLayoutEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout as reduxLogout } from "../redux/slices/authSlice";
import Cookies from "js-cookie";
import axiosInstance from "../axios/axiosConfig";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  profilePic?: string;
}

interface UserContextType {
  isAuth: boolean;
  user: User | null;
  logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const accessToken = useSelector((state: any) => state.auth.accessToken);
  const role = useSelector((state: any) => state.auth.role);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [user, setUser] = useState<User | null>(null);

  const logout = useCallback(() => {
    dispatch(reduxLogout());
    Cookies.remove("accessToken");
    Cookies.remove("role");
    localStorage.removeItem("theme");
    setUser(null);
    navigate('/login');
  }, [dispatch]);

  useLayoutEffect(() => {
    if (!accessToken || role !== "student") return;

    const fetchStudent = async () => {
      try {
        const res = await axiosInstance.get("/user/user");
        if (res.status === 200) {
          setUser({ id: res.data._id, name: res.data.name, email: res.data.email });
        } else {
          logout();
        }
      } catch (error: any) {
        console.error("Error fetching student data:", error);
        
        if (error.response?.status === 401) {
          logout();
        }
      }
    };

    fetchStudent();
  }, [accessToken, role, logout]);

  return (
    <UserContext.Provider value={{ isAuth: !!accessToken && role === "student", user, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
