import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Settings from "@/components/pages/Settings";
import StatCard from "@/components/molecules/StatCard";
import StatusIndicator from "@/components/molecules/StatusIndicator";
import { projectService } from "@/services/api/projectService";
import { analyticsService } from "@/services/api/analyticsService";

const ProjectDetail = () => {
  const { id } = useParams();
const [project, setProject] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forecastData, setForecastData] = useState(null);

const loadProject = async () => {
    try {
      setLoading(true);
      setError(null);
      const [projectResult, analyticsResult] = await Promise.all([
        projectService.getById(parseInt(id)),
        analyticsService.getAll()
      ]);
      setProject(projectResult);
      setAnalytics(analyticsResult);
      
      // Calculate forecast data
      const forecast = calculateCostForecast(projectResult, analyticsResult);
      setForecastData(forecast);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateCostForecast = (project, analytics) => {
    if (!project || !analytics) return null;

    const currentMonthlyCost = project.monthlyCost || 0;
    const currentMonthlyRequests = project.monthlyRequests || 0;
    const thirtyDayData = analytics["30d"];
    
    // Calculate cost per request
    const costPerRequest = currentMonthlyCost / Math.max(currentMonthlyRequests, 1);
    
    // Calculate growth trends from analytics
    const sevenDayData = analytics["7d"];
    const weeklyGrowthRate = sevenDayData.totalRequests / (thirtyDayData.totalRequests / 4.3);
    const monthlyGrowthRate = Math.max(0.95, Math.min(1.3, weeklyGrowthRate)); // Cap between -5% and +30%
    
    // Forecast calculations
    const forecasts = {
      thirtyDay: {
        requests: Math.round(currentMonthlyRequests * monthlyGrowthRate),
        cost: currentMonthlyCost * monthlyGrowthRate,
        savings: thirtyDayData.costSavings * monthlyGrowthRate,
        trend: monthlyGrowthRate > 1.05 ? 'increasing' : monthlyGrowthRate < 0.95 ? 'decreasing' : 'stable'
      },
      ninetyDay: {
        requests: Math.round(currentMonthlyRequests * Math.pow(monthlyGrowthRate, 3)),
        cost: currentMonthlyCost * Math.pow(monthlyGrowthRate, 3),
        savings: thirtyDayData.costSavings * Math.pow(monthlyGrowthRate, 3) * 3,
        trend: monthlyGrowthRate > 1.05 ? 'increasing' : monthlyGrowthRate < 0.95 ? 'decreasing' : 'stable'
      },
      yearly: {
        requests: Math.round(currentMonthlyRequests * Math.pow(monthlyGrowthRate, 12)),
        cost: currentMonthlyCost * Math.pow(monthlyGrowthRate, 12),
        savings: thirtyDayData.costSavings * Math.pow(monthlyGrowthRate, 12) * 12,
        trend: monthlyGrowthRate > 1.05 ? 'increasing' : monthlyGrowthRate < 0.95 ? 'decreasing' : 'stable'
      }
    };

    // Calculate overspending risk
    const budgetThreshold = currentMonthlyCost * 1.5; // 50% over current
    const overspendingRisk = {
      thirtyDay: forecasts.thirtyDay.cost > budgetThreshold,
      ninetyDay: forecasts.ninetyDay.cost > budgetThreshold * 3,
      yearly: forecasts.yearly.cost > budgetThreshold * 12
    };

    return { ...forecasts, overspendingRisk, budgetThreshold };
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

    {/* Cost Forecasting Section */}
    {forecastData && (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-surface-50">Cost Forecasting</h3>
            <p className="text-sm text-surface-400 mt-1">
              Predictions based on historical usage patterns and trends
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="TrendingUp" size={20} className="text-primary-400" />
            <span className="text-sm text-surface-400">AI-Powered</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface-700 p-4 rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-surface-400">30-Day Forecast</span>
              {forecastData.overspendingRisk.thirtyDay && (
                <Badge variant="danger" size="sm">Risk</Badge>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-surface-400">Requests</span>
                <span className="text-sm font-medium text-surface-200">
                  {forecastData.thirtyDay.requests.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-surface-400">Cost</span>
                <span className="text-sm font-medium text-surface-200">
                  ${forecastData.thirtyDay.cost.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-surface-400">Savings</span>
                <span className="text-sm font-medium text-accent-400">
                  ${forecastData.thirtyDay.savings.toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface-700 p-4 rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-surface-400">90-Day Forecast</span>
              {forecastData.overspendingRisk.ninetyDay && (
                <Badge variant="danger" size="sm">Risk</Badge>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-surface-400">Requests</span>
                <span className="text-sm font-medium text-surface-200">
                  {forecastData.ninetyDay.requests.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-surface-400">Cost</span>
                <span className="text-sm font-medium text-surface-200">
                  ${forecastData.ninetyDay.cost.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-surface-400">Savings</span>
                <span className="text-sm font-medium text-accent-400">
                  ${forecastData.ninetyDay.savings.toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-surface-700 p-4 rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-surface-400">Yearly Forecast</span>
              {forecastData.overspendingRisk.yearly && (
                <Badge variant="danger" size="sm">Risk</Badge>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-surface-400">Requests</span>
                <span className="text-sm font-medium text-surface-200">
                  {forecastData.yearly.requests.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-surface-400">Cost</span>
                <span className="text-sm font-medium text-surface-200">
                  ${forecastData.yearly.cost.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-surface-400">Savings</span>
                <span className="text-sm font-medium text-accent-400">
                  ${forecastData.yearly.savings.toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Overspending Alerts */}
        {(forecastData.overspendingRisk.thirtyDay || forecastData.overspendingRisk.ninetyDay || forecastData.overspendingRisk.yearly) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg mb-4"
          >
            <div className="flex items-center space-x-3">
              <ApperIcon name="AlertTriangle" size={20} className="text-red-400" />
              <div>
                <h4 className="font-medium text-red-300">Overspending Alert</h4>
                <p className="text-sm text-red-400 mt-1">
                  Forecasted costs exceed budget thresholds. Consider optimizing routing rules or setting spending limits.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recommendations */}
        <div className="bg-surface-700 p-4 rounded-lg">
          <h4 className="font-medium text-surface-200 mb-3">Cost Optimization Recommendations</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <ApperIcon name="CheckCircle" size={16} className="text-accent-400" />
              <span className="text-sm text-surface-300">
                Enable cost-based routing to reduce expenses by up to 25%
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <ApperIcon name="CheckCircle" size={16} className="text-accent-400" />
              <span className="text-sm text-surface-300">
                Set up spending alerts at 80% of monthly budget
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <ApperIcon name="CheckCircle" size={16} className="text-accent-400" />
              <span className="text-sm text-surface-300">
                Review provider performance to optimize cost-efficiency ratio
              </span>
            </div>
            {analytics && analytics["30d"] && (
              <div className="flex items-center space-x-3">
                <ApperIcon name="CheckCircle" size={16} className="text-accent-400" />
                <span className="text-sm text-surface-300">
                  Current optimization is saving ${analytics["30d"].costSavings.toFixed(2)} monthly
                </span>
              </div>
            )}
</div>
        </div>
      </Card>
    )}

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