export const routingRuleService = {
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
          { field: { Name: "priority" } },
          { field: { Name: "conditions_max_cost" } },
          { field: { Name: "conditions_max_latency" } },
          { field: { Name: "conditions_min_success_rate" } },
          { field: { Name: "target_provider" } },
          { field: { Name: "fallback_providers" } }
        ]
      };

      const response = await apperClient.fetchRecords('routing_rule', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching routing rules:", error);
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
          { field: { Name: "priority" } },
          { field: { Name: "conditions_max_cost" } },
          { field: { Name: "conditions_max_latency" } },
          { field: { Name: "conditions_min_success_rate" } },
          { field: { Name: "target_provider" } },
          { field: { Name: "fallback_providers" } }
        ]
      };

      const response = await apperClient.getRecordById('routing_rule', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching routing rule with ID ${id}:`, error);
      throw error;
    }
  },

  async create(ruleData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: ruleData.Name || ruleData.name,
          Tags: ruleData.Tags || ruleData.tags || "",
          Owner: ruleData.Owner || ruleData.owner,
          priority: ruleData.priority,
          conditions_max_cost: ruleData.conditions_max_cost || ruleData.conditions?.maxCost,
          conditions_max_latency: ruleData.conditions_max_latency || ruleData.conditions?.maxLatency,
          conditions_min_success_rate: ruleData.conditions_min_success_rate || ruleData.conditions?.minSuccessRate,
          target_provider: ruleData.target_provider || ruleData.targetProvider,
          fallback_providers: Array.isArray(ruleData.fallback_providers) ? ruleData.fallback_providers.join(',') : 
                              Array.isArray(ruleData.fallbackProviders) ? ruleData.fallbackProviders.join(',') : ""
        }]
      };

      const response = await apperClient.createRecord('routing_rule', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create routing rule:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating routing rule:", error);
      throw error;
    }
  },

  async update(id, updateData) {
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
          Name: updateData.Name || updateData.name,
          Tags: updateData.Tags || updateData.tags,
          Owner: updateData.Owner || updateData.owner,
          priority: updateData.priority,
          conditions_max_cost: updateData.conditions_max_cost || updateData.conditions?.maxCost,
          conditions_max_latency: updateData.conditions_max_latency || updateData.conditions?.maxLatency,
          conditions_min_success_rate: updateData.conditions_min_success_rate || updateData.conditions?.minSuccessRate,
          target_provider: updateData.target_provider || updateData.targetProvider,
          fallback_providers: Array.isArray(updateData.fallback_providers) ? updateData.fallback_providers.join(',') : 
                              Array.isArray(updateData.fallbackProviders) ? updateData.fallbackProviders.join(',') : ""
        }]
      };

      const response = await apperClient.updateRecord('routing_rule', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update routing rule:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error updating routing rule:", error);
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

      const response = await apperClient.deleteRecord('routing_rule', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return true;
    } catch (error) {
      console.error("Error deleting routing rule:", error);
      throw error;
    }
  }
};