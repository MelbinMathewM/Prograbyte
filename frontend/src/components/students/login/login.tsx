import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { AppDispatch } from "@/redux/store";
import { setUserToken } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { ChevronLeft } from "lucide-react";
import PasswordInputLogin from "./password-input-login";
import { useTheme } from "@/contexts/theme-context";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const { theme } = useTheme();
  const isDark = theme === "dark-theme";

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const BASE_URL = import.meta.env.VITE_BASE_API_URL;

  const handleLogin = async () => {
    if (!email || !password) return toast.error("Please enter both email and password!");

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      const { role, accessToken } = response.data;


      Cookies.set("accessToken", accessToken, { expires: 7 });
      Cookies.set("role", role, { expires: 7 });

      dispatch(setUserToken({ accessToken, role }));

      toast.success("Login successful!");

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "tutor") {
        navigate("/tutor/dashboard");
      } else {
        navigate("/home");
      }
    } catch (error: any) {
      if (error.response) {
        const backendMessage = error.response.data.error || "An error occurred";
        toast.error(backendMessage);
      } else if (error.request) {
        toast.error("Server is not responding. Please try again later.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) return toast.error("Please enter an email address!");

    try {
      const response = await axios.post(`${BASE_URL}/auth/forgot_password`, { email: resetEmail });

      if (response.status === 200) {
        toast.success("Password reset email sent! Check your mail");
        setIsForgotPassword(false);
      } else {
        toast.error("Email not found.");
      }
    } catch (error) {
      toast.error("Error sending reset email, please try again.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/user/google`;
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:flex">
      {/* Left Section (Logo + Social Auth) */}
      <div className={`flex flex-col justify-center items-center w-full md:w-1/2 ${ isDark ? "bg-gray-800" : "bg-gray-200" } p-8 shadow-lg transition-all`}>
        {/* Logo */}
        <img
          src="/prograbyte1.png"
          alt="Prograbyte Logo"
          className="w-40 h-auto mb-6"
        />

        {/* Register Prompt */}
        <div className="text-center mb-6">
          <h2 className={`text-start text-sm ${ isDark ? "text-gray-300" : "text-gray-700" } mb-1`}>
            New here?
          </h2>
          <Link
            to="/register"
            className={`inline-flex items-center gap-2 px-5 py-2 border ${ isDark ? "border-blue-400 text-blue-400 hover:bg-blue-500 hover:text-white" : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white" } font-medium rounded-md transition`}
          >
            <span>Register</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7-7l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Social Login */}
        <p className={`text-sm ${ isDark ? "text-gray-400" : "text-gray-500" } mb-2`}>Or continue with</p>
        <div className="flex items-center justify-center gap-4">
          <button
            className={`cursor-pointer ${ isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-100" } p-3 rounded-full shadow transition`}
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Right Section (Email & Password Login or Forgot Password Form) */}
      <div className={`sm:min-h-screen flex flex-col justify-center items-center w-full md:w-1/2 ${isDark ? "bg-gray-900" : "bg-white"} p-2`}>
        <div
          className={`w-96 p-6 rounded-lg shadow-md ${isDark
            ? "bg-gray-900 text-white"
            : "bg-white text-gray-900"
            }`}
        >
          <h2 className="text-xl mb-2">
            {isForgotPassword ? "Forgot Password" : "Login"}
          </h2>

          {isForgotPassword ? (
            <div className="w-full pt-3">
              <input
                type="email"
                placeholder="Enter your email"
                className={`w-full p-2 shadow-md rounded mb-4 border ${isDark
                  ? "bg-gray-700 text-white border-gray-600 bg-gray-900 placeholder-gray-400"
                  : "bg-white text-gray-900 border-gray-200 placeholder-gray-500"
                  } hover:border-blue-400`}
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
              <button
                className={`w-full p-2 rounded font-medium transition ${isDark
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-blue-400 hover:bg-blue-600 text-white"
                  }`}
                onClick={handleForgotPassword}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
              <div className="w-full flex justify-end mt-4">
                <button
                  className={`flex items-center font-medium transition ${isDark
                    ? "text-blue-400 hover:text-blue-500"
                    : "text-blue-500 hover:text-blue-700"
                    }`}
                  onClick={() => setIsForgotPassword(false)}
                >
                  <ChevronLeft className="mt-0.5" size={16} /> Back to Login
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full pt-3">
              <input
                type="email"
                placeholder="Enter your email"
                className={`w-full p-2 shadow-md rounded mb-4 hover:border-blue-400 border ${isDark
                  ? "bg-gray-700 text-white border-gray-600 bg-gray-900 placeholder-gray-400"
                  : "bg-white text-gray-900 border-gray-200 placeholder-gray-500"
                  }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <PasswordInputLogin
                password={password}
                setPassword={setPassword}
              isDark={isDark}
              />
              <button
                className={`w-full p-2 rounded font-medium transition mb-2 ${isDark
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-blue-400 hover:bg-blue-600 text-white"
                  }`}
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
              <div className="w-full flex justify-end">
                <p
                  className={`cursor-pointer font-medium ${isDark
                    ? "text-blue-400 hover:text-blue-500"
                    : "text-blue-500 hover:text-blue-700"
                    }`}
                  onClick={() => setIsForgotPassword(true)}
                >
                  Forgot password?
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
