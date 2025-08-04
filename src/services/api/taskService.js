const taskService = {
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
              "Name": "title_c"
            }
          },
          {
            "field": {
              "Name": "description_c"
            }
          },
          {
            "field": {
              "Name": "priority_c"
            }
          },
          {
            "field": {
              "Name": "dueDate_c"
            }
          },
          {
            "field": {
              "Name": "completed_c"
            }
          },
          {
            "field": {
              "Name": "completedAt_c"
            }
          },
          {
            "field": {
              "Name": "createdAt_c"
            }
          },
          {
            "field": {
              "Name": "categoryId_c"
            }
          }
        ]
      };

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.fetchRecords('task_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform response data to match UI expectations
      const transformedData = response.data?.map(task => ({
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        categoryId: task.categoryId_c?.Id || task.categoryId_c,
        priority: task.priority_c || 'medium',
        dueDate: task.dueDate_c,
        completed: task.completed_c || false,
        completedAt: task.completedAt_c,
        createdAt: task.createdAt_c
      })) || [];

      return transformedData;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error?.response?.data?.message);
      } else {
        console.error("Error fetching tasks:", error.message);
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
              "Name": "title_c"
            }
          },
          {
            "field": {
              "Name": "description_c"
            }
          },
          {
            "field": {
              "Name": "priority_c"
            }
          },
          {
            "field": {
              "Name": "dueDate_c"
            }
          },
          {
            "field": {
              "Name": "completed_c"
            }
          },
          {
            "field": {
              "Name": "completedAt_c"
            }
          },
          {
            "field": {
              "Name": "createdAt_c"
            }
          },
          {
            "field": {
              "Name": "categoryId_c"
            }
          }
        ]
      };

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.getRecordById('task_c', parseInt(id), params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Task not found");
      }

      // Transform response data to match UI expectations
      const task = response.data;
      return {
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        categoryId: task.categoryId_c?.Id || task.categoryId_c,
        priority: task.priority_c || 'medium',
        dueDate: task.dueDate_c,
        completed: task.completed_c || false,
        completedAt: task.completedAt_c,
        createdAt: task.createdAt_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching task with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching task with ID ${id}:`, error.message);
      }
      throw error;
    }
  },

  async create(taskData) {
    try {
      const params = {
        records: [
          {
            Name: taskData.title || 'Untitled Task',
            title_c: taskData.title || '',
            description_c: taskData.description || '',
            priority_c: taskData.priority || 'medium',
            dueDate_c: taskData.dueDate || null,
            completed_c: taskData.completed || false,
            completedAt_c: taskData.completedAt || null,
            createdAt_c: taskData.createdAt || new Date().toISOString(),
            categoryId_c: taskData.categoryId ? parseInt(taskData.categoryId) : null
          }
        ]
      };

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.createRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} task records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create task");
        }

        if (successfulRecords.length > 0) {
          const createdTask = successfulRecords[0].data;
          return {
            Id: createdTask.Id,
            title: createdTask.title_c || '',
            description: createdTask.description_c || '',
            categoryId: createdTask.categoryId_c?.Id || createdTask.categoryId_c,
            priority: createdTask.priority_c || 'medium',
            dueDate: createdTask.dueDate_c,
            completed: createdTask.completed_c || false,
            completedAt: createdTask.completedAt_c,
            createdAt: createdTask.createdAt_c
          };
        }
      }

      throw new Error("No task was created");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error?.response?.data?.message);
      } else {
        console.error("Error creating task:", error.message);
      }
      throw error;
    }
  },

  async update(id, taskData) {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      // Only include fields that are being updated
      if (taskData.title !== undefined) {
        updateData.Name = taskData.title;
        updateData.title_c = taskData.title;
      }
      if (taskData.description !== undefined) updateData.description_c = taskData.description;
      if (taskData.priority !== undefined) updateData.priority_c = taskData.priority;
      if (taskData.dueDate !== undefined) updateData.dueDate_c = taskData.dueDate;
      if (taskData.completed !== undefined) updateData.completed_c = taskData.completed;
      if (taskData.completedAt !== undefined) updateData.completedAt_c = taskData.completedAt;
      if (taskData.categoryId !== undefined) updateData.categoryId_c = taskData.categoryId ? parseInt(taskData.categoryId) : null;

      const params = {
        records: [updateData]
      };

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.updateRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} task records:${JSON.stringify(failedUpdates)}`);
          throw new Error("Failed to update task");
        }

        if (successfulUpdates.length > 0) {
          const updatedTask = successfulUpdates[0].data;
          return {
            Id: updatedTask.Id,
            title: updatedTask.title_c || '',
            description: updatedTask.description_c || '',
            categoryId: updatedTask.categoryId_c?.Id || updatedTask.categoryId_c,
            priority: updatedTask.priority_c || 'medium',
            dueDate: updatedTask.dueDate_c,
            completed: updatedTask.completed_c || false,
            completedAt: updatedTask.completedAt_c,
            createdAt: updatedTask.createdAt_c
          };
        }
      }

      throw new Error("Task was not updated");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task:", error?.response?.data?.message);
      } else {
        console.error("Error updating task:", error.message);
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

      const response = await apperClient.deleteRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} task records:${JSON.stringify(failedDeletions)}`);
          throw new Error("Failed to delete task");
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting task:", error?.response?.data?.message);
      } else {
        console.error("Error deleting task:", error.message);
      }
      throw error;
    }
  }
};

export default taskService;