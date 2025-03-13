import { useRef } from "react";

interface OTPInputProps {
  otp: string;
  setOtp: (otp: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ otp, setOtp }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers
    if (!value) return;

    const newOtp = otp.split("");
    newOtp[index] = value;
    setOtp(newOtp.join(""));

    if (index < 5 && value) {
      inputRefs.current[index + 1]?.focus(); // Move to next input
    }
  };

  const handleBackspace = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const newOtp = otp.split("");

      if (!otp[index] && index > 0) {
        newOtp[index - 1] = ""; // Clear previous input
        setOtp(newOtp.join(""));
        inputRefs.current[index - 1]?.focus(); // Move to previous input
      } else {
        newOtp[index] = ""; // Clear current input
        setOtp(newOtp.join(""));
      }
    }
  };

  return (
    <div className="flex gap-2 justify-center mb-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          maxLength={1}
          className="w-12 h-12 text-center text-lg border border-gray-300 rounded focus:border-blue-500 outline-none"
          value={otp[index] || ""}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleBackspace(index, e)}
        />
      ))}
    </div>
  );
};

export default OTPInput;
