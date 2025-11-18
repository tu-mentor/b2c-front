import api from "../api";

export const resultService = {
  async getResults(userId: string, timestamp?: number): Promise<any> {
    try {
      const t = timestamp || Date.now();
      const response = await api.get<any>(`/users/${userId}/children-results?t=${t}`);
      return response;
    } catch (error) {
      throw new Error("Failed to fetch test results. Please try again.");
    }
  },
};
