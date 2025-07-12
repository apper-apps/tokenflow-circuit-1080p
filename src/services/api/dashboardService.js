export const dashboardService = {
  async getDashboardData() {
    try {
      // Aggregate data from multiple sources
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
          { field: { Name: "avg_response_time" } }
        ]
      };

      const response = await apperClient.fetchRecords('analytics', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const analyticsData = response.data || [];
      
      // Create dashboard summary from analytics data
      const dashboardData = {
        totalProjects: analyticsData.length,
        apiCallsToday: analyticsData.reduce((sum, item) => sum + (item.total_requests || 0), 0),
        costSavings: analyticsData.reduce((sum, item) => sum + (item.cost_savings || 0), 0),
        avgResponseTime: analyticsData.length > 0 ? 
          analyticsData.reduce((sum, item) => sum + (item.avg_response_time || 0), 0) / analyticsData.length : 0,
        stats: [
          {
            id: "projects",
            title: "Total Projects",
            value: analyticsData.length.toString(),
            change: "+12%",
            trend: "up",
            icon: "FolderOpen"
          },
          {
            id: "requests",
            title: "API Calls Today",
            value: analyticsData.reduce((sum, item) => sum + (item.total_requests || 0), 0).toLocaleString(),
            change: "+8%",
            trend: "up",
            icon: "Activity"
          },
          {
            id: "savings",
            title: "Cost Savings",
            value: `$${analyticsData.reduce((sum, item) => sum + (item.cost_savings || 0), 0).toFixed(2)}`,
            change: "+15%",
            trend: "up",
            icon: "TrendingDown"
          },
          {
            id: "response",
            title: "Avg Response Time",
            value: `${Math.round(analyticsData.length > 0 ? 
              analyticsData.reduce((sum, item) => sum + (item.avg_response_time || 0), 0) / analyticsData.length : 0)}ms`,
            change: "-5ms",
            trend: "down",
            icon: "Clock"
          }
        ],
        recentActivity: []
      };

      return dashboardData;
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Return default dashboard data structure on error
      return {
        totalProjects: 0,
        apiCallsToday: 0,
        costSavings: 0,
        avgResponseTime: 0,
        stats: [],
        recentActivity: []
      };
    }
  }
};