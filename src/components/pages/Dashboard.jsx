import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import LLMProviderMonitor from "@/components/organisms/LLMProviderMonitor";
import { dashboardService } from "@/services/api/dashboardService";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await dashboardService.getDashboardData();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return <Loading variant="dashboard" />;
  }

  if (error) {
    return <Error onRetry={loadDashboardData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-surface-50">Dashboard</h1>
          <p className="text-surface-400 mt-1">Monitor your AI token optimization platform</p>
        </div>
        <Link to="/projects">
          <Button variant="primary">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          value={data?.totalProjects || 0}
          change="+12%"
          icon="FolderOpen"
          color="primary"
          trend="up"
        />
        <StatCard
          title="API Calls Today"
          value={data?.apiCallsToday?.toLocaleString() || 0}
          change="+8.5%"
          icon="Activity"
          color="success"
          trend="up"
        />
        <StatCard
          title="Cost Savings"
          value={`$${data?.costSavings?.toFixed(2) || 0}`}
          change="+15.2%"
          icon="TrendingDown"
          color="warning"
          trend="up"
        />
        <StatCard
          title="Avg Response Time"
          value={`${data?.avgResponseTime || 0}ms`}
          change="-5ms"
          icon="Clock"
          color="secondary"
          trend="down"
        />
      </div>

{/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LLM Provider Monitor */}
        <LLMProviderMonitor />
        {/* Cost Breakdown */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-50">Cost Breakdown</h3>
            <Button variant="ghost" size="sm">
              <ApperIcon name="MoreHorizontal" size={16} />
            </Button>
          </div>
          <div className="space-y-4">
            {data?.costBreakdown?.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-surface-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                  <span className="text-surface-200">{item.provider}</span>
                </div>
                <div className="text-right">
                  <p className="font-medium text-surface-50">${item.cost.toFixed(2)}</p>
                  <p className="text-sm text-surface-400">{item.percentage}%</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-surface-50">Recent Projects</h3>
          <Link to="/projects">
            <Button variant="outline" size="sm">
              View All
              <ApperIcon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-700">
                <th className="text-left p-3 text-sm font-medium text-surface-400">Project</th>
                <th className="text-left p-3 text-sm font-medium text-surface-400">Status</th>
                <th className="text-left p-3 text-sm font-medium text-surface-400">Requests</th>
                <th className="text-left p-3 text-sm font-medium text-surface-400">Cost</th>
                <th className="text-left p-3 text-sm font-medium text-surface-400">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentProjects?.map((project, index) => (
                <motion.tr
                  key={project.Id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-surface-700 hover:bg-surface-700/50 transition-colors"
                >
                  <td className="p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                        <ApperIcon name="FolderOpen" size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-surface-200">{project.name}</p>
                        <p className="text-sm text-surface-400">{project.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === "active" 
                        ? "bg-accent-500/20 text-accent-400" 
                        : "bg-surface-600 text-surface-300"
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-surface-200">{project.monthlyRequests?.toLocaleString()}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-accent-400 font-medium">${project.monthlyCost?.toFixed(2)}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-surface-400 text-sm">
                      {new Date(project.lastActive).toLocaleDateString()}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;