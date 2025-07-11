import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { analyticsService } from "@/services/api/analyticsService";

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("7d");

  const timeRangeOptions = [
    { value: "24h", label: "Last 24 Hours" },
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "90d", label: "Last 90 Days" }
  ];

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await analyticsService.getAnalytics(timeRange);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  if (loading) {
    return <Loading variant="dashboard" />;
  }

  if (error) {
    return <Error onRetry={loadAnalytics} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-surface-50">Analytics</h1>
          <p className="text-surface-400 mt-1">
            Insights into your token usage, costs, and optimization performance
          </p>
        </div>
        <div className="flex space-x-3">
          <Select
            options={timeRangeOptions}
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          />
          <Button variant="outline" size="sm">
            <ApperIcon name="Download" size={16} className="mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Requests"
          value={data?.totalRequests?.toLocaleString() || 0}
          change="+12.5%"
          icon="Activity"
          color="primary"
          trend="up"
        />
        <StatCard
          title="Total Cost"
          value={`$${data?.totalCost?.toFixed(2) || 0}`}
          change="+8.2%"
          icon="DollarSign"
          color="warning"
          trend="up"
        />
        <StatCard
          title="Cost Savings"
          value={`$${data?.costSavings?.toFixed(2) || 0}`}
          change="+18.7%"
          icon="TrendingDown"
          color="success"
          trend="up"
        />
        <StatCard
          title="Avg Response Time"
          value={`${data?.avgResponseTime || 0}ms`}
          change="-12ms"
          icon="Clock"
          color="secondary"
          trend="down"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Over Time */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-50">Usage Over Time</h3>
            <Button variant="ghost" size="sm">
              <ApperIcon name="MoreHorizontal" size={16} />
            </Button>
          </div>
          <div className="h-64 bg-surface-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ApperIcon name="BarChart3" size={48} className="text-surface-500 mx-auto mb-2" />
              <p className="text-surface-400">Usage chart will be displayed here</p>
            </div>
          </div>
        </Card>

        {/* Cost Breakdown */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-50">Cost by Provider</h3>
            <Button variant="ghost" size="sm">
              <ApperIcon name="MoreHorizontal" size={16} />
            </Button>
          </div>
          <div className="h-64 bg-surface-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ApperIcon name="PieChart" size={48} className="text-surface-500 mx-auto mb-2" />
              <p className="text-surface-400">Cost breakdown chart will be displayed here</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Provider Performance */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-surface-50 mb-6">Provider Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-700">
                <th className="text-left p-3 text-sm font-medium text-surface-400">Provider</th>
                <th className="text-left p-3 text-sm font-medium text-surface-400">Requests</th>
                <th className="text-left p-3 text-sm font-medium text-surface-400">Success Rate</th>
                <th className="text-left p-3 text-sm font-medium text-surface-400">Avg Latency</th>
                <th className="text-left p-3 text-sm font-medium text-surface-400">Cost</th>
                <th className="text-left p-3 text-sm font-medium text-surface-400">Cost/1K Tokens</th>
              </tr>
            </thead>
            <tbody>
              {data?.providerPerformance?.map((provider, index) => (
                <motion.tr
                  key={provider.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-surface-700 hover:bg-surface-700/50 transition-colors"
                >
                  <td className="p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Brain" size={16} className="text-white" />
                      </div>
                      <span className="font-medium text-surface-200">{provider.name}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="text-surface-200">{provider.requests?.toLocaleString()}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      provider.successRate >= 99 
                        ? "bg-accent-500/20 text-accent-400" 
                        : provider.successRate >= 95
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      {provider.successRate}%
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-surface-200">{provider.avgLatency}ms</span>
                  </td>
                  <td className="p-3">
                    <span className="text-accent-400 font-medium">${provider.cost?.toFixed(2)}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-surface-200">${provider.costPer1K?.toFixed(4)}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Optimization Impact */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-surface-50 mb-6">Optimization Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="TrendingDown" size={24} className="text-white" />
            </div>
            <h4 className="text-2xl font-bold text-surface-50 mb-2">
              {data?.optimization?.costReduction || 0}%
            </h4>
            <p className="text-surface-400">Cost Reduction</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Zap" size={24} className="text-white" />
            </div>
            <h4 className="text-2xl font-bold text-surface-50 mb-2">
              {data?.optimization?.speedImprovement || 0}%
            </h4>
            <p className="text-surface-400">Speed Improvement</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Shield" size={24} className="text-white" />
            </div>
            <h4 className="text-2xl font-bold text-surface-50 mb-2">
              {data?.optimization?.reliabilityImprovement || 0}%
            </h4>
            <p className="text-surface-400">Reliability Improvement</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;