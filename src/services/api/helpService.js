export const helpService = {
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
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "category" } },
          { field: { Name: "read_time" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ]
      };

      const response = await apperClient.fetchRecords('help_article', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching help articles:", error);
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
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "category" } },
          { field: { Name: "read_time" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ]
      };

      const response = await apperClient.getRecordById('help_article', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching help article with ID ${id}:`, error);
      throw error;
    }
  },

  async getByCategory(category) {
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
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "category" } },
          { field: { Name: "read_time" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ],
        where: [
          {
            FieldName: "category",
            Operator: "EqualTo",
            Values: [category]
          }
        ]
      };

      const response = await apperClient.fetchRecords('help_article', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching help articles by category:", error);
      throw error;
    }
  },

  async search(query) {
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
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "category" } },
          { field: { Name: "read_time" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [{
                fieldName: "title",
                operator: "Contains",
                values: [query],
                include: true
              }],
              operator: "OR"
            },
            {
              conditions: [{
                fieldName: "content",
                operator: "Contains",
                values: [query],
                include: true
              }],
              operator: "OR"
            },
            {
              conditions: [{
                fieldName: "Tags",
                operator: "Contains",
                values: [query],
                include: true
              }],
              operator: "OR"
            }
          ]
        }]
      };

      const response = await apperClient.fetchRecords('help_article', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching help articles:", error);
      throw error;
    }
  },

  async create(article) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: article.Name || article.name || article.title,
          Tags: article.Tags || article.tags || "",
          Owner: article.Owner || article.owner,
          title: article.title,
          content: article.content,
          category: article.category,
          read_time: article.read_time || article.readTime || 5,
          created_at: article.created_at || article.createdAt || new Date().toISOString(),
          updated_at: article.updated_at || article.updatedAt || new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('help_article', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create help article:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating help article:", error);
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
          Name: data.Name || data.name || data.title,
          Tags: data.Tags || data.tags,
          Owner: data.Owner || data.owner,
          title: data.title,
          content: data.content,
          category: data.category,
          read_time: data.read_time || data.readTime,
          created_at: data.created_at || data.createdAt,
          updated_at: data.updated_at || data.updatedAt || new Date().toISOString()
        }]
      };

      const response = await apperClient.updateRecord('help_article', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update help article:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error updating help article:", error);
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

      const response = await apperClient.deleteRecord('help_article', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting help article:", error);
      throw error;
    }
  }
};

export default helpService;