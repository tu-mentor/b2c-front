import api from "./api";

interface ProcessResultsData {
  userId: string;
  childId: string;
  careerType: string;
  selectedCareer: string;
}

export const vocationalService = {
  async processResults(data: ProcessResultsData): Promise<{
    childId: string;
    childName: string;
    existingResults: boolean;
    result: string;
  }> {
    const timestamp = Date.now();
    const response = await api.post<{
      childId: string;
      childName: string;
      result: string;
      existingResults: boolean;
    }>(`/openai/process-user-data?timestamp=${timestamp}`, data);
    return response;
  },

  async getCareers(userId: string, childId: string): Promise<string[]> {
    const timestamp = Date.now();
    const response = await api.get<string[]>(`/openai/careers/${userId}/${childId}?timestamp=${timestamp}`);
    return response;
  },
};
