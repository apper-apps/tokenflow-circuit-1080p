import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { useMobileMenuContext } from "@/hooks/useMobileMenu";

const Header = () => {
  const [notifications] = useState(3);
  const { isOpen, toggle } = useMobileMenuContext();

  return (
    <header className="bg-surface-800 border-b border-surface-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggle}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          
          {/* Workspace Selector */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" size={16} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-surface-50">AI Workspace</h1>
              <p className="text-sm text-surface-400">TokenFlow Pro</p>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <Button variant="ghost" size="sm">
              <ApperIcon name="Bell" size={20} />
              {notifications > 0 && (
                <Badge 
                  variant="danger" 
                  size="sm" 
                  className="absolute -top-2 -right-2 min-w-[20px] h-5 flex items-center justify-center text-xs"
                >
                  {notifications}
                </Badge>
              )}
            </Button>
          </motion.div>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-surface-50">John Doe</p>
              <p className="text-xs text-surface-400">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;