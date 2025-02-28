import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { role } = useSelector((state: RootState) => state.auth);

  return allowedRoles.includes(role || "") ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
