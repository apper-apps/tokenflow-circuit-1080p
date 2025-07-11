import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  title = "Something went wrong",
  message = "We encountered an error while loading the data. Please try again.",
  onRetry,
  showRetry = true,
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
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-full blur-xl"></div>
        <div className="relative bg-gradient-to-r from-red-500 to-red-600 rounded-full p-4">
          <ApperIcon name="AlertTriangle" size={32} className="text-white" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-surface-50 mb-2">{title}</h3>
      <p className="text-surface-400 mb-6 max-w-md">{message}</p>
      
      {showRetry && onRetry && (
        <Button
          onClick={onRetry}
          variant="primary"
          className="group"
        >
          <ApperIcon name="RotateCcw" size={16} className="mr-2 group-hover:animate-spin" />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default Error;