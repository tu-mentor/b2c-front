export interface ScoresDto {
  realistic: number;
  investigative: number;
  artistic: number;
  social: number;
  enterprising: number;
  conventional: number;
}

export interface CreateHollandtDto {
  childId: string;
  currentQuestion: number;
  scores: ScoresDto;
  careers: string[];
}

export interface UpdateHollandDto {
  currentQuestion: number;
  scores: ScoresDto;
  careers: string[];
}

export interface ResponseHollandDto {   
    _id: string, 
    currentQuestion: number;
    scores: ScoresDto;
    careers: string[];
  }
  