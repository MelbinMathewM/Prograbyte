import { cn } from "@/libs/utils";
import { Loader2 } from "lucide-react";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "success" | "destructive" | "outline" | "ghost";
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "default",
  isLoading,
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded-md font-semibold transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    default: "bg-blue-600 text-white hover:bg-blue-800 cursor-pointer",
    success: "bg-green-600 hover:bg-green-700 text-white cursor-pointer",
    destructive: "bg-red-600 hover:bg-red-700 text-white cursor-pointer",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-100 cursor-pointer",
    ghost: "text-gray-600 hover:bg-gray-100 cursor-pointer",
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin mr-2" size={16} />}
      {children}
    </button>
  );
};

export default Button;
