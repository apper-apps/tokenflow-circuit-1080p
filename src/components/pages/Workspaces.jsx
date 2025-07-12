import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import { useWorkspace } from "@/hooks/useWorkspace";
import { toast } from "react-toastify";

const Workspaces = () => {
  const { 
    workspaces, 
    currentWorkspace, 
    loading, 
    switchWorkspace, 
    createWorkspace, 
    updateWorkspace, 
    deleteWorkspace 
  } = useWorkspace();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterTier, setFilterTier] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tier: "free",
    region: "us-east-1"
  });

  const tierOptions = [
    { value: "all", label: "All Tiers" },
    { value: "free", label: "Free Tier" },
    { value: "pro", label: "Pro Tier" },
    { value: "enterprise", label: "Enterprise" }
  ];

  const regionOptions = [
    { value: "us-east-1", label: "US East (N. Virginia)" },
    { value: "us-west-2", label: "US West (Oregon)" },
    { value: "eu-west-1", label: "Europe (Ireland)" },
    { value: "ap-southeast-1", label: "Asia Pacific (Singapore)" }
  ];

  const filteredWorkspaces = workspaces.filter(workspace => {
    const matchesSearch = workspace.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workspace.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = filterTier === "all" || workspace.tier === filterTier;
    return matchesSearch && matchesTier;
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      tier: "free",
      region: "us-east-1"
    });
  };

  const handleCreateWorkspace = async () => {
    try {
      if (!formData.name.trim()) {
        toast.error("Workspace name is required");
        return;
      }

      await createWorkspace(formData);
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      // Error handling done in context
    }
  };

  const handleEditWorkspace = async () => {
    try {
      if (!formData.name.trim()) {
        toast.error("Workspace name is required");
        return;
      }

      await updateWorkspace(selectedWorkspace.Id, formData);
      setShowEditModal(false);
      setSelectedWorkspace(null);
      resetForm();
    } catch (error) {
      // Error handling done in context
    }
  };

  const handleDeleteWorkspace = async (workspace) => {
    if (workspaces.length === 1) {
      toast.error("Cannot delete the last workspace");
      return;
    }

    if (confirm(`Are you sure you want to delete "${workspace.name}"? This action cannot be undone.`)) {
      try {
        await deleteWorkspace(workspace.Id);
      } catch (error) {
        // Error handling done in context
      }
    }
  };

  const handleSwitchWorkspace = async (workspace) => {
    if (workspace.Id === currentWorkspace?.Id) {
      return;
    }

    try {
      await switchWorkspace(workspace.Id);
    } catch (error) {
      // Error handling done in context
    }
  };

  const openEditModal = (workspace) => {
    setSelectedWorkspace(workspace);
    setFormData({
      name: workspace.name,
      description: workspace.description,
      tier: workspace.tier,
      region: workspace.region
    });
    setShowEditModal(true);
  };

  const getTierBadgeVariant = (tier) => {
    switch (tier) {
      case 'enterprise': return 'primary';
      case 'pro': return 'secondary';
      case 'free': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'suspended': return 'danger';
      default: return 'outline';
    }
  };

  const formatUsage = (current, quota) => {
    const percentage = Math.round((current / quota) * 100);
    return { percentage, current: current.toLocaleString(), quota: quota.toLocaleString() };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surface-50">Workspaces</h1>
          <p className="text-surface-400 mt-1">
            Manage your workspaces and switch between environments
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Create Workspace
        </Button>
      </div>

      {/* Current Workspace Info */}
      {currentWorkspace && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Briefcase" size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-surface-50">Current Workspace</h3>
                <p className="text-surface-400 text-sm">{currentWorkspace.name}</p>
              </div>
            </div>
            <Badge variant={getTierBadgeVariant(currentWorkspace.tier)} className="capitalize">
              {currentWorkspace.tier}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 bg-surface-800/50 rounded-lg border border-surface-600">
              <div className="flex items-center justify-between">
                <span className="text-sm text-surface-400">Usage</span>
                <span className="text-lg font-semibold text-surface-50">
                  {formatUsage(currentWorkspace.currentUsage, currentWorkspace.usageQuota).percentage}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-surface-800/50 rounded-lg border border-surface-600">
              <div className="flex items-center justify-between">
                <span className="text-sm text-surface-400">Team</span>
                <span className="text-lg font-semibold text-surface-50">{currentWorkspace.teamMembers}</span>
              </div>
            </div>
            <div className="p-3 bg-surface-800/50 rounded-lg border border-surface-600">
              <div className="flex items-center justify-between">
                <span className="text-sm text-surface-400">API Keys</span>
                <span className="text-lg font-semibold text-surface-50">{currentWorkspace.apiKeys}</span>
              </div>
            </div>
            <div className="p-3 bg-surface-800/50 rounded-lg border border-surface-600">
              <div className="flex items-center justify-between">
                <span className="text-sm text-surface-400">Region</span>
                <span className="text-lg font-semibold text-surface-50">{currentWorkspace.region}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search workspaces..."
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={tierOptions}
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Workspaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkspaces.map((workspace) => {
          const usage = formatUsage(workspace.currentUsage, workspace.usageQuota);
          const isActive = workspace.Id === currentWorkspace?.Id;

          return (
            <motion.div
              key={workspace.Id}
              whileHover={{ scale: 1.02 }}
              className={`relative ${isActive ? 'ring-2 ring-primary-500' : ''}`}
            >
              <Card className={`p-6 h-full ${isActive ? 'bg-primary-500/10 border-primary-500/30' : ''}`}>
                {isActive && (
                  <div className="absolute -top-2 -right-2">
                    <Badge variant="success" size="sm">
                      <ApperIcon name="Check" size={12} className="mr-1" />
                      Current
                    </Badge>
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Briefcase" size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-surface-50 truncate">{workspace.name}</h3>
                      <p className="text-sm text-surface-400 truncate">{workspace.description}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <Badge variant={getTierBadgeVariant(workspace.tier)} size="sm" className="capitalize">
                      {workspace.tier}
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(workspace.status)} size="sm" className="capitalize">
                      {workspace.status}
                    </Badge>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-surface-400">Usage</span>
                      <span className="text-surface-200">{usage.percentage}%</span>
                    </div>
                    <div className="w-full bg-surface-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${usage.percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-surface-500 mt-1">
                      <span>{usage.current}</span>
                      <span>{usage.quota}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Users" size={14} className="text-surface-400" />
                      <span className="text-surface-300">{workspace.teamMembers}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Key" size={14} className="text-surface-400" />
                      <span className="text-surface-300">{workspace.apiKeys}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {!isActive && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSwitchWorkspace(workspace)}
                      className="flex-1"
                    >
                      <ApperIcon name="ArrowRightCircle" size={14} className="mr-2" />
                      Switch
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(workspace)}
                    className={isActive ? 'flex-1' : ''}
                  >
                    <ApperIcon name="Edit" size={14} className={!isActive ? 'mr-2' : ''} />
                    {isActive ? 'Edit' : ''}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteWorkspace(workspace)}
                    disabled={workspaces.length === 1}
                  >
                    <ApperIcon name="Trash2" size={14} />
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredWorkspaces.length === 0 && (
        <Card className="p-12 text-center">
          <ApperIcon name="Search" size={48} className="mx-auto text-surface-600 mb-4" />
          <h3 className="text-lg font-semibold text-surface-300 mb-2">No workspaces found</h3>
          <p className="text-surface-400 mb-4">
            {searchTerm || filterTier !== "all" 
              ? "Try adjusting your search or filter criteria"
              : "Create your first workspace to get started"
            }
          </p>
          {(!searchTerm && filterTier === "all") && (
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Create Workspace
            </Button>
          )}
        </Card>
      )}

      {/* Create Workspace Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-800 rounded-lg p-6 w-full max-w-md border border-surface-600"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-surface-50">Create Workspace</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="text-surface-400 hover:text-surface-200 transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Workspace Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="My Workspace"
                required
              />
              <div>
                <label className="block text-sm font-medium text-surface-200 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Workspace description..."
                  className="w-full px-3 py-2 bg-surface-800 border border-surface-600 rounded-lg text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <Select
                label="Tier"
                options={[
                  { value: "free", label: "Free Tier" },
                  { value: "pro", label: "Pro Tier" },
                  { value: "enterprise", label: "Enterprise" }
                ]}
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
              />
              <Select
                label="Region"
                options={regionOptions}
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              />
            </div>

            <div className="flex space-x-3 mt-6">
              <Button variant="primary" onClick={handleCreateWorkspace} className="flex-1">
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Create
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Workspace Modal */}
      {showEditModal && selectedWorkspace && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-800 rounded-lg p-6 w-full max-w-md border border-surface-600"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-surface-50">Edit Workspace</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedWorkspace(null);
                  resetForm();
                }}
                className="text-surface-400 hover:text-surface-200 transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Workspace Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="My Workspace"
                required
              />
              <div>
                <label className="block text-sm font-medium text-surface-200 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Workspace description..."
                  className="w-full px-3 py-2 bg-surface-800 border border-surface-600 rounded-lg text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <Select
                label="Tier"
                options={[
                  { value: "free", label: "Free Tier" },
                  { value: "pro", label: "Pro Tier" },
                  { value: "enterprise", label: "Enterprise" }
                ]}
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
              />
              <Select
                label="Region"
                options={regionOptions}
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              />
            </div>

            <div className="flex space-x-3 mt-6">
              <Button variant="primary" onClick={handleEditWorkspace} className="flex-1">
                <ApperIcon name="Save" size={16} className="mr-2" />
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedWorkspace(null);
                  resetForm();
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Workspaces;