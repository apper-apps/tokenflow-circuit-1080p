import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  color = "primary",
  trend = "up",
  className = ""
}) => {
  const colorVariants = {
    primary: "from-primary-500 to-primary-600",
    secondary: "from-secondary-500 to-secondary-600",
    success: "from-accent-500 to-accent-600",
    warning: "from-yellow-500 to-yellow-600",
    danger: "from-red-500 to-red-600"
  };

  const trendColors = {
    up: "text-accent-400",
    down: "text-red-400",
    neutral: "text-surface-400"
  };

  return (
    <Card className={`p-6 ${className}`} hover>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${colorVariants[color]} shadow-lg`}>
            <ApperIcon name={icon} size={24} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-surface-400">{title}</p>
            <p className="text-2xl font-bold text-surface-50">{value}</p>
          </div>
        </div>
      </div>
      
      {change && (
        <div className="flex items-center">
          <ApperIcon 
            name={trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus"} 
            size={16} 
            className={`mr-2 ${trendColors[trend]}`} 
          />
          <span className={`text-sm font-medium ${trendColors[trend]}`}>
            {change}
          </span>
        </div>
      )}
    </Card>
  );
};

export default StatCard;