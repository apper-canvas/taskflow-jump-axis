const categoryService = {
  async getAll() {
    try {
      const params = {
        "fields": [
          {
            "field": {
              "Name": "Name"
            }
          },
          {
            "field": {
              "Name": "color_c"
            }
          },
          {
            "field": {
              "Name": "icon_c"
            }
          },
          {
            "field": {
              "Name": "taskCount_c"
            }
          }
        ],
        "aggregators": [
          {
            "id": "TaskCount",
            "fields": [
              {
                "field": {
                  "Name": "Id"
                },
                "Function": "Count"
              }
            ],
            "where": [],
            "pagingInfo": {
              "limit": 10,
              "offset": 0
            }
          }
        ]
      };

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.fetchRecords('category_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform response data to match UI expectations
      const transformedData = response.data?.map(category => ({
        Id: category.Id,
        name: category.Name || '',
        color: category.color_c || '#5B21B6',
        icon: category.icon_c || 'Folder',
        taskCount: category.taskCount_c || 0
      })) || [];

      return transformedData;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching categories:", error?.response?.data?.message);
      } else {
        console.error("Error fetching categories:", error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        "fields": [
          {
            "field": {
              "Name": "Name"
            }
          },
          {
            "field": {
              "Name": "color_c"
            }
          },
          {
            "field": {
              "Name": "icon_c"
            }
          },
          {
            "field": {
              "Name": "taskCount_c"
            }
          }
        ]
      };

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.getRecordById('category_c', parseInt(id), params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Category not found");
      }

      // Transform response data to match UI expectations
      const category = response.data;
      return {
        Id: category.Id,
        name: category.Name || '',
        color: category.color_c || '#5B21B6',
        icon: category.icon_c || 'Folder',
        taskCount: category.taskCount_c || 0
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching category with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching category with ID ${id}:`, error.message);
      }
      throw error;
    }
  },

  async create(categoryData) {
    try {
      const params = {
        records: [
          {
            Name: categoryData.name || 'Untitled Category',
            color_c: categoryData.color || '#5B21B6',
            icon_c: categoryData.icon || 'Folder',
            taskCount_c: categoryData.taskCount || 0
          }
        ]
      };

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.createRecord('category_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} category records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create category");
        }

        if (successfulRecords.length > 0) {
          const createdCategory = successfulRecords[0].data;
          return {
            Id: createdCategory.Id,
            name: createdCategory.Name || '',
            color: createdCategory.color_c || '#5B21B6',
            icon: createdCategory.icon_c || 'Folder',
            taskCount: createdCategory.taskCount_c || 0
          };
        }
      }

      throw new Error("No category was created");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating category:", error?.response?.data?.message);
      } else {
        console.error("Error creating category:", error.message);
      }
      throw error;
    }
  },

  async update(id, categoryData) {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      // Only include fields that are being updated
      if (categoryData.name !== undefined) updateData.Name = categoryData.name;
      if (categoryData.color !== undefined) updateData.color_c = categoryData.color;
      if (categoryData.icon !== undefined) updateData.icon_c = categoryData.icon;
      if (categoryData.taskCount !== undefined) updateData.taskCount_c = categoryData.taskCount;

      const params = {
        records: [updateData]
      };

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.updateRecord('category_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} category records:${JSON.stringify(failedUpdates)}`);
          throw new Error("Failed to update category");
        }

        if (successfulUpdates.length > 0) {
          const updatedCategory = successfulUpdates[0].data;
          return {
            Id: updatedCategory.Id,
            name: updatedCategory.Name || '',
            color: updatedCategory.color_c || '#5B21B6',
            icon: updatedCategory.icon_c || 'Folder',
            taskCount: updatedCategory.taskCount_c || 0
          };
        }
      }

      throw new Error("Category was not updated");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating category:", error?.response?.data?.message);
      } else {
        console.error("Error updating category:", error.message);
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.deleteRecord('category_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} category records:${JSON.stringify(failedDeletions)}`);
          throw new Error("Failed to delete category");
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting category:", error?.response?.data?.message);
      } else {
        console.error("Error deleting category:", error.message);
      }
      throw error;
    }
  }
};

export default categoryService;