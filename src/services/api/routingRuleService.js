import mockData from "@/services/mockData/routingRules.json";

export const routingRuleService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockData;
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const rule = mockData.find(r => r.Id === id);
    if (!rule) {
      throw new Error("Routing rule not found");
    }
    return rule;
  },

  async create(ruleData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newRule = {
      ...ruleData,
      Id: Math.max(...mockData.map(r => r.Id)) + 1,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    return newRule;
  },

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const rule = mockData.find(r => r.Id === id);
    if (!rule) {
      throw new Error("Routing rule not found");
    }
    return { ...rule, ...updateData, lastModified: new Date().toISOString() };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockData.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error("Routing rule not found");
    }
    return true;
  }
};