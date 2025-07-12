export const apiKeyService = {
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
          { field: { Name: "provider" } },
          { field: { Name: "encrypted_key" } },
          { field: { Name: "status" } },
          { field: { Name: "last_validated" } },
          { field: { Name: "monthly_requests" } },
          { field: { Name: "monthly_cost" } }
        ]
      };

      const response = await apperClient.fetchRecords('api_key', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching API keys:", error);
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
          { field: { Name: "provider" } },
          { field: { Name: "encrypted_key" } },
          { field: { Name: "status" } },
          { field: { Name: "last_validated" } },
          { field: { Name: "monthly_requests" } },
          { field: { Name: "monthly_cost" } }
        ]
      };

      const response = await apperClient.getRecordById('api_key', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching API key with ID ${id}:`, error);
      throw error;
    }
  },

  async create(keyData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: keyData.Name || keyData.name,
          Tags: keyData.Tags || keyData.tags || "",
          Owner: keyData.Owner || keyData.owner,
          provider: keyData.provider,
          encrypted_key: keyData.encrypted_key || keyData.encryptedKey,
          status: keyData.status || "pending",
          last_validated: keyData.last_validated || keyData.lastValidated,
          monthly_requests: keyData.monthly_requests || keyData.monthlyRequests || 0,
          monthly_cost: keyData.monthly_cost || keyData.monthlyCost || 0
        }]
      };

      const response = await apperClient.createRecord('api_key', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create API key:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating API key:", error);
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
          provider: updateData.provider,
          encrypted_key: updateData.encrypted_key || updateData.encryptedKey,
          status: updateData.status,
          last_validated: updateData.last_validated || updateData.lastValidated || new Date().toISOString(),
          monthly_requests: updateData.monthly_requests || updateData.monthlyRequests,
          monthly_cost: updateData.monthly_cost || updateData.monthlyCost
        }]
      };

      const response = await apperClient.updateRecord('api_key', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update API key:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error updating API key:", error);
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

      const response = await apperClient.deleteRecord('api_key', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return true;
    } catch (error) {
      console.error("Error deleting API key:", error);
      throw error;
    }
  }
};