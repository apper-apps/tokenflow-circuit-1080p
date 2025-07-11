import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import StatCard from '@/components/molecules/StatCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import LLMProviderMonitor from '@/components/organisms/LLMProviderMonitor'
import { dashboardService } from '@/services/api/dashboardService'

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await dashboardService.getDashboardData();
      setDashboardData(result);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      console.error('Dashboard data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ApperIcon className="w-8 h-8" />
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Link to="/settings">Settings</Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardData?.stats?.map((stat, index) => (
          <StatCard
            key={stat.id || index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={stat.icon}
          />
        )) || (
          <>
            <StatCard title="Total Projects" value="0" />
            <StatCard title="API Calls" value="0" />
            <StatCard title="Success Rate" value="0%" />
            <StatCard title="Avg Response Time" value="0ms" />
          </>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {dashboardData?.recentActivity?.length > 0 ? (
              dashboardData.recentActivity.map((activity, index) => (
                <div key={activity.id || index} className="flex items-center justify-between p-3 bg-surface-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-white">{activity.title}</p>
                      <p className="text-xs text-surface-400">{activity.description}</p>
                    </div>
                  </div>
                  <span className="text-xs text-surface-400">{activity.timestamp}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-surface-400">
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
              <Link to="/projects" className="flex flex-col items-center space-y-2">
                <span className="text-2xl">📁</span>
                <span className="text-sm">New Project</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
              <Link to="/api-keys" className="flex flex-col items-center space-y-2">
                <span className="text-2xl">🔑</span>
                <span className="text-sm">API Keys</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
              <Link to="/routing-rules" className="flex flex-col items-center space-y-2">
                <span className="text-2xl">🔀</span>
                <span className="text-sm">Routing Rules</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
              <Link to="/analytics" className="flex flex-col items-center space-y-2">
                <span className="text-2xl">📊</span>
                <span className="text-sm">Analytics</span>
              </Link>
            </Button>
          </div>
        </Card>
      </div>

      {/* LLM Provider Monitor */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">LLM Provider Status</h3>
          <LLMProviderMonitor />
        </Card>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h4 className="text-sm font-medium text-surface-400 mb-2">System Status</h4>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent-500 rounded-full"></div>
            <span className="text-sm font-medium text-white">Operational</span>
          </div>
        </Card>
        <Card className="p-6">
          <h4 className="text-sm font-medium text-surface-400 mb-2">API Status</h4>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent-500 rounded-full"></div>
            <span className="text-sm font-medium text-white">All Systems Go</span>
          </div>
        </Card>
        <Card className="p-6">
          <h4 className="text-sm font-medium text-surface-400 mb-2">Last Update</h4>
          <span className="text-sm font-medium text-white">
            {new Date().toLocaleString()}
          </span>
        </Card>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-between items-center pt-6 border-t border-surface-700">
        <div className="flex space-x-4">
          <Button variant="ghost" size="sm">
            <Link to="/team">Team</Link>
          </Button>
          <Button variant="ghost" size="sm">
            <Link to="/settings">Settings</Link>
          </Button>
        </div>
        <Button onClick={loadDashboardData} variant="outline" size="sm">
          Refresh
        </Button>
      </div>
    </motion.div>
  );
}

export default Dashboard;