import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Loader2, ArrowLeft } from "lucide-react";
import axios from "axios";

// Validation Schemas
const emailSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const otpSchema = yup.object().shape({
  otp: yup.string().length(6, "OTP must be 6 digits").required("OTP is required"),
});

const detailsSchema = yup.object().shape({
  name: yup.string().required("Name is required").min(3, "At least 3 characters required"),
  username: yup.string().required("Username is required").min(3, "At least 3 characters required"),
  password: yup.string().min(6, "Minimum 6 characters required").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const TutorRegisterPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [resendTimer, setResendTimer] = useState(60);
  const BASE_URL = import.meta.env.VITE_BASE_API_URL;

  const emailForm = useForm({ resolver: yupResolver(emailSchema) });
  const otpForm = useForm({ resolver: yupResolver(otpSchema) });
  const detailsForm = useForm({ resolver: yupResolver(detailsSchema) });

  const requestOTP = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${BASE_URL}/auth/send-otp`, { email: data.email, role: "tutor" });
      setEmail(data.email);
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const resendOTP = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${BASE_URL}/auth/send-otp`, { email, role: "tutor" });
      setResendTimer(60);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${BASE_URL}/auth/verify-otp`, { email, otp: data.otp });
      setStep(3);
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const completeRegistration = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${BASE_URL}/user/tutor-register`, {
        name: data.name,
        email,
        username: data.username,
        password: data.password,
        role: "tutor",
        isEmailVerified: true
      });
      navigate("/login");
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error || "Registration failed");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-center text-3xl font-bold text-gray-800 italic mb-3">Prograbyte</h1>
        <h3 className="text-center text-xl font-semibold mb-6 text-gray-600">Tutor Registration</h3>
        {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

        {step === 1 && (
          <>
            <h2 className="text-lg font-semibold text-center mb-4">Enter Your Email</h2>
            <form onSubmit={emailForm.handleSubmit(requestOTP)} className="space-y-4">
              <Input {...emailForm.register("email")} placeholder="Email" type="email" />
              <p className="text-red-500 text-xs">{emailForm.formState.errors.email?.message}</p>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Send OTP"}
              </Button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-lg font-semibold text-center mb-4">Enter OTP</h2>
            <form onSubmit={otpForm.handleSubmit(verifyOTP)} className="space-y-4">
              <Input {...otpForm.register("otp")} placeholder="Enter OTP" type="text" disabled={loading} />
              <p className="text-red-500 text-xs">{otpForm.formState.errors.otp?.message}</p>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Verify OTP"}
              </Button>
            </form>

            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                onClick={resendOTP}
                disabled={resendTimer > 0 || loading}
                className="text-blue-600"
              >
                {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
              </Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-lg font-semibold text-center mb-4">Complete Registration</h2>
            <form onSubmit={detailsForm.handleSubmit(completeRegistration)} className="space-y-4">
              <Input {...detailsForm.register("name")} placeholder="Full Name" type="text" />
              <p className="text-red-500 text-xs">{detailsForm.formState.errors.name?.message}</p>

              <Input {...detailsForm.register("username")} placeholder="Username" type="text" />
              <p className="text-red-500 text-xs">{detailsForm.formState.errors.username?.message}</p>

              <Input {...detailsForm.register("password")} placeholder="Password" type="password" />
              <p className="text-red-500 text-xs">{detailsForm.formState.errors.password?.message}</p>

              <Input {...detailsForm.register("confirmPassword")} placeholder="Confirm Password" type="password" />
              <p className="text-red-500 text-xs">{detailsForm.formState.errors.confirmPassword?.message}</p>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Register"}
              </Button>
            </form>
          </>
        )}

        <div className="flex justify-center mt-4">
          <Button variant="outline" className="flex items-center" onClick={() => navigate("/profile")}>
            <ArrowLeft className="mr-2" size={18} /> Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TutorRegisterPage;
