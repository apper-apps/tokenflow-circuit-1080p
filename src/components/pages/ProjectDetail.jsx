import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import StatCard from "@/components/molecules/StatCard";
import StatusIndicator from "@/components/molecules/StatusIndicator";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { projectService } from "@/services/api/projectService";

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProject = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await projectService.getById(parseInt(id));
      setProject(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  if (loading) {
    return <Loading variant="dashboard" />;
  }

  if (error) {
    return <Error onRetry={loadProject} />;
  }

  if (!project) {
    return <Error title="Project not found" message="The project you're looking for doesn't exist." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/projects">
            <Button variant="ghost" size="sm">
              <ApperIcon name="ArrowLeft" size={16} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-surface-50">{project.name}</h1>
            <p className="text-surface-400 mt-1">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <StatusIndicator status={project.status} />
          <Button variant="outline" size="sm">
            <ApperIcon name="Settings" size={16} className="mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="API Keys"
          value={project.apiKeys?.length || 0}
          icon="Key"
          color="primary"
        />
        <StatCard
          title="Routing Rules"
          value={project.routingRules?.length || 0}
          icon="GitBranch"
          color="secondary"
        />
        <StatCard
          title="Monthly Requests"
          value={project.monthlyRequests?.toLocaleString() || 0}
          change="+12%"
          icon="Activity"
          color="success"
          trend="up"
        />
        <StatCard
          title="Monthly Cost"
          value={`$${project.monthlyCost?.toFixed(2) || 0}`}
          change="-8%"
          icon="DollarSign"
          color="warning"
          trend="down"
        />
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* API Keys */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-surface-50">API Keys</h3>
            <Button variant="outline" size="sm">
              <ApperIcon name="Plus" size={16} />
            </Button>
          </div>
          <div className="space-y-3">
            {project.apiKeys?.map((key, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-surface-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Key" size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-surface-200">{key.provider}</p>
                    <p className="text-sm text-surface-400">{key.name}</p>
                  </div>
                </div>
                <StatusIndicator status={key.status} showIcon={false} />
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Routing Rules */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-surface-50">Routing Rules</h3>
            <Button variant="outline" size="sm">
              <ApperIcon name="Plus" size={16} />
            </Button>
          </div>
          <div className="space-y-3">
            {project.routingRules?.map((rule, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-surface-700 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-surface-200">{rule.name}</p>
                  <Badge variant="outline" size="sm">{rule.priority}</Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-surface-400">
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Target" size={14} />
                    <span>{rule.targetProvider}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Shield" size={14} />
                    <span>{rule.fallbackProviders?.length || 0} fallbacks</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Optimization Settings */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-surface-50">Optimization</h3>
            <Button variant="outline" size="sm">
              <ApperIcon name="Settings" size={16} />
            </Button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-surface-400">Cost Optimization</span>
              <Badge variant="success" size="sm">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-surface-400">Fallback Routing</span>
              <Badge variant="success" size="sm">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-surface-400">Caching</span>
              <Badge variant="warning" size="sm">Disabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-surface-400">Load Balancing</span>
              <Badge variant="success" size="sm">Enabled</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-surface-50 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {project.recentActivity?.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4 p-3 bg-surface-700 rounded-lg"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
                <ApperIcon name="Activity" size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-surface-200">{activity.description}</p>
                <p className="text-sm text-surface-400">{activity.timestamp}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ProjectDetail;