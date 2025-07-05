// User Types
export interface User {
  id?: string;
  name: string;
  birthDate: string;
  birthTime?: string;
  birthPlace?: string;
  character: string;
  createdAt?: Date;
  // Doğum haritası verileri
  birthChart?: {
    sun_sign: string;
    moon_sign: string;
    rising_sign: string;
    planets: {
      sun: { sign: string; degree: number; house: number };
      moon: { sign: string; degree: number; house: number };
      mercury: { sign: string; degree: number; house: number };
      venus: { sign: string; degree: number; house: number };
      mars: { sign: string; degree: number; house: number };
      jupiter: { sign: string; degree: number; house: number };
      saturn: { sign: string; degree: number; house: number };
      uranus: { sign: string; degree: number; house: number };
      neptune: { sign: string; degree: number; house: number };
      pluto: { sign: string; degree: number; house: number };
    };
    houses: Array<{ sign: string; degree: number }>;
    aspects: Array<{
      planet1: string;
      planet2: string;
      aspect: string;
      degree: number;
      orb: number;
    }>;
  };
  // Eski alanlar (geriye uyumluluk için)
  sun_sign?: string;
  element?: string;
  score?: number;
  lives?: number;
  premium?: boolean;
}

// Quiz Types
export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
}

export interface QuizResult {
  questionIndex: number;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
}

// Navigation Types
export type RootStackParamList = {
  Welcome: undefined;
  BirthInput: { user?: User; fromFinal?: boolean; fromKader?: boolean };
  Character: { user: User };
  Corridor: { user: User; finalCompleted?: boolean };
  PlanetRoom: { user: User };
  ZodiacRoom: { user: User };
  ElementRoom: { user: User };
  EvlerRoom: { user: User };
  KaderRoom: { user: User };
  Final: { user: User; aspectsCompleted: boolean };
  Premium: { user: User };
  Report: { user: User };
};

// Game Progress Types
export interface GameProgress {
  userId: string;
  planetRoomCompleted: boolean;
  zodiacRoomCompleted: boolean;
  elementRoomCompleted: boolean;
  evlerRoomCompleted: boolean;

  finalCompleted: boolean;
  totalScore: number;
  livesRemaining: number;
  lastPlayedAt: Date;
}

// Email Types
export interface EmailRequest {
  to: string;
  subject: string;
  body: string;
  timestamp: Date;
  status: 'pending' | 'sent' | 'failed';
}

// Room Types
export interface Room {
  id: string;
  name: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  requiredScore?: number;
  description: string;
} 