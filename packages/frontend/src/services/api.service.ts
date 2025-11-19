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
      '/generate',
      request
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to generate guide');
    }

    return response.data.data;
  },

  /**
   * Research a topic (without generating content)
   */
  async researchTopic(topic: string): Promise<any> {
    const response = await apiClient.post<ApiResponse<any>>('/research', {
      topic,
    });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to research topic');
    }

    return response.data.data;
  },

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await apiClient.get('/health');
      return response.data.success === true;
    } catch {
      return false;
    }
  },
};
