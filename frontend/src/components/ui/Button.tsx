import React from "react";
import { Loader2 } from "lucide-react"; // Import loading icon

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "success" | "destructive" | "outline";
    isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, className = "", variant, isLoading, ...props }) => {
    const baseStyles = "px-4 py-2 rounded-md font-semibold transition duration-300 flex items-center justify-center";
    
    const variantStyles = variant === "success"
        ? "bg-green-600 hover:bg-green-700 text-white"
        : variant === "destructive"
        ? "bg-red-600 hover:bg-red-700 text-white"
        : "border border-blue-600 text-blue-600 hover:bg-blue-100";

    return (
        <button 
            className={`${baseStyles} ${variantStyles} ${className} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`} 
            disabled={isLoading} 
            {...props}
        >
            {isLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
            {children}
        </button>
    ); 
};

export default Button;
