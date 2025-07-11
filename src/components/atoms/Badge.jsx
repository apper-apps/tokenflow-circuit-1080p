import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  variant = "default", 
  size = "md", 
  className = "", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-surface-700 text-surface-200",
    primary: "bg-primary-600 text-white",
    secondary: "bg-secondary-600 text-white",
    success: "bg-accent-600 text-white",
    warning: "bg-yellow-600 text-white",
    danger: "bg-red-600 text-white",
    outline: "border border-surface-600 text-surface-300"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;