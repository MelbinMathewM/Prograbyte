import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import OTPInput from "@/components/students/register/otp-input";
import PasswordInput from "@/components/students/register/password-input";
import { registerUser, sendOtpToEmail, verifyOtpEmail } from "@/api/register";
import { AppDispatch } from "@/redux/store";
import { setUserToken } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { useTheme } from "@/contexts/theme-context";

const Register = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const role = "student";

  const { theme } = useTheme();
  const isDark = theme === "dark-theme";

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const BASE_URL = import.meta.env.VITE_BASE_API_URL;

  // Confirm before leaving the page
  useEffect(() => {
    if (step > 1) {
      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        event.preventDefault();
        event.returnValue = "Are you sure you want to leave? Your data will be lost.";
      };
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }
  }, [step]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  // Send OTP function
  const sendOtp = async () => {
    if (!email) return toast.error("Enter your email first!");
    setLoading(true);
    try {
      const response = await sendOtpToEmail(email);
      setOtpSent(true);
      setTimer(60);
      toast.success(response.message);
      setOtp("");
      setStep(2);
    } catch (error: any) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP function
  const verifyOtp = async () => {
    if (!otp) return toast.error("Enter OTP first!");
    try {
      const response = await verifyOtpEmail(email, otp);
      setOtpVerified(true);
      setIsEmailVerified(true);
      setOtp("");
      toast.success(response.message);
      setStep(3);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  // Handle Registration after OTP Verification
  const handleRegister = async () => {
    if (!name.trim()) {
      return toast.error("Please fill name field!")
    }
    if (!username.trim() || !password.trim() || !confirmPassword) {
      return toast.error("Please fill in all fields!");
    }
    if (username.length < 3) {
      return toast.error("Username must be at least 3 characters long!");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long!");
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return toast.error("Password must contain at least one uppercase letter, one number, and one special character!");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    try {
      const response = await registerUser(name, username, email, password, role, isEmailVerified)
      toast.success(response.message);

      const loginResponse = await axios.post(
        `${BASE_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      const { role: userRole, accessToken } = loginResponse.data;

      // Store token and role in cookies
      Cookies.set("accessToken", accessToken, { expires: 7 });
      Cookies.set("role", userRole, { expires: 7 });

      // Update Redux store
      dispatch(setUserToken({ accessToken, role: userRole }));

      toast.success("Login successful!");

      if (userRole === "admin") {
        navigate("/admin/dashboard");
      } else if (userRole === "tutor") {
        navigate("/tutor/dashboard");
      } else {
        navigate("/home");
      }
    } catch (error: any) {
      toast.error(error.response.data.error);
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
            Have an account?
          </h2>
          <Link
            to="/login"
            className={`inline-flex items-center gap-2 px-5 py-2 border ${ isDark ? "border-blue-400 text-blue-400 hover:bg-blue-500 hover:text-white" : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white" } font-medium rounded-md transition`}
          >
            <span>Login</span>
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

      {/* Right Section (Email & OTP or Register Form) */}
      <div className={`sm:min-h-screen flex flex-col justify-center items-center w-full md:w-1/2 ${isDark ? "bg-gray-900" : "bg-white"} p-6`}>
        {/* Step 1: Enter Email */}
        {step === 1 && (
          <div className={`w-96 ${isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"} p-6 rounded-md shadow-md`}>
            <h2 className="text-xl mb-4">Enter Your Email</h2>
            <input
              type="email"
              placeholder="Email"
              className={`w-full p-2 shadow-md border rounded mb-4 ${isDark ? "bg-gray-900 border-gray-700 text-white placeholder-gray-400" : "border-gray-200 hover:border-blue-200"} hover:border-blue-400`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              onClick={sendOtp}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* Step 2: Verify OTP */}
        {step === 2 && (
          <div className={`w-96 ${isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"} p-6 rounded-md shadow-md`}>
            <h2 className="text-xl mb-4">Verify OTP</h2>
            <OTPInput otp={otp} setOtp={setOtp} />
            <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600" onClick={verifyOtp}>
              Verify OTP
            </button>

            <div className="flex flex-row justify-center items-center w-full mt-3 gap-4">
              <button
                className={`flex-[3] p-2 rounded flex items-center justify-center gap-2 ${timer > 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                onClick={sendOtp}
                disabled={timer > 0 || loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 01-8 8z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>{timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}</>
                )}
              </button>
              <button
                className="flex-[1] bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                onClick={() => setStep(1)}
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Enter User Details */}
        {step === 3 && otpVerified && (
          <div className={`w-96 ${isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"} p-6 rounded-md shadow-md`}>
            <h2 className="text-xl mb-4">Create Your Account</h2>
            <input
              type="text"
              placeholder="Name"
              className={`w-full p-2 border rounded mb-4 hover:border-blue-400 ${isDark ? "bg-gray-900 border-gray-700 text-white placeholder-gray-400" : "border-gray-200 hover:border-blue-200"}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Username"
              className={`w-full p-2 border rounded mb-4 hover:border-blue-400 ${isDark ? "bg-gray-900 border-gray-700 text-white placeholder-gray-400" : "border-gray-200 hover:border-blue-200"}`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <PasswordInput
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              isDark={isDark}
            />
            <button
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
              onClick={handleRegister}
            >
              Register
            </button>
            <button
              className="w-full mt-2 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              onClick={() => {
                setStep(1);
                setOtp("");
              }}
            >
              Back
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default Register;
