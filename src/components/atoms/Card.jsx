import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className = "", 
  children, 
  hover = false,
  ...props 
}, ref) => {
  const CardComponent = hover ? motion.div : "div";
  
  return (
    <CardComponent
      ref={ref}
      whileHover={hover ? { scale: 1.02 } : undefined}
      className={cn(
        "bg-surface-800 border border-surface-700 rounded-xl shadow-lg shadow-surface-900/50 transition-all duration-200",
        hover && "hover:shadow-xl hover:shadow-surface-900/70 hover:border-surface-600",
        className
      )}
      {...props}
    >
      {children}
    </CardComponent>
  );
});

Card.displayName = "Card";

export default Card;