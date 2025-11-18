import { Career } from "../career-costs/types_career";

interface Child {
  _id: string;
  childName: string;
  school: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
}

interface HollandScores {
  realistic: number;
  investigative: number;
  artistic: number;
  social: number;
  enterprising: number;
  conventional: number;
}

interface HollandResult {
  _id: string;
  userId: string;
  currentQuestion: number;
  scores: HollandScores;
  careers: string[];
  createdAt: string;
  updatedAt: string;
}

interface ChasideScores {
  C: number;
  H: number;
  A: number;
  S: number;
  I: number;
  D: number;
  E: number;
}

interface ChasideResult {
  _id: string;
  userId: string;
  currentQuestion: number;
  scores: ChasideScores;
  careers: string[];
}

interface UserResult {
  child: Child;
  hollandResult: HollandResult | null;
  chasideResult: ChasideResult | null;
}

interface TestResultsProps {
  hollandResult: HollandResult | null;
  chasideResult: ChasideResult | null;
}

interface UserRowProps {
  child: Child
  hollandResult: HollandResult | null
  chasideResult: ChasideResult | null
  aiResultsAvailable: Record<string, boolean>
  setAiResultsAvailable: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  handleViewCareerComparison: (careers: Career[]) => void
}

export type {
    ChasideResult,
    ChasideScores,
    Child,
    UserResult,
    UserRowProps,
    HollandResult,
    HollandScores,
    TestResultsProps
};

