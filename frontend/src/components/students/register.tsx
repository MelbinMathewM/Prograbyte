import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGithub } from "react-icons/fa";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const role = "student";

  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_API_URL;

  // Timer effect
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
      await axios.post(`${BASE_URL}/notification/send-otp`, { email });
      setOtpSent(true);
      setTimer(60);
      toast.success("OTP sent to your email!");
    } catch (error) {
      toast.error("Failed to send OTP. Try again!");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP function
  const verifyOtp = async () => {
    if (!otp) return toast.error("Enter OTP first!");
    try {
      const response = await axios.post(`${BASE_URL}/notification/verify-otp`, { otp, email });
      if (response.status === 200) {
        setOtpVerified(true);
        toast.success("OTP verified successfully!");
      } else {
        toast.error("Invalid OTP, please try again.");
      }
    } catch (error) {
      toast.error("OTP verification failed.");
    }
  };

  // Handle Registration after OTP Verification
  const handleRegister = async () => {
    if (!name.trim() || !phone.trim() || !password.trim() || !confirmPassword) {
      return toast.error("Please fill in all fields!");
    }
    if (name.length < 3) {
      return toast.error("Name must be at least 3 characters long!");
    }
    const phoneRegex = /^[1-9][0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      return toast.error("Phone number must be 10 digits and should not start with 0!");
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
      const response = await axios.post(`${BASE_URL}/user/register`, {
        name,
        phone,
        email,
        password,
        role,
      });
      if (response.status === 201) {
        toast.success("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Registration failed.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/user/google`;
  };

  return (
    <div className="h-screen grid grid-cols-1 md:flex">
      {/* Left Section */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-gray-200 p-6">
        <h1 className="text-4xl font-bold italic mb-8">Prograbyte</h1>
        <div className="flex flex-col justify-center items-center">
          <h2 className="font-semibold mb-2">Already have an account?</h2>
          <a href="/login" className="bg-white text-blue-500 px-4 py-2 rounded-md shadow-md hover:bg-gray-100">
            Sign In
          </a>
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

      {/* Right Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6">
        <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>

        {/* OTP Step */}
        {!otpVerified ? (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-80 p-2 border rounded mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={otpSent}
            />
            {!otpSent ? (
              <button
                className={`w-80 bg-red-500 text-white p-2 rounded hover:bg-red-600 ${loading && "opacity-50 cursor-not-allowed"}`}
                onClick={sendOtp}
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-80 p-2 border rounded mb-4"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button className="w-80 bg-green-500 text-white p-2 rounded hover:bg-green-600" onClick={verifyOtp}>
                  Verify OTP
                </button>
                <button
                  className={`w-80 p-2 mt-2 rounded ${timer > 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  onClick={sendOtp}
                  disabled={timer > 0}
                >
                  {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
                </button>
              </>
            )}
          </>
        ) : (
          // Registration Form (After OTP Verification)
          <>
            <input type="text" placeholder="Name" className="w-80 p-2 border rounded mb-4" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="tel" placeholder="Phone" className="w-80 p-2 border rounded mb-4" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <input type="password" placeholder="Password" className="w-80 p-2 border rounded mb-4" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input type="password" placeholder="Confirm Password" className="w-80 p-2 border rounded mb-4" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <button className="w-80 bg-green-500 text-white p-2 rounded hover:bg-green-600" onClick={handleRegister}>
              Register
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
