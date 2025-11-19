import axios from 'axios';
import { GenerateGuideRequest, GeneratedGuide, ApiResponse } from '@guide-generator/shared';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  /**
   * Generate a complete guide
   */
  async generateGuide(request: GenerateGuideRequest): Promise<GeneratedGuide> {
    const response = await apiClient.post<ApiResponse<GeneratedGuide>>(
      "/generate",
      request
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || "Failed to generate guide");
    }

    return response.data.data;
  },

  /**
   * Research a topic (without generating content)
   */
  async researchTopic(topic: string): Promise<any> {
    const response = await apiClient.post<ApiResponse<any>>("/research", {
      topic,
    });

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to research topic");
    }

    return response.data.data;
  },

  /**
   * Get all guides
   */
  async getAllGuides(): Promise<GeneratedGuide[]> {
    const response = await apiClient.get<ApiResponse<GeneratedGuide[]>>(
      "/guides"
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || "Failed to fetch guides");
    }

    return response.data.data;
  },

  /**
   * Get a specific guide by ID
   */
  async getGuide(id: string): Promise<GeneratedGuide> {
    const response = await apiClient.get<ApiResponse<GeneratedGuide>>(
      `/guides/${id}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || "Failed to fetch guide");
    }

    return response.data.data;
  },

  /**
   * Delete a guide by ID
   */
  async deleteGuide(id: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/guides/${id}`
    );

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to delete guide");
    }
  },

  /**
   * Edit a guide using AI based on user instruction
   */
  async editGuide(id: string, instruction: string): Promise<GeneratedGuide> {
    const response = await apiClient.post<ApiResponse<GeneratedGuide>>(
      `/guides/${id}/edit`,
      {
        instruction,
      }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || "Failed to edit guide");
    }

    return response.data.data;
  },

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await apiClient.get("/health");
      return response.data.success === true;
    } catch {
      return false;
    }
  },
};
