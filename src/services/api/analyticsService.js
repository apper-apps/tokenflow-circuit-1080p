export const analyticsService = {
  async getAnalytics(timeRange = "7d") {
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
          { field: { Name: "total_requests" } },
          { field: { Name: "total_cost" } },
          { field: { Name: "cost_savings" } },
          { field: { Name: "avg_response_time" } },
          { field: { Name: "provider_performance" } },
          { field: { Name: "optimization_cost_reduction" } },
          { field: { Name: "optimization_speed_improvement" } },
          { field: { Name: "optimization_reliability_improvement" } }
        ]
      };

      const response = await apperClient.fetchRecords('analytics', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Process and aggregate the data based on timeRange
      const data = response.data || [];
      if (data.length === 0) {
        // Return default structure if no data
        return {
          totalRequests: 0,
          totalCost: 0,
          costSavings: 0,
          avgResponseTime: 0,
          providerPerformance: [],
          optimization: {
            costReduction: 0,
            speedImprovement: 0,
            reliabilityImprovement: 0
          }
        };
      }

      // Aggregate data (in real implementation, this would be server-side)
      const aggregated = {
        totalRequests: data.reduce((sum, item) => sum + (item.total_requests || 0), 0),
        totalCost: data.reduce((sum, item) => sum + (item.total_cost || 0), 0),
        costSavings: data.reduce((sum, item) => sum + (item.cost_savings || 0), 0),
        avgResponseTime: data.length > 0 ? 
          data.reduce((sum, item) => sum + (item.avg_response_time || 0), 0) / data.length : 0,
        providerPerformance: JSON.parse(data[0]?.provider_performance || '[]'),
        optimization: {
          costReduction: data.reduce((sum, item) => sum + (item.optimization_cost_reduction || 0), 0) / data.length,
          speedImprovement: data.reduce((sum, item) => sum + (item.optimization_speed_improvement || 0), 0) / data.length,
          reliabilityImprovement: data.reduce((sum, item) => sum + (item.optimization_reliability_improvement || 0), 0) / data.length
        }
      };

      return aggregated;
    } catch (error) {
      console.error("Error fetching analytics:", error);
      throw error;
    }
  }
};