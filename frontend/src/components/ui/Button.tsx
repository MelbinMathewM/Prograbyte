import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "success" | "destructive" | "outline";
}

const Button: React.FC<ButtonProps> = ({ children, className = "", variant, ...props }) => {
    const baseStyles = "px-4 py-2 rounded-md font-semibold transition duration-300";
    
    const variantStyles = variant === "success"
    ? "bg-green-600 hover:bg-green-700 text-white"
    : variant === "destructive"
    ? "bg-red-600 hover:bg-red-700 text-white"
    : "border border-blue-600 text-blue-600 hover:bg-blue-100";

    return (
        <button className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
