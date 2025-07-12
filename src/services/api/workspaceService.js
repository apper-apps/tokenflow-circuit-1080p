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

      // Only include Updateable fields for creation
      const params = {
        records: [{
          Name: workspaceData.name,
          Tags: workspaceData.tags || "",
          Owner: workspaceData.owner,
          description: workspaceData.description || "",
          tier: workspaceData.tier || "free",
          usage_quota: workspaceData.usage_quota || 1000,
          current_usage: workspaceData.current_usage || 0,
          created_at: new Date().toISOString(),
          last_active_at: new Date().toISOString(),
          team_members: workspaceData.team_members || 1,
          api_keys: workspaceData.api_keys || 0,
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

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          const errorMessage = result.message || 'Failed to create workspace';
          throw new Error(errorMessage);
        }
      }

      throw new Error('No result returned from create operation');
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

      // Only include Updateable fields for update
      const params = {
        records: [{
          Id: id,
          Name: updateData.name,
          Tags: updateData.tags,
          Owner: updateData.owner,
          description: updateData.description,
          tier: updateData.tier,
          usage_quota: updateData.usage_quota,
          current_usage: updateData.current_usage,
          last_active_at: new Date().toISOString(),
          team_members: updateData.team_members,
          api_keys: updateData.api_keys,
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

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          const errorMessage = result.message || 'Failed to update workspace';
          throw new Error(errorMessage);
        }
      }

      throw new Error('No result returned from update operation');
    } catch (error) {
      console.error(`Error updating workspace with ID ${id}:`, error);
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
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('workspace', params);
      
      if (!response.success) {
        const errorMessage = response.message || 'Failed to delete workspace';
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          const errorMessage = result.message || 'Failed to delete workspace';
          throw new Error(errorMessage);
        }
      }

      return true;
    } catch (error) {
      console.error(`Error deleting workspace with ID ${id}:`, error);
      throw error;
    }
  },

  async switchWorkspace(workspaceId) {
    try {
      // For switching workspace, we just need to get the workspace data
      // The actual switching logic is handled in the useWorkspace hook
      const workspace = await this.getById(workspaceId);
      
      if (!workspace) {
        throw new Error('Workspace not found');
      }

      return workspace;
    } catch (error) {
      console.error(`Error switching to workspace with ID ${workspaceId}:`, error);
throw error;
    }
  }
};