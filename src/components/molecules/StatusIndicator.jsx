import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const StatusIndicator = ({ 
  status, 
  label, 
  showIcon = true, 
  showDot = true, 
  className = "" 
}) => {
  const statusConfig = {
    active: {
      color: "success",
      icon: "CheckCircle",
      dotColor: "bg-accent-500",
      glowColor: "shadow-accent-500/50"
    },
    inactive: {
      color: "default",
      icon: "XCircle",
      dotColor: "bg-surface-500",
      glowColor: "shadow-surface-500/50"
    },
    pending: {
      color: "warning",
      icon: "Clock",
      dotColor: "bg-yellow-500",
      glowColor: "shadow-yellow-500/50"
    },
    error: {
      color: "danger",
      icon: "AlertCircle",
      dotColor: "bg-red-500",
      glowColor: "shadow-red-500/50"
    }
  };

  const config = statusConfig[status] || statusConfig.inactive;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showDot && (
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`w-3 h-3 rounded-full ${config.dotColor} shadow-lg ${config.glowColor}`}
        />
      )}
      
      {showIcon && (
        <ApperIcon 
          name={config.icon} 
          size={16} 
          className={`${
            config.color === "success" ? "text-accent-400" :
            config.color === "danger" ? "text-red-400" :
            config.color === "warning" ? "text-yellow-400" :
            "text-surface-400"
          }`} 
        />
      )}
      
      <Badge variant={config.color} size="sm">
        {label || status}
      </Badge>
    </div>
  );
};

export default StatusIndicator;