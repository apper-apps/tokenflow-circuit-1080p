import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data found",
  message = "Get started by creating your first item.",
  icon = "Database",
  actionLabel = "Create New",
  onAction,
  showAction = true,
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col items-center justify-center min-h-[400px] text-center ${className}`}
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full blur-xl"></div>
        <div className="relative bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full p-4">
          <ApperIcon name={icon} size={32} className="text-white" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-surface-50 mb-2">{title}</h3>
      <p className="text-surface-400 mb-6 max-w-md">{message}</p>
      
      {showAction && onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          className="group"
        >
          <ApperIcon name="Plus" size={16} className="mr-2 group-hover:scale-110 transition-transform" />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;