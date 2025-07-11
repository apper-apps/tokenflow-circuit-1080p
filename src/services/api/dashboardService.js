import mockData from "@/services/mockData/dashboard.json";

export const dashboardService = {
  async getDashboardData() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockData;
  }
};