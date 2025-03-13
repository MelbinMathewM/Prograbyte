import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGithub } from "react-icons/fa";
import axios from "axios";
import OTPInput from "./otp-input";
import PasswordInput from "./password-input";
import { registerUser, sendOtpToEmail, verifyOtpEmail } from "../../api/register";

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

  const navigate = useNavigate();
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
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      toast.error(error.response.data.error);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/user/google`;
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row">
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-gray-200 p-6">
        <h1 className="text-4xl font-bold italic mb-8">Prograbyte</h1>
        <div className="flex flex-col justify-center items-center">
          <h2 className="font-semibold mb-2">Already have an account?</h2>
          <Link to="/login" className="bg-white text-blue-500 px-4 py-2 rounded-md shadow-md hover:bg-gray-100">
            Sign In
          </Link>
        </div>
        <div className="my-4 w-full border-t border-gray-300"></div>
        <p className="text-gray-500 mb-6 text-center">
          <span className="font-bold">Sign up</span> quickly using social login
        </p>
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
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white p-6">
        {/* Step 1: Enter Email */}
        {step === 1 && (
          <div className="w-96 bg-white dark:bg-gray-800 border border-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl mb-4">Enter Your Email</h2>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 shadow-md border border-gray-100 hover:border-blue-200 rounded mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="w-full bg-blue-400 text-white p-2 rounded hover:bg-blue-600" onClick={sendOtp} disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* Step 2: Verify OTP */}
        {step === 2 && (
          <div className="w-96 bg-white dark:bg-gray-800 border border-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl mb-4">Verify OTP</h2>
            <OTPInput otp={otp} setOtp={setOtp} />
            <button className="w-full bg-green-400 text-white p-2 rounded hover:bg-green-600" onClick={verifyOtp}>
              Verify OTP
            </button>
            <div className="flex flex-row justify-center items-center w-full mt-3 gap-4">
              <button
                className={`flex-[3] p-2 rounded flex items-center justify-center gap-2 ${timer > 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                onClick={sendOtp}
                disabled={timer > 0 || loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 01-8 8z"
                      ></path>
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
          <div className="w-96 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl mb-4">Create Your Account</h2>
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border border-gray-100 hover:border-blue-200 rounded mb-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 border border-gray-100 hover:border-blue-200 rounded mb-4"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <PasswordInput
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
            />
            <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600" onClick={handleRegister}>
              Register
            </button>
            <button className="w-full mt-2 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              onClick={() => {
                setStep(1);
                setOtp("");
              }}>
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
