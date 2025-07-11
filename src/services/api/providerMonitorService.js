import mockData from "@/services/mockData/providerMonitor.json";

// Simulate real-time provider status updates
const generateLatencyData = (baseLatency, variance = 50) => {
  const data = [];
  for (let i = 0; i < 20; i++) {
    const value = baseLatency + (Math.random() - 0.5) * variance;
    data.push(Math.max(10, Math.round(value)));
  }
  return data;
};

const updateProviderStatus = (provider) => {
  // Simulate status changes (95% chance of staying the same)
  if (Math.random() < 0.05) {
    const statuses = ['online', 'degraded', 'offline'];
    const currentIndex = statuses.indexOf(provider.status);
    const newStatuses = statuses.filter((_, i) => i !== currentIndex);
    provider.status = newStatuses[Math.floor(Math.random() * newStatuses.length)];
  }

  // Update latency based on status
  let baseLatency;
  switch (provider.status) {
    case 'online':
      baseLatency = provider.baseLatency || 120;
      break;
    case 'degraded':
      baseLatency = (provider.baseLatency || 120) * 1.5;
      break;
    case 'offline':
      baseLatency = 0;
      break;
    default:
      baseLatency = provider.baseLatency || 120;
  }

  // Generate new latency value
  const variance = 30;
  const newLatency = provider.status === 'offline' ? 0 : 
    Math.max(10, Math.round(baseLatency + (Math.random() - 0.5) * variance));

  // Update current latency
  provider.latency = newLatency;

  // Update latency history (keep last 20 points)
  provider.latencyHistory = provider.latencyHistory || generateLatencyData(baseLatency);
  provider.latencyHistory.shift();
  provider.latencyHistory.push(newLatency);

  // Calculate metrics
  const validLatencies = provider.latencyHistory.filter(l => l > 0);
  provider.avgLatency = validLatencies.length > 0 ? 
    Math.round(validLatencies.reduce((sum, l) => sum + l, 0) / validLatencies.length) : 0;
  provider.minLatency = validLatencies.length > 0 ? Math.min(...validLatencies) : 0;
  provider.maxLatency = validLatencies.length > 0 ? Math.max(...validLatencies) : 0;

  // Update availability (simulate 99.5% uptime for online, lower for others)
  if (provider.status === 'online') {
    provider.availability = Math.min(100, (provider.availability || 99.5) + Math.random() * 0.1 - 0.05);
  } else if (provider.status === 'degraded') {
    provider.availability = Math.max(90, (provider.availability || 95) - Math.random() * 0.2);
  } else {
    provider.availability = Math.max(0, (provider.availability || 50) - Math.random() * 1);
  }
  
  provider.availability = Math.round(provider.availability * 10) / 10;

  return provider;
};

export const providerMonitorService = {
  async getProviderStatus() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Clone and update mock data
    const providers = JSON.parse(JSON.stringify(mockData));
    
    // Update each provider with real-time data
    return providers.map(provider => {
      // Store base latency for consistent variations
      if (!provider.baseLatency) {
        provider.baseLatency = provider.latency;
      }
      
      // Initialize latency history if not exists
      if (!provider.latencyHistory) {
        provider.latencyHistory = generateLatencyData(provider.baseLatency);
      }
      
      return updateProviderStatus(provider);
    });
  },

  async getProviderHistory(providerName, hours = 24) {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Generate historical data for the specified time period
    const dataPoints = hours * 6; // 6 points per hour (10-minute intervals)
    const now = new Date();
    const history = [];
    
    const provider = mockData.find(p => p.name === providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`);
    }
    
    const baseLatency = provider.baseLatency || provider.latency;
    
    for (let i = dataPoints; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 10 * 60 * 1000);
      const latency = Math.max(10, Math.round(baseLatency + (Math.random() - 0.5) * 50));
      
      history.push({
        timestamp: timestamp.toISOString(),
        latency,
        status: Math.random() > 0.95 ? 'degraded' : 'online'
      });
    }
    
    return history;
  },

  async getProviderMetrics(providerName) {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const provider = mockData.find(p => p.name === providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`);
    }
    
    return {
      name: provider.name,
      uptime: provider.availability || 99.5,
      totalRequests: Math.floor(Math.random() * 100000) + 50000,
      successRate: Math.random() * 5 + 95, // 95-100%
      errorRate: Math.random() * 5, // 0-5%
      avgLatency: provider.latency || 120,
      p95Latency: (provider.latency || 120) * 1.5,
      p99Latency: (provider.latency || 120) * 2
    };
  }
};