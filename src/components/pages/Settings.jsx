import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import { toast } from "react-toastify";

const Settings = () => {
  const [workspace, setWorkspace] = useState({
    name: "AI Workspace",
    description: "TokenFlow Pro optimization workspace",
    tier: "pro",
    usageQuota: 1000000,
    currentUsage: 245678
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    costThreshold: 100,
    usageThreshold: 80,
    weeklyReports: true
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: 24,
    ipWhitelist: ""
  });

  const tierOptions = [
    { value: "free", label: "Free Tier" },
    { value: "pro", label: "Pro Tier" },
    { value: "enterprise", label: "Enterprise" }
  ];

  const sessionTimeoutOptions = [
    { value: 1, label: "1 Hour" },
    { value: 8, label: "8 Hours" },
    { value: 24, label: "24 Hours" },
    { value: 168, label: "1 Week" }
  ];

  const handleSaveWorkspace = () => {
    toast.success("Workspace settings saved successfully");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification settings saved successfully");
  };

  const handleSaveSecurity = () => {
    toast.success("Security settings saved successfully");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-surface-50">Settings</h1>
        <p className="text-surface-400 mt-1">
          Manage your workspace preferences and security settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workspace Settings */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Settings" size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-surface-50">Workspace</h3>
          </div>

          <div className="space-y-4">
            <Input
              label="Workspace Name"
              value={workspace.name}
              onChange={(e) => setWorkspace({...workspace, name: e.target.value})}
            />
            
            <div>
              <label className="block text-sm font-medium text-surface-200 mb-2">
                Description
              </label>
              <textarea
                value={workspace.description}
                onChange={(e) => setWorkspace({...workspace, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 bg-surface-800 border border-surface-600 rounded-lg text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <Select
              label="Subscription Tier"
              options={tierOptions}
              value={workspace.tier}
              onChange={(e) => setWorkspace({...workspace, tier: e.target.value})}
            />

            <div>
              <label className="block text-sm font-medium text-surface-200 mb-2">
                Usage Quota
              </label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-400">
                    {workspace.currentUsage.toLocaleString()} / {workspace.usageQuota.toLocaleString()}
                  </span>
                  <Badge variant="primary" size="sm">
                    {Math.round((workspace.currentUsage / workspace.usageQuota) * 100)}%
                  </Badge>
                </div>
                <div className="w-full bg-surface-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(workspace.currentUsage / workspace.usageQuota) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <Button variant="primary" onClick={handleSaveWorkspace} className="w-full">
              <ApperIcon name="Save" size={16} className="mr-2" />
              Save Workspace
            </Button>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Bell" size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-surface-50">Notifications</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-200">Email Alerts</p>
                <p className="text-xs text-surface-400">Receive important notifications via email</p>
              </div>
              <button
                onClick={() => setNotifications({...notifications, emailAlerts: !notifications.emailAlerts})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.emailAlerts ? "bg-primary-600" : "bg-surface-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.emailAlerts ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <Input
              label="Cost Threshold ($)"
              type="number"
              value={notifications.costThreshold}
              onChange={(e) => setNotifications({...notifications, costThreshold: e.target.value})}
            />

            <Input
              label="Usage Threshold (%)"
              type="number"
              value={notifications.usageThreshold}
              onChange={(e) => setNotifications({...notifications, usageThreshold: e.target.value})}
            />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-200">Weekly Reports</p>
                <p className="text-xs text-surface-400">Get weekly usage summaries</p>
              </div>
              <button
                onClick={() => setNotifications({...notifications, weeklyReports: !notifications.weeklyReports})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.weeklyReports ? "bg-primary-600" : "bg-surface-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.weeklyReports ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <Button variant="primary" onClick={handleSaveNotifications} className="w-full">
              <ApperIcon name="Save" size={16} className="mr-2" />
              Save Notifications
            </Button>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Shield" size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-surface-50">Security</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-200">Two-Factor Authentication</p>
                <p className="text-xs text-surface-400">Add an extra layer of security</p>
              </div>
              <button
                onClick={() => setSecurity({...security, twoFactorAuth: !security.twoFactorAuth})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  security.twoFactorAuth ? "bg-primary-600" : "bg-surface-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    security.twoFactorAuth ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <Select
              label="Session Timeout"
              options={sessionTimeoutOptions}
              value={security.sessionTimeout}
              onChange={(e) => setSecurity({...security, sessionTimeout: e.target.value})}
            />

            <div>
              <label className="block text-sm font-medium text-surface-200 mb-2">
                IP Whitelist
              </label>
              <textarea
                value={security.ipWhitelist}
                onChange={(e) => setSecurity({...security, ipWhitelist: e.target.value})}
                rows={3}
                placeholder="Enter IP addresses (one per line)"
                className="w-full px-3 py-2 bg-surface-800 border border-surface-600 rounded-lg text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <Button variant="primary" onClick={handleSaveSecurity} className="w-full">
              <ApperIcon name="Save" size={16} className="mr-2" />
              Save Security
            </Button>
          </div>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="p-6 border-red-500/30">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="AlertTriangle" size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold text-red-400">Danger Zone</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg border border-red-500/20">
            <div>
              <p className="text-sm font-medium text-surface-200">Reset Workspace</p>
              <p className="text-xs text-surface-400">Remove all data and configurations</p>
            </div>
            <Button variant="danger" size="sm">
              <ApperIcon name="RotateCcw" size={16} className="mr-2" />
              Reset
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg border border-red-500/20">
            <div>
              <p className="text-sm font-medium text-surface-200">Delete Workspace</p>
              <p className="text-xs text-surface-400">Permanently delete this workspace</p>
            </div>
            <Button variant="danger" size="sm">
              <ApperIcon name="Trash2" size={16} className="mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;