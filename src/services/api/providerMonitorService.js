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
      baseLatency = provider.base_latency || provider.baseLatency || 120;
      break;
    case 'degraded':
      baseLatency = (provider.base_latency || provider.baseLatency || 120) * 1.5;
      break;
    case 'offline':
      baseLatency = 0;
      break;
    default:
      baseLatency = provider.base_latency || provider.baseLatency || 120;
  }

  // Generate new latency value
  const variance = 30;
  const newLatency = provider.status === 'offline' ? 0 : 
    Math.max(10, Math.round(baseLatency + (Math.random() - 0.5) * variance));

  // Update current latency
  provider.latency = newLatency;

  // Update latency history (keep last 20 points)
  provider.latency_history = provider.latency_history || generateLatencyData(baseLatency);
  if (Array.isArray(provider.latency_history)) {
    provider.latency_history.shift();
    provider.latency_history.push(newLatency);
  }

  // Calculate metrics
  const validLatencies = (provider.latency_history || []).filter(l => l > 0);
  provider.avg_latency = validLatencies.length > 0 ? 
    Math.round(validLatencies.reduce((sum, l) => sum + l, 0) / validLatencies.length) : 0;
  provider.min_latency = validLatencies.length > 0 ? Math.min(...validLatencies) : 0;
  provider.max_latency = validLatencies.length > 0 ? Math.max(...validLatencies) : 0;

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
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "status" } },
          { field: { Name: "latency" } },
          { field: { Name: "availability" } },
          { field: { Name: "base_latency" } },
          { field: { Name: "avg_latency" } },
          { field: { Name: "min_latency" } },
          { field: { Name: "max_latency" } },
          { field: { Name: "latency_history" } },
          { field: { Name: "region" } },
          { field: { Name: "endpoint" } }
        ]
      };

      const response = await apperClient.fetchRecords('provider_monitor', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const providers = response.data || [];
      
      // Process and update each provider with real-time simulation
return providers.map(provider => {
        // Convert database fields to match component expectations (camelCase)
        let latencyHistory = [];
        try {
          latencyHistory = JSON.parse(provider.latency_history || '[]');
        } catch (error) {
          console.error('Error parsing latency_history for provider:', provider.Name, error);
          latencyHistory = [];
        }
        
        const processedProvider = {
          name: provider.Name,
          status: provider.status,
          latency: provider.latency,
          availability: provider.availability,
          baseLatency: provider.base_latency,
          avgLatency: provider.avg_latency,
          minLatency: provider.min_latency,
          maxLatency: provider.max_latency,
          latencyHistory: latencyHistory,
          region: provider.region,
          endpoint: provider.endpoint
        };

        return updateProviderStatus(processedProvider);
      });
    } catch (error) {
      console.error("Error fetching provider status:", error);
      // Return default providers for development
      return [
        {
          name: "OpenAI",
          status: "online",
          latency: 120,
          availability: 99.8,
          base_latency: 120,
          avg_latency: 118,
          min_latency: 85,
          max_latency: 165,
          latency_history: generateLatencyData(120),
          region: "us-east-1",
          endpoint: "https://api.openai.com/v1/chat/completions"
        },
        {
          name: "Anthropic",
          status: "online",
          latency: 145,
          availability: 99.2,
          base_latency: 145,
          avg_latency: 142,
          min_latency: 110,
          max_latency: 180,
          latency_history: generateLatencyData(145),
          region: "us-west-2",
          endpoint: "https://api.anthropic.com/v1/messages"
        }
      ];
    }
  },

  async getProviderHistory(providerName, hours = 24) {
    try {
      // Generate historical data for the specified time period
      const dataPoints = hours * 6; // 6 points per hour (10-minute intervals)
      const now = new Date();
      const history = [];
      
      const baseLatency = 120; // Default base latency
      
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
    } catch (error) {
      console.error("Error fetching provider history:", error);
      throw error;
    }
  },

  async getProviderMetrics(providerName) {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return {
        name: providerName,
        uptime: 99.5,
        totalRequests: Math.floor(Math.random() * 100000) + 50000,
        successRate: Math.random() * 5 + 95, // 95-100%
        errorRate: Math.random() * 5, // 0-5%
        avgLatency: 120,
        p95Latency: 180,
        p99Latency: 240
      };
    } catch (error) {
      console.error("Error fetching provider metrics:", error);
      throw error;
    }
  }
};