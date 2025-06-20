import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInputLogin: React.FC<{
    password: string;
    setPassword: (password: string) => void;
    isDark: boolean;
  }> = ({ password, setPassword, isDark }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`w-full p-2 pr-10 shadow-md border ${ isDark ? "bg-gray-900 border-gray-700" : "border-gray-200" } hover:border-blue-400 rounded mb-3`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                type="button"
                className="absolute right-3 top-2/5 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
        </div>
    );
};

export default PasswordInputLogin;
