const API_BASE_URL = "https://api.chatess.com/api"
// Mock API service
export const chatApi = {
  sendQuestion: async (question: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(question),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      console.log(question, '---------------------->')
      const { task_id } = await response.json();
      return task_id;
    } catch (error) {
      console.error("Failed to send question:", error);
      throw error;
    }
  },
  getResponse: async (taskId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/result/${taskId}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      return {
        status: 'completed',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        result: undefined
      };
    }
  },
  

  getChatHistory: async (user_id: number, tenant_id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat-history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user_id, tenant_id: tenant_id }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch history: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
      throw error;
    }
  },

  deleteThread: async (threadId: string, tenantId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/delete-thread`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ thread_id: threadId, tenant_id: tenantId }),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to delete thread: ${response.status} - ${errorData}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Failed to delete thread:", error);
      throw error;
    }
  },
}
