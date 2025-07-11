import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { providerMonitorService } from "@/services/api/providerMonitorService";
import { toast } from "react-toastify";
import Chart from "react-apexcharts";

const LLMProviderMonitor = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const loadProviderData = async () => {
    try {
      const data = await providerMonitorService.getProviderStatus();
      setProviders(data);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load provider status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviderData();
    
    // Real-time updates every 10 seconds
    const interval = setInterval(async () => {
      try {
        const data = await providerMonitorService.getProviderStatus();
        
        // Check for status changes and notify
        providers.forEach((prevProvider, index) => {
          const newProvider = data[index];
          if (prevProvider.status !== newProvider.status) {
            const statusText = newProvider.status === 'online' ? 'Online' : 'Offline';
            toast.info(`${newProvider.name} is now ${statusText}`);
          }
        });
        
        setProviders(data);
        setLastUpdate(new Date());
      } catch (err) {
        console.error('Failed to update provider status:', err);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [providers]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-accent-400';
      case 'degraded': return 'text-yellow-400';
      case 'offline': return 'text-red-400';
      default: return 'text-surface-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return 'CheckCircle';
      case 'degraded': return 'AlertTriangle';
      case 'offline': return 'XCircle';
      default: return 'Clock';
    }
  };

  const getChartOptions = (provider) => ({
    chart: {
      type: 'line',
      height: 120,
      sparkline: {
        enabled: true
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      },
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      colors: [provider.status === 'online' ? '#10b981' : provider.status === 'degraded' ? '#f59e0b' : '#ef4444']
    },
    grid: {
      show: false
    },
    xaxis: {
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        show: false
      }
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif'
      },
      y: {
        formatter: (value) => `${value}ms`
      }
    },
    markers: {
      size: 0,
      hover: {
        size: 4
      }
    }
  });

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-surface-50">LLM Provider Status</h3>
          <div className="animate-pulse">
            <div className="w-4 h-4 bg-surface-600 rounded-full"></div>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center justify-between p-4 bg-surface-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-surface-600 rounded-full"></div>
                  <div className="w-20 h-4 bg-surface-600 rounded"></div>
                </div>
                <div className="w-16 h-4 bg-surface-600 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-surface-50">LLM Provider Status</h3>
          <Button variant="ghost" size="sm" onClick={loadProviderData}>
            <ApperIcon name="RefreshCw" size={16} />
          </Button>
        </div>
        <div className="text-center py-8">
          <ApperIcon name="AlertCircle" size={48} className="text-red-400 mx-auto mb-4" />
          <p className="text-surface-400 mb-4">Failed to load provider status</p>
          <Button variant="outline" onClick={loadProviderData}>
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-surface-50">LLM Provider Status</h3>
          {lastUpdate && (
            <p className="text-sm text-surface-400 mt-1">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-surface-400">Live</span>
          </div>
          <Button variant="ghost" size="sm" onClick={loadProviderData}>
            <ApperIcon name="RefreshCw" size={16} />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {providers.map((provider, index) => (
          <motion.div
            key={provider.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface-700 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <ApperIcon 
                  name={getStatusIcon(provider.status)} 
                  size={16} 
                  className={getStatusColor(provider.status)}
                />
                <div>
                  <h4 className="font-medium text-surface-50">{provider.name}</h4>
                  <p className="text-sm text-surface-400 capitalize">{provider.status}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-surface-200">{provider.latency}ms</p>
                    <p className="text-xs text-surface-400">Current</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-accent-400">{provider.availability}%</p>
                    <p className="text-xs text-surface-400">Uptime</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Latency Chart */}
            <div className="h-20">
              <Chart
                options={getChartOptions(provider)}
                series={[{
                  name: 'Latency',
                  data: provider.latencyHistory
                }]}
                type="line"
                height={80}
              />
            </div>

            {/* Provider Details */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-600">
              <div className="flex items-center space-x-4 text-xs text-surface-400">
                <span>Avg: {provider.avgLatency}ms</span>
                <span>Min: {provider.minLatency}ms</span>
                <span>Max: {provider.maxLatency}ms</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  provider.status === 'online' ? 'bg-accent-500' :
                  provider.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-xs text-surface-400">
                  {provider.status === 'online' ? 'Operational' :
                   provider.status === 'degraded' ? 'Degraded Performance' : 'Service Unavailable'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-surface-600">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-lg font-semibold text-accent-400">
              {providers.filter(p => p.status === 'online').length}
            </p>
            <p className="text-xs text-surface-400">Online</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-yellow-400">
              {providers.filter(p => p.status === 'degraded').length}
            </p>
            <p className="text-xs text-surface-400">Degraded</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-red-400">
              {providers.filter(p => p.status === 'offline').length}
            </p>
            <p className="text-xs text-surface-400">Offline</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-surface-200">
              {Math.round(providers.reduce((sum, p) => sum + p.latency, 0) / providers.length)}ms
            </p>
            <p className="text-xs text-surface-400">Avg Latency</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LLMProviderMonitor;