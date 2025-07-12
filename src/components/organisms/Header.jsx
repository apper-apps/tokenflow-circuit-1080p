import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { useMobileMenuContext } from "@/hooks/useMobileMenu";
import { useWorkspace } from "@/hooks/useWorkspace";

const Header = () => {
  const [notifications] = useState(3);
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const { isOpen, toggle } = useMobileMenuContext();
  const { currentWorkspace, workspaces, switchWorkspace } = useWorkspace();

  const handleWorkspaceSwitch = async (workspace) => {
    if (workspace.Id !== currentWorkspace?.Id) {
      try {
        await switchWorkspace(workspace.Id);
        setShowWorkspaceDropdown(false);
      } catch (error) {
        // Error handling done in context
      }
    }
  };
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
          <div className="relative">
            <button
              onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-surface-700 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Briefcase" size={16} className="text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <h1 className="text-lg font-semibold text-surface-50">
                  {currentWorkspace?.name || 'Loading...'}
                </h1>
                <p className="text-sm text-surface-400">
                  {currentWorkspace?.tier ? `${currentWorkspace.tier} tier` : 'TokenFlow Pro'}
                </p>
              </div>
              <ApperIcon 
                name="ChevronDown" 
                size={16} 
                className={`text-surface-400 transition-transform ${showWorkspaceDropdown ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Workspace Dropdown */}
            {showWorkspaceDropdown && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-surface-800 border border-surface-600 rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-surface-600">
                  <h3 className="text-sm font-medium text-surface-200">Switch Workspace</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {workspaces.map((workspace) => (
                    <button
                      key={workspace.Id}
                      onClick={() => handleWorkspaceSwitch(workspace)}
                      className={`w-full p-3 text-left hover:bg-surface-700 transition-colors ${
                        workspace.Id === currentWorkspace?.Id ? 'bg-primary-500/20' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-gradient-to-r from-accent-500 to-accent-600 rounded flex items-center justify-center">
                            <ApperIcon name="Briefcase" size={12} className="text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-surface-50">{workspace.name}</p>
                            <p className="text-xs text-surface-400 capitalize">{workspace.tier} tier</p>
                          </div>
                        </div>
                        {workspace.Id === currentWorkspace?.Id && (
                          <ApperIcon name="Check" size={16} className="text-primary-400" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="p-3 border-t border-surface-600">
                  <button
                    onClick={() => {
                      setShowWorkspaceDropdown(false);
                      // Navigate to workspaces page
                      window.location.href = '/workspaces';
                    }}
                    className="w-full p-2 text-left text-sm text-surface-300 hover:text-surface-100 transition-colors"
                  >
                    <ApperIcon name="Settings" size={14} className="mr-2 inline" />
                    Manage Workspaces
                  </button>
                </div>
              </div>
            )}

            {/* Overlay to close dropdown */}
            {showWorkspaceDropdown && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowWorkspaceDropdown(false)}
              />
            )}
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