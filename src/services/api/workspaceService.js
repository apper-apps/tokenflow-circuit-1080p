export const workspaceService = {
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
          { field: { Name: "tier" } },
          { field: { Name: "usage_quota" } },
          { field: { Name: "current_usage" } },
          { field: { Name: "created_at" } },
          { field: { Name: "last_active_at" } },
          { field: { Name: "team_members" } },
          { field: { Name: "api_keys" } },
          { field: { Name: "status" } },
          { field: { Name: "region" } }
        ]
      };

      const response = await apperClient.fetchRecords('workspace', params);
      
if (!response.success) {
        const errorMessage = response.message || 'Failed to fetch workspaces';
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching workspaces:", error);
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
          { field: { Name: "tier" } },
          { field: { Name: "usage_quota" } },
          { field: { Name: "current_usage" } },
          { field: { Name: "created_at" } },
          { field: { Name: "last_active_at" } },
          { field: { Name: "team_members" } },
          { field: { Name: "api_keys" } },
          { field: { Name: "status" } },
          { field: { Name: "region" } }
        ]
      };

      const response = await apperClient.getRecordById('workspace', id, params);
      
if (!response.success) {
        const errorMessage = response.message || 'Failed to fetch workspace';
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching workspace with ID ${id}:`, error);
      throw error;
    }
  },

  async create(workspaceData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: workspaceData.Name || workspaceData.name,
          Tags: workspaceData.Tags || workspaceData.tags || "",
          Owner: workspaceData.Owner || workspaceData.owner || "John Doe",
          description: workspaceData.description || "",
          tier: workspaceData.tier,
          usage_quota: workspaceData.usage_quota || workspaceData.usageQuota || 
                      (workspaceData.tier === 'free' ? 100000 : 
                       workspaceData.tier === 'pro' ? 1000000 : 5000000),
          current_usage: workspaceData.current_usage || workspaceData.currentUsage || 0,
          created_at: workspaceData.created_at || workspaceData.createdAt || new Date().toISOString(),
          last_active_at: workspaceData.last_active_at || workspaceData.lastActiveAt || new Date().toISOString(),
          team_members: workspaceData.team_members || workspaceData.teamMembers || 1,
          api_keys: workspaceData.api_keys || workspaceData.apiKeys || 0,
          status: workspaceData.status || "active",
          region: workspaceData.region || "us-east-1"
        }]
      };

      const response = await apperClient.createRecord('workspace', params);
      
if (!response.success) {
        const errorMessage = response.message || 'Failed to create workspace';
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
console.error(`Failed to create workspace:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            const errorMessage = record.message || 'Failed to create some workspaces';
            throw new Error(errorMessage);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating workspace:", error);
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
          description: updateData.description,
          tier: updateData.tier,
          usage_quota: updateData.usage_quota || updateData.usageQuota,
          current_usage: updateData.current_usage || updateData.currentUsage,
          created_at: updateData.created_at || updateData.createdAt,
          last_active_at: updateData.last_active_at || updateData.lastActiveAt || new Date().toISOString(),
          team_members: updateData.team_members || updateData.teamMembers,
          api_keys: updateData.api_keys || updateData.apiKeys,
          status: updateData.status,
          region: updateData.region
        }]
      };

      const response = await apperClient.updateRecord('workspace', params);
      
if (!response.success) {
        const errorMessage = response.message || 'Failed to update workspace';
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
console.error(`Failed to update workspace:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            const errorMessage = record.message || 'Failed to update some workspaces';
            throw new Error(errorMessage);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error updating workspace:", error);
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

      const response = await apperClient.deleteRecord('workspace', params);
      
if (!response.success) {
        const errorMessage = response.message || 'Failed to delete workspace';
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      return true;
    } catch (error) {
      console.error("Error deleting workspace:", error);
      throw error;
    }
  },

  async switchWorkspace(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Update last active time
      const params = {
        records: [{
          Id: parseInt(id),
          last_active_at: new Date().toISOString()
        }]
      };

      const response = await apperClient.updateRecord('workspace', params);
      
if (!response.success) {
        const errorMessage = response.message || 'Failed to switch workspace';
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error switching workspace:", error);
      throw error;
    }
  }
};