import mockData from "@/services/mockData/apiKeys.json";

export const apiKeyService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockData;
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const apiKey = mockData.find(k => k.Id === id);
    if (!apiKey) {
      throw new Error("API key not found");
    }
    return apiKey;
  },

  async create(keyData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newKey = {
      ...keyData,
      Id: Math.max(...mockData.map(k => k.Id)) + 1,
      status: "pending",
      lastValidated: null,
      monthlyRequests: 0,
      monthlyCost: 0
    };
    return newKey;
  },

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const apiKey = mockData.find(k => k.Id === id);
    if (!apiKey) {
      throw new Error("API key not found");
    }
    return { ...apiKey, ...updateData, lastValidated: new Date().toISOString() };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockData.findIndex(k => k.Id === id);
    if (index === -1) {
      throw new Error("API key not found");
    }
    return true;
  }
};