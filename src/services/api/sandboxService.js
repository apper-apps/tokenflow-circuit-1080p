import mockScenarios from "@/services/mockData/sandboxScenarios.json";

let configurations = [];
let nextConfigId = 1;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const sandboxService = {
  async getAll() {
    await delay(300);
    return [...configurations];
  },

  async getById(id) {
    await delay(200);
    const config = configurations.find(c => c.Id === parseInt(id));
    if (!config) {
      throw new Error(`Configuration with ID ${id} not found`);
    }
    return { ...config };
  },

  async create(config) {
    await delay(400);
    const newConfig = {
      Id: nextConfigId++,
      ...config,
      createdAt: new Date().toISOString(),
      name: config.name || `Test Config ${nextConfigId - 1}`
    };
    configurations.push(newConfig);
    return { ...newConfig };
  },

  async update(id, data) {
    await delay(300);
    const index = configurations.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Configuration with ID ${id} not found`);
    }
    
    configurations[index] = {
      ...configurations[index],
      ...data,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    return { ...configurations[index] };
  },

  async delete(id) {
    await delay(300);
    const index = configurations.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Configuration with ID ${id} not found`);
    }
    configurations.splice(index, 1);
    return true;
  },

  async getScenarios() {
    await delay(300);
    return [...mockScenarios];
  },

  async runTest(ruleId, testData) {
    await delay(1500); // Simulate test execution time
    
    // Mock test results based on input
    const providers = ['OpenAI', 'Anthropic', 'Google', 'Cohere', 'Hugging Face'];
    const models = ['gpt-4', 'claude-3', 'gemini-pro', 'command-r', 'llama-2'];
    
    const selectedProvider = providers[Math.floor(Math.random() * providers.length)];
    const selectedModel = models[Math.floor(Math.random() * models.length)];
    
    const baseCost = (testData.tokens || 1000) * 0.00002;
    const alternativeCost = baseCost * (1 + Math.random() * 0.5);
    const savings = alternativeCost - baseCost;
    
    const result = {
      selectedProvider,
      model: selectedModel,
      confidence: Math.floor(85 + Math.random() * 15),
      cost: {
        estimated: baseCost.toFixed(4),
        alternative: alternativeCost.toFixed(4),
        savings: savings.toFixed(4)
      },
      performance: {
        latency: Math.floor(200 + Math.random() * 800),
        throughput: Math.floor(10 + Math.random() * 90),
        reliability: Math.floor(95 + Math.random() * 5)
      },
      suggestions: [
        "Consider using a smaller model for simple queries to reduce costs",
        "Enable caching for frequently repeated requests",
        "Implement request batching for better throughput"
      ]
    };
    
    return result;
  },

  // Legacy methods for backward compatibility
  async saveConfiguration(config) {
    return this.create(config);
  },

  async getConfigurations() {
    return this.getAll();
  },

  async getConfigurationById(id) {
    return this.getById(id);
  },

  async deleteConfiguration(id) {
    return this.delete(id);
  }
};