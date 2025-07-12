import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = () => {
const navigation = [
    { name: "Dashboard", href: "/", icon: "BarChart3" },
    { name: "Projects", href: "/projects", icon: "FolderOpen" },
    { name: "API Keys", href: "/api-keys", icon: "Key" },
    { name: "Routing Rules", href: "/routing-rules", icon: "GitBranch" },
    { name: "Workspaces", href: "/workspaces", icon: "Briefcase" },
    { name: "Sandbox", href: "/sandbox", icon: "TestTube" },
    { name: "Analytics", href: "/analytics", icon: "TrendingUp" },
    { name: "Team", href: "/team", icon: "Users" },
    { name: "Help Center", href: "/help", icon: "HelpCircle" },
    { name: "Settings", href: "/settings", icon: "Settings" }
];

  return (
    <div className="w-64 bg-surface-800 border-r border-surface-700 h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-surface-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
            <ApperIcon name="Zap" size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-surface-50">TokenFlow</h1>
            <p className="text-sm text-surface-400">Pro</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/25"
                  : "text-surface-300 hover:bg-surface-700 hover:text-surface-100"
              )
            }
          >
            {({ isActive }) => (
              <>
                <ApperIcon 
                  name={item.icon} 
                  size={20} 
                  className={cn(
                    "transition-transform duration-200",
                    isActive ? "text-white" : "text-surface-400 group-hover:text-surface-200"
                  )}
                />
                <span className="font-medium">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-surface-700">
        <div className="flex items-center space-x-3 p-3 bg-surface-700 rounded-lg">
          <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
          <div className="flex-1">
            <p className="text-sm font-medium text-surface-200">System Status</p>
            <p className="text-xs text-surface-400">All systems operational</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;