import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Using lucide-react icons

const PasswordInput: React.FC<{
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
}> = ({ password, setPassword, confirmPassword, setConfirmPassword }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="w-full mb-3">
      {/* Password Input */}
      <div className="relative w-full mb-4">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="w-full p-2 border border-gray-100 hover:border-blue-400 rounded pr-10"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Confirm Password Input */}
      <div className="relative w-full">
        <input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm Password"
          className="w-full p-2 border border-gray-100 hover:border-blue-400 rounded pr-10"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          type="button"
          className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
