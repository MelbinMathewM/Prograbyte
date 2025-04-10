import { createContext, ReactNode, useLayoutEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout as reduxLogout } from "@/redux/slices/authSlice";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { getUserDataContext } from "@/api/profile";

interface Tutor {
  id: string;
  name: string;
  email: string;
}

interface TutorContextType {
  isAuth: boolean;
  tutor: Tutor | null;
  logout: () => void;
}

const TutorContext = createContext<TutorContextType | null>(null);

const TutorProvider = ({ children }: { children: ReactNode }) => {
  const accessToken = useSelector((state: any) => state.auth.accessToken);
  const role = useSelector((state: any) => state.auth.role);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [tutor, setTutor] = useState<Tutor | null>(null);

  const logout = useCallback(() => {
    dispatch(reduxLogout());
    Cookies.remove("accessToken");
    Cookies.remove("role");
    setTutor(null);
    localStorage.removeItem("theme");
    navigate('/login');
  }, [dispatch]);

  useLayoutEffect(() => {
    if (!accessToken || role !== "tutor") return;

    const fetchTutor = async () => {
      try {
        const res = await getUserDataContext();
        if (res.success) {
          setTutor({ id: res.user._id, name: res.user.name, email: res.user.email });
        } else {
          logout();
        }
      } catch (error: any) {
        console.error("Error fetching tutor data:", error);
        
        if (error.response?.status === 401) {
          logout();
        }
      }
    };

    fetchTutor();
  }, [accessToken, role, logout]);

  return (
    <TutorContext.Provider value={{ isAuth: !!accessToken && role === "tutor", tutor, logout }}>
      {children}
    </TutorContext.Provider>
  );
};

export { TutorContext, TutorProvider };
