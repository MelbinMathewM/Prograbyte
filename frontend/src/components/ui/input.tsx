import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={`border p-2 rounded-md w-full focus:outline-none ${className}`}
    {...props}
  />
));
