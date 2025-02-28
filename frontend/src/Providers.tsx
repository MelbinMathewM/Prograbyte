import { UserProvider } from "./contexts/user-context";
import { AdminProvider } from "./contexts/admin-context";
import { TutorProvider } from "./contexts/tutor-context";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const { role } = useSelector((state: RootState) => state.auth);

  if (role === "admin") {
    return <AdminProvider>{children}</AdminProvider>;
  }
  if (role === "tutor") {
    return <TutorProvider>{children}</TutorProvider>;
  }
  if (role === "student") {
    return <UserProvider>{children}</UserProvider>;
  }

  return <>{children}</>;
};

export default Providers;
