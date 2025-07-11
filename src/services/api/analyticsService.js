import mockData from "@/services/mockData/analytics.json";

export const analyticsService = {
  async getAnalytics(timeRange = "7d") {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockData[timeRange] || mockData["7d"];
  }
};