
// User types
export interface User {
  id: string;
  username: string;
  isReady?: boolean;
  score?: number;
  lastAnswerTime?: number;
  lastAnswerCorrect?: boolean;
  currentQuestionAnswered?: boolean;
}

// Room types
export interface Room {
  id: string;
  name: string;
  hostId: string;
  isPrivate: boolean;
  status: 'waiting' | 'starting' | 'in-progress' | 'completed';
  playerCount: number;
  maxPlayers: number;
  players: Record<string, User>;
  category?: string;
  currentQuestionIndex?: number;
  startTime?: number;
  questionStartTime?: number;
  quizEnded?: boolean;
}

// Question types
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
}

export interface QuizCategory {
  id: string;
  name: string;
  description: string;
  iconName: string;
  questionCount: number;
}

export interface PlayerAnswer {
  userId: string;
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  timeToAnswer: number; // in milliseconds
}

// Game state types
export interface GameState {
  currentUser: User | null;
  currentRoom: Room | null;
  questions: QuizQuestion[];
  currentQuestion: QuizQuestion | null;
  playerAnswers: PlayerAnswer[];
  showResults: boolean;
  timeRemaining: number;
  isLoading: boolean;
  error: string | null;
}

// Firebase data structure types
export interface FirebaseRooms {
  [roomId: string]: {
    id: string;
    name: string;
    hostId: string;
    isPrivate: boolean;
    status: 'waiting' | 'starting' | 'in-progress' | 'completed';
    playerCount: number;
    maxPlayers: number;
    players: Record<string, {
      id: string;
      username: string;
      isReady: boolean;
      score: number;
      lastAnswerTime?: number;
      lastAnswerCorrect?: boolean;
      currentQuestionAnswered?: boolean;
    }>;
    category?: string;
    currentQuestionIndex?: number;
    startTime?: number;
    questionStartTime?: number;
    quizEnded?: boolean;
  }
}
