import { createContext, ReactNode, useLayoutEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout as reduxLogout } from "@/redux/slices/authSlice";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { getUserDataContext } from "@/api/profile";

interface Admin {
  id: string;
  name: string;
  email: string;
}

interface AdminContextType {
  isAuth: boolean;
  admin: Admin | null;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

const AdminProvider = ({ children }: { children: ReactNode }) => {
  const accessToken = useSelector((state: any) => state.auth.accessToken);
  const role = useSelector((state: any) => state.auth.role);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [admin, setAdmin] = useState<Admin | null>(null);

  const logout = useCallback(() => {
    dispatch(reduxLogout());
    Cookies.remove("accessToken");
    Cookies.remove("role");
    setAdmin(null);
    localStorage.removeItem("theme");
    navigate('/login');
  }, [dispatch]);

  useLayoutEffect(() => {
    if (!accessToken || role !== "admin") return;

    const fetchAdmin = async () => {
      try {
        const res = await getUserDataContext();
        if (res.success) {
          setAdmin({ id: res.user._id, name: res.user.name, email: res.user.email });
        } else {
          logout();
        }
      } catch (error: any) {
        console.error("Error fetching admin data:", error);
        
        if (error.response?.status === 401) {
          logout();
        }
      }
    };

    fetchAdmin();
  }, [accessToken, role, logout]);

  return (
    <AdminContext.Provider value={{ isAuth: !!accessToken && role === "admin", admin, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export { AdminContext, AdminProvider };
