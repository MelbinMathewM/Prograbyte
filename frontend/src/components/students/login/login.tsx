import {  useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGithub } from "react-icons/fa";
import axios from "axios";
import { AppDispatch } from "@/redux/store";
import { setUserToken } from "../../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { ChevronLeft } from "lucide-react";
import PasswordInputLogin from "./password-input-login";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

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
    <div className="h-screen bg-white grid grid-cols-1 md:flex">
      {/* Left Section (Logo + Social Auth) */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-gray-200 p-6">
        <h1 className="text-4xl font-bold italic mb-8">Prograbyte</h1>
        <div className="flex flex-col justify-center items-center">
          <h2 className="font-semibold mb-2">Don't have an account?</h2>
          <Link to="/register" className="bg-white text-blue-500 px-4 py-2 rounded-md shadow-md hover:bg-gray-100">
            Sign Up
          </Link>
        </div>
        <div className="my-4 w-full border-t border-gray-300"></div>
        <p className="text-gray-500 mb-6 text-center">Login quickly using social login</p>
        <div className="flex space-x-4">
          <button className="bg-white p-3 rounded-full shadow-md hover:bg-gray-100" onClick={handleGoogleLogin}>
            <FcGoogle className="text-2xl" />
          </button>
          <button className="bg-white p-3 rounded-full shadow-md text-blue-600 hover:bg-gray-100">
            <FaFacebook className="text-2xl" />
          </button>
          <button className="bg-white p-3 rounded-full shadow-md text-gray-800 hover:bg-gray-100">
            <FaGithub className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Right Section (Email & Password Login or Forgot Password Form) */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 space-y-4">
        <div className="w-96 bg-white dark:bg-gray-800 border border-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-xl">
            {isForgotPassword ? "Forgot Password" : "Login"}
          </h2>

          {isForgotPassword ? (
            <div className="w-full pt-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-2 shadow-md border border-gray-100 hover:border-blue-200 rounded mb-4"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
              <button
                className="w-full bg-blue-400 text-white p-2 rounded hover:bg-blue-600"
                onClick={handleForgotPassword}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
              <div className="w-full flex justify-end mt-4">
                <button className="flex items-center text-blue-400 hover:text-blue-600" onClick={() => setIsForgotPassword(false)}>
                  <ChevronLeft className="mt-0.5" size={16} /> Back to Login
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full pt-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-80 p-2 shadow-md border border-gray-100 hover:border-blue-200 rounded mb-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <PasswordInputLogin password={password} setPassword={setPassword}/>
              <button
                className="w-80 bg-blue-400 text-white p-2 rounded hover:bg-blue-600 mb-2"
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
              <div className="w-80 flex justify-end">
                <p className="hover:text-blue-600 text-blue-400 cursor-pointer" onClick={() => setIsForgotPassword(true)}>
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
