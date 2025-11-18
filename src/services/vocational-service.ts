import api from "./api";

interface ProcessResultsData {
  userId: string;
  careerType: string;
  selectedCareer: string;
}

export const vocationalService = {
  async processResults(data: ProcessResultsData): Promise<{
    userId: string;
    userName: string;
    existingResults: boolean;
    result: string;
  }> {
    const timestamp = Date.now();
    const response = await api.post<{
      userId: string;
      userName: string;
      result: string;
      existingResults: boolean;
    }>(`/openai/process-user-data?timestamp=${timestamp}`, data);
    return response;
  },

  async getCareers(userId: string): Promise<string[]> {
    const timestamp = Date.now();
    const response = await api.get<string[]>(`/openai/careers/${userId}?timestamp=${timestamp}`);
    return response;
  },
};
