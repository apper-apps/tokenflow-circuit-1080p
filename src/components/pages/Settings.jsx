import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import QRCode from "qrcode";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import { toast } from "react-toastify";
import { teamService } from "@/services/api/teamService";
import { apiKeyService } from "@/services/api/apiKeyService";
import { useWorkspace } from "@/hooks/useWorkspace";
const Settings = () => {
  const { currentWorkspace, updateWorkspace } = useWorkspace();
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
    ipWhitelist: "",
    twoFactorSecret: "",
    backupCodes: [],
    setupStep: 1,
    verificationCode: "",
    qrCodeDataUrl: ""
  });

  // Team management state
  const [teamMembers, setTeamMembers] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [loadingKeys, setLoadingKeys] = useState(true);
  const [showTeamInvite, setShowTeamInvite] = useState(false);
  const [showApiKeyForm, setShowApiKeyForm] = useState(false);
  const [newTeamMember, setNewTeamMember] = useState({
    email: "",
    role: "user"
  });
  const [newApiKey, setNewApiKey] = useState({
    provider: "",
    name: "",
    encryptedKey: ""
  });

  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
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

  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
    { value: "viewer", label: "Viewer" }
  ];

  const providerOptions = [
    { value: "", label: "Select Provider" },
    { value: "OpenAI", label: "OpenAI" },
    { value: "Anthropic", label: "Anthropic" },
    { value: "Google", label: "Google Gemini" },
    { value: "Cohere", label: "Cohere" },
    { value: "Mistral", label: "Mistral" }
  ];
// Load team members and API keys
  const loadTeamMembers = async () => {
    try {
      setLoadingTeam(true);
      const result = await teamService.getAll();
      setTeamMembers(result);
    } catch (err) {
      toast.error("Failed to load team members");
    } finally {
      setLoadingTeam(false);
    }
  };

  const loadApiKeys = async () => {
    try {
      setLoadingKeys(true);
      const result = await apiKeyService.getAll();
      setApiKeys(result);
    } catch (err) {
      toast.error("Failed to load API keys");
    } finally {
      setLoadingKeys(false);
    }
  };

const handleSaveWorkspace = async () => {
    if (currentWorkspace) {
      try {
        await updateWorkspace(currentWorkspace.Id, workspace);
      } catch (error) {
        // Error handling done in context
      }
    } else {
      toast.success("Workspace settings saved successfully");
    }
  };

  const handleSaveNotifications = () => {
    toast.success("Notification settings saved successfully");
  };

  const handleSaveSecurity = () => {
    toast.success("Security settings saved successfully");
  };

  // Team management handlers
  const handleInviteTeamMember = async () => {
    try {
      if (!newTeamMember.email || !newTeamMember.role) {
        toast.error("Please fill in all fields");
        return;
      }

      const result = await teamService.create({
        ...newTeamMember,
        status: "pending",
        joinedAt: new Date().toISOString()
      });

      setTeamMembers([...teamMembers, result]);
      setNewTeamMember({ email: "", role: "user" });
      setShowTeamInvite(false);
      toast.success("Team member invited successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRemoveTeamMember = async (memberId) => {
    try {
      if (confirm("Are you sure you want to remove this team member?")) {
        await teamService.delete(memberId);
        setTeamMembers(teamMembers.filter(m => m.Id !== memberId));
        toast.success("Team member removed successfully");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // API key management handlers
  const handleAddApiKey = async () => {
    try {
      if (!newApiKey.provider || !newApiKey.name || !newApiKey.encryptedKey) {
        toast.error("Please fill in all fields");
        return;
      }

      const result = await apiKeyService.create({
        ...newApiKey,
        status: "pending",
        lastValidated: null
      });

      setApiKeys([...apiKeys, result]);
      setNewApiKey({ provider: "", name: "", encryptedKey: "" });
      setShowApiKeyForm(false);
      toast.success("API key added successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteApiKey = async (keyId) => {
    try {
      if (confirm("Are you sure you want to delete this API key?")) {
        await apiKeyService.delete(keyId);
        setApiKeys(apiKeys.filter(k => k.Id !== keyId));
        toast.success("API key deleted successfully");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleValidateApiKey = async (keyId) => {
    try {
      const updatedKey = await apiKeyService.update(keyId, { status: "active" });
      setApiKeys(apiKeys.map(key => key.Id === keyId ? updatedKey : key));
      toast.success("API key validated successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };
  const generateTwoFactorSecret = () => {
    // Generate a random base32 secret
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  };

  const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 8; i++) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
    }
    return codes;
  };

  const handleSetupTwoFactor = async () => {
    const secret = generateTwoFactorSecret();
    const issuer = 'TokenFlow Pro';
    const label = 'user@example.com'; // In real app, get from user context
    const otpauthUrl = `otpauth://totp/${issuer}:${label}?secret=${secret}&issuer=${issuer}`;
    
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);
      setSecurity(prev => ({
        ...prev,
        twoFactorSecret: secret,
        qrCodeDataUrl,
        setupStep: 1,
        verificationCode: ""
      }));
      setShowTwoFactorModal(true);
    } catch (error) {
      toast.error("Failed to generate QR code");
    }
  };

  const handleVerifySetup = () => {
    if (security.verificationCode && security.verificationCode.length === 6) {
      const backupCodes = generateBackupCodes();
      setSecurity(prev => ({
        ...prev,
        twoFactorAuth: true,
        backupCodes,
        setupStep: 3
      }));
      toast.success("Two-factor authentication enabled successfully");
    } else {
      toast.error("Please enter a valid 6-digit code");
    }
  };

  const handleDisableTwoFactor = () => {
    if (confirm("Are you sure you want to disable two-factor authentication? This will make your account less secure.")) {
      setSecurity(prev => ({
        ...prev,
        twoFactorAuth: false,
        twoFactorSecret: "",
        backupCodes: [],
        qrCodeDataUrl: ""
      }));
      toast.success("Two-factor authentication disabled");
    }
  };

  const handleFinishSetup = () => {
    setShowTwoFactorModal(false);
    setSecurity(prev => ({
      ...prev,
      setupStep: 1,
      verificationCode: ""
    }));
  };

  const regenerateBackupCodes = () => {
    const backupCodes = generateBackupCodes();
    setSecurity(prev => ({
      ...prev,
      backupCodes
    }));
    toast.success("New backup codes generated");
};

useEffect(() => {
    loadTeamMembers();
    loadApiKeys();
    
    // Sync workspace state with current workspace
    if (currentWorkspace) {
      setWorkspace({
        name: currentWorkspace.name,
        description: currentWorkspace.description,
        tier: currentWorkspace.tier,
        usageQuota: currentWorkspace.usageQuota,
        currentUsage: currentWorkspace.currentUsage
      });
    }
  }, [currentWorkspace]);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-surface-50">Settings</h1>
        <p className="text-surface-400 mt-1">
          Manage your workspace preferences and security settings
        </p>
      </div>

<div className="space-y-6">
        {/* Workspace Overview */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Settings" size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-surface-50">Workspace Settings</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            </div>

            <div className="space-y-4">
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

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-surface-800/50 rounded-lg border border-surface-600">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-surface-400">Team Members</span>
                    <span className="text-lg font-semibold text-surface-50">{teamMembers.length}</span>
                  </div>
                </div>
                <div className="p-3 bg-surface-800/50 rounded-lg border border-surface-600">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-surface-400">API Keys</span>
                    <span className="text-lg font-semibold text-surface-50">{apiKeys.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button variant="primary" onClick={handleSaveWorkspace} className="w-full mt-6">
            <ApperIcon name="Save" size={16} className="mr-2" />
            Save Workspace Settings
          </Button>
        </Card>

        {/* Team Members Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" size={20} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-surface-50">Team Members</h3>
            </div>
            <Button variant="primary" size="sm" onClick={() => setShowTeamInvite(true)}>
              <ApperIcon name="UserPlus" size={16} className="mr-2" />
              Invite Member
            </Button>
          </div>

          {loadingTeam ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Users" size={48} className="mx-auto text-surface-600 mb-4" />
              <p className="text-surface-400">No team members yet</p>
              <Button variant="outline" size="sm" onClick={() => setShowTeamInvite(true)} className="mt-4">
                Invite your first team member
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembers.slice(0, 6).map((member) => (
                <div key={member.Id} className="p-4 bg-surface-800/50 rounded-lg border border-surface-600">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                      <ApperIcon name="User" size={16} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-50 truncate">{member.name}</p>
                      <p className="text-xs text-surface-400 truncate">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant={member.role === "admin" ? "primary" : "secondary"} size="sm">
                      {member.role}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveTeamMember(member.Id)}>
                      <ApperIcon name="UserMinus" size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {teamMembers.length > 6 && (
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">
                View All {teamMembers.length} Members
              </Button>
            </div>
          )}
        </Card>

        {/* API Keys Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Key" size={20} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-surface-50">AI API Keys</h3>
            </div>
            <Button variant="primary" size="sm" onClick={() => setShowApiKeyForm(true)}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add API Key
            </Button>
          </div>

          {loadingKeys ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Key" size={48} className="mx-auto text-surface-600 mb-4" />
              <p className="text-surface-400">No API keys configured</p>
              <Button variant="outline" size="sm" onClick={() => setShowApiKeyForm(true)} className="mt-4">
                Add your first API key
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {apiKeys.slice(0, 5).map((key) => (
                <div key={key.Id} className="p-4 bg-surface-800/50 rounded-lg border border-surface-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <ApperIcon name="Key" size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-surface-50">{key.name}</p>
                        <p className="text-xs text-surface-400">{key.provider}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant={
                          key.status === "active" ? "success" :
                          key.status === "pending" ? "warning" : "danger"
                        } 
                        size="sm"
                      >
                        {key.status}
                      </Badge>
                      {key.status === "pending" && (
                        <Button variant="outline" size="sm" onClick={() => handleValidateApiKey(key.Id)}>
                          <ApperIcon name="Check" size={14} />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteApiKey(key.Id)}>
                        <ApperIcon name="Trash2" size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {apiKeys.length > 5 && (
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">
                View All {apiKeys.length} API Keys
              </Button>
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

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
            {/* Two-Factor Authentication */}
            <div className="p-4 bg-surface-800/50 rounded-lg border border-surface-600">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-surface-200">Two-Factor Authentication</p>
                  <p className="text-xs text-surface-400">Add an extra layer of security to your account</p>
                </div>
                <div className="flex items-center space-x-3">
                  {security.twoFactorAuth && (
                    <Badge variant="success" size="sm">
                      <ApperIcon name="Check" size={12} className="mr-1" />
                      Enabled
                    </Badge>
                  )}
                  <button
                    onClick={security.twoFactorAuth ? handleDisableTwoFactor : handleSetupTwoFactor}
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
              </div>
              
              {security.twoFactorAuth && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-accent-500/10 rounded-lg border border-accent-500/20">
                    <div>
                      <p className="text-sm text-surface-200">Backup Codes</p>
                      <p className="text-xs text-surface-400">{security.backupCodes.length} codes available</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={regenerateBackupCodes}>
                      <ApperIcon name="RefreshCw" size={14} className="mr-2" />
                      Regenerate
                    </Button>
                  </div>
                </div>
              )}
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

      {/* Team Invite Modal */}
      {showTeamInvite && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-800 rounded-lg p-6 w-full max-w-md border border-surface-600"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-surface-50">Invite Team Member</h3>
              <button
                onClick={() => setShowTeamInvite(false)}
                className="text-surface-400 hover:text-surface-200 transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={newTeamMember.email}
                onChange={(e) => setNewTeamMember({ ...newTeamMember, email: e.target.value })}
                placeholder="member@company.com"
              />
              <Select
                label="Role"
                options={roleOptions}
                value={newTeamMember.role}
                onChange={(e) => setNewTeamMember({ ...newTeamMember, role: e.target.value })}
              />
            </div>

            <div className="flex space-x-3 mt-6">
              <Button variant="primary" onClick={handleInviteTeamMember} className="flex-1">
                <ApperIcon name="Send" size={16} className="mr-2" />
                Send Invitation
              </Button>
              <Button variant="outline" onClick={() => setShowTeamInvite(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* API Key Form Modal */}
      {showApiKeyForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-800 rounded-lg p-6 w-full max-w-md border border-surface-600"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-surface-50">Add API Key</h3>
              <button
                onClick={() => setShowApiKeyForm(false)}
                className="text-surface-400 hover:text-surface-200 transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <Select
                label="Provider"
                options={providerOptions}
                value={newApiKey.provider}
                onChange={(e) => setNewApiKey({ ...newApiKey, provider: e.target.value })}
              />
              <Input
                label="Key Name"
                value={newApiKey.name}
                onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
                placeholder="My OpenAI Key"
              />
              <Input
                label="API Key"
                type="password"
                value={newApiKey.encryptedKey}
                onChange={(e) => setNewApiKey({ ...newApiKey, encryptedKey: e.target.value })}
                placeholder="sk-..."
              />
            </div>

            <div className="flex space-x-3 mt-6">
              <Button variant="primary" onClick={handleAddApiKey} className="flex-1">
                <ApperIcon name="Save" size={16} className="mr-2" />
                Save Key
              </Button>
              <Button variant="outline" onClick={() => setShowApiKeyForm(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}

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

      {/* Two-Factor Authentication Setup Modal */}
      {showTwoFactorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-800 rounded-lg p-6 w-full max-w-md border border-surface-600"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-surface-50">
                Setup Two-Factor Authentication
              </h3>
              <button
                onClick={() => setShowTwoFactorModal(false)}
                className="text-surface-400 hover:text-surface-200 transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            {security.setupStep === 1 && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="Smartphone" size={24} className="text-primary-400" />
                  </div>
                  <h4 className="font-medium text-surface-50 mb-2">Scan QR Code</h4>
                  <p className="text-sm text-surface-400 mb-4">
                    Use Google Authenticator, Authy, or any TOTP app to scan this QR code
                  </p>
                </div>
                
                {security.qrCodeDataUrl && (
                  <div className="flex justify-center p-4 bg-white rounded-lg">
                    <img src={security.qrCodeDataUrl} alt="2FA QR Code" className="w-40 h-40" />
                  </div>
                )}
                
                <div className="p-3 bg-surface-700 rounded-lg">
                  <p className="text-xs text-surface-400 mb-1">Manual Entry Key:</p>
                  <p className="text-sm font-mono text-surface-200 break-all">
                    {security.twoFactorSecret}
                  </p>
                </div>
                
                <Button 
                  variant="primary" 
                  onClick={() => setSecurity(prev => ({...prev, setupStep: 2}))}
                  className="w-full"
                >
                  I've Added the Account
                  <ApperIcon name="ArrowRight" size={16} className="ml-2" />
                </Button>
              </div>
            )}

            {security.setupStep === 2 && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="Key" size={24} className="text-accent-400" />
                  </div>
                  <h4 className="font-medium text-surface-50 mb-2">Verify Setup</h4>
                  <p className="text-sm text-surface-400 mb-4">
                    Enter the 6-digit code from your authenticator app
                  </p>
                </div>
                
                <Input
                  label="Verification Code"
                  value={security.verificationCode}
                  onChange={(e) => setSecurity(prev => ({...prev, verificationCode: e.target.value}))}
                  placeholder="000000"
                  maxLength={6}
                  className="text-center text-xl tracking-widest"
                />
                
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setSecurity(prev => ({...prev, setupStep: 1}))}
                    className="flex-1"
                  >
                    <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
                    Back
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={handleVerifySetup}
                    className="flex-1"
                    disabled={security.verificationCode.length !== 6}
                  >
                    Verify & Enable
                  </Button>
                </div>
              </div>
            )}

            {security.setupStep === 3 && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="Shield" size={24} className="text-accent-400" />
                  </div>
                  <h4 className="font-medium text-surface-50 mb-2">Backup Codes</h4>
                  <p className="text-sm text-surface-400 mb-4">
                    Save these backup codes in a secure location. You can use them to access your account if you lose your device.
                  </p>
                </div>
                
                <div className="p-4 bg-surface-700 rounded-lg">
                  <div className="grid grid-cols-2 gap-2">
                    {security.backupCodes.map((code, index) => (
                      <div key={index} className="font-mono text-sm text-surface-200 p-2 bg-surface-800 rounded">
                        {code}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <ApperIcon name="AlertTriangle" size={16} className="text-amber-400 mr-2 flex-shrink-0" />
                  <p className="text-xs text-amber-200">
                    Each backup code can only be used once. Store them securely!
                  </p>
                </div>
                
                <Button 
                  variant="primary" 
                  onClick={handleFinishSetup}
                  className="w-full"
                >
                  <ApperIcon name="Check" size={16} className="mr-2" />
                  I've Saved My Backup Codes
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Settings;