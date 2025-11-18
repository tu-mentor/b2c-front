export interface University {
    name: string;
    modality: string;
    totalPeriods: number;
    firstSemesterValue: number | null;
  }
  
  export interface Career {
    name: string;
    universities: University[];
  }
  
  export interface CareersData {
    careers: Career[];
  }
  
  