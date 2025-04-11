import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setUserToken } from "@/redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const LoginCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasHandledLogin = useRef(false);

  useEffect(() => {
    if (hasHandledLogin.current) return;
    hasHandledLogin.current = true;

    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const role = params.get("role");

    if (accessToken && role) {
      // Store token and role in Redux
      dispatch(setUserToken({ accessToken, role }));

      // Save token in cookies
      Cookies.set("accessToken", accessToken, { secure: true, sameSite: "None" });
      Cookies.set("role", role);

      // Redirect user to dashboard based on role
      navigate("/home", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [dispatch, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Logging in...</h2>
      <p>Please wait while we process your login.</p>
    </div>
  );
};

export default LoginCallback;
