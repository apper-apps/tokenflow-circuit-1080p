export const sandboxService = {
  async getAll() {
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
          { field: { Name: "description" } },
          { field: { Name: "model" } },
          { field: { Name: "tokens" } },
          { field: { Name: "complexity" } },
          { field: { Name: "category" } },
          { field: { Name: "parameters_temperature" } },
          { field: { Name: "parameters_max_tokens" } },
          { field: { Name: "parameters_top_p" } }
        ]
      };

      const response = await apperClient.fetchRecords('sandbox_scenario', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching sandbox scenarios:", error);
      throw error;
    }
  },

  async getById(id) {
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
          { field: { Name: "description" } },
          { field: { Name: "model" } },
          { field: { Name: "tokens" } },
          { field: { Name: "complexity" } },
          { field: { Name: "category" } },
          { field: { Name: "parameters_temperature" } },
          { field: { Name: "parameters_max_tokens" } },
          { field: { Name: "parameters_top_p" } }
        ]
      };

      const response = await apperClient.getRecordById('sandbox_scenario', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching sandbox scenario with ID ${id}:`, error);
      throw error;
    }
  },

  async create(config) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: config.Name || config.name || `Test Config ${Date.now()}`,
          Tags: config.Tags || config.tags || "",
          Owner: config.Owner || config.owner,
          description: config.description || "",
          model: config.model || "",
          tokens: config.tokens || 0,
          complexity: config.complexity || "medium",
          category: config.category || "test",
          parameters_temperature: config.parameters_temperature || config.parameters?.temperature || 0.7,
          parameters_max_tokens: config.parameters_max_tokens || config.parameters?.max_tokens || 150,
          parameters_top_p: config.parameters_top_p || config.parameters?.top_p || 1.0
        }]
      };

      const response = await apperClient.createRecord('sandbox_scenario', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create sandbox scenario:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating sandbox scenario:", error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: data.Name || data.name,
          Tags: data.Tags || data.tags,
          Owner: data.Owner || data.owner,
          description: data.description,
          model: data.model,
          tokens: data.tokens,
          complexity: data.complexity,
          category: data.category,
          parameters_temperature: data.parameters_temperature || data.parameters?.temperature,
          parameters_max_tokens: data.parameters_max_tokens || data.parameters?.max_tokens,
          parameters_top_p: data.parameters_top_p || data.parameters?.top_p
        }]
      };

      const response = await apperClient.updateRecord('sandbox_scenario', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update sandbox scenario:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error updating sandbox scenario:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('sandbox_scenario', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return true;
    } catch (error) {
      console.error("Error deleting sandbox scenario:", error);
      throw error;
    }
  },

  async getScenarios() {
    // Delegate to getAll for scenarios
    return this.getAll();
  },

  async runTest(ruleId, testData) {
    // Simulate test execution time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
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