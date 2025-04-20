import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { Room, User, QuizQuestion, GameState, PlayerAnswer } from "../types";
import {
  mockQuizCategories,
  getQuestionsByCategory,
} from "../data/mockQuestions";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

interface QuizContextProps {
  gameState: GameState;
  createRoom: (
    roomName: string,
    isPrivate: boolean,
    category: string,
    maxPlayers: number
  ) => string;
  joinRoom: (roomId: string, username: string) => void;
  leaveRoom: () => void;
  startGame: () => void;
  updatePlayerReadyStatus: (isReady: boolean) => void;
  submitAnswer: (questionId: string, selectedOption: number) => void;
  getRooms: () => Room[];
  timeRemaining: number;
  loading: boolean;
  error: string | null;
}

const QuizContext = createContext<QuizContextProps | undefined>(undefined);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
};

interface QuizProviderProps {
  children: ReactNode;
}

export const QuizProvider = ({ children }: QuizProviderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock data storage
  const [mockRooms, setMockRooms] = useState<Record<string, Room>>({});
  const [mockQuestions, setMockQuestions] = useState<
    Record<string, QuizQuestion[]>
  >({});
  const [gameState, setGameState] = useState<GameState>({
    currentUser: null,
    currentRoom: null,
    questions: [],
    currentQuestion: null,
    playerAnswers: [],
    showResults: false,
    timeRemaining: 10,
    isLoading: false,
    error: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  // Initialize with some demo rooms
  useEffect(() => {
    const demoRooms: Record<string, Room> = {
      SCI123: {
        id: "SCI123",
        name: "Science Trivia",
        hostId: "host-1",
        isPrivate: false,
        status: "waiting",
        playerCount: 2,
        maxPlayers: 4,
        players: {
          "host-1": {
            id: "host-1",
            username: "QuizMaster",
            isReady: true,
            score: 0,
          },
          "player-1": {
            id: "player-1",
            username: "Guest1",
            isReady: false,
            score: 0,
          },
        },
        category: "science",
      },
      POP456: {
        id: "POP456",
        name: "Pop Culture Quiz",
        hostId: "host-2",
        isPrivate: false,
        status: "waiting",
        playerCount: 3,
        maxPlayers: 6,
        players: {
          "host-2": {
            id: "host-2",
            username: "MovieBuff",
            isReady: true,
            score: 0,
          },
          "player-2": {
            id: "player-2",
            username: "TVFan",
            isReady: true,
            score: 0,
          },
          "player-3": {
            id: "player-3",
            username: "MusicLover",
            isReady: false,
            score: 0,
          },
        },
        category: "pop-culture",
      },
    };

    setMockRooms(demoRooms);
  }, []);

  // Create a new room
  const createRoom = (
    roomName: string,
    isPrivate: boolean,
    category: string,
    maxPlayers: number
  ): string => {
    try {
      setLoading(true);

      const roomId = uuidv4().substring(0, 6).toUpperCase();
      const userId = `user-${uuidv4()}`;

      const questions = getQuestionsByCategory(category);
      if (questions.length === 0) {
        throw new Error("No questions available for selected category");
      }

      const newRoom: Room = {
        id: roomId,
        name: roomName,
        hostId: userId,
        isPrivate,
        status: "waiting",
        playerCount: 1,
        maxPlayers,
        players: {
          [userId]: {
            id: userId,
            username: "Host",
            isReady: true,
            score: 0,
          },
        },
        category,
      };

      setMockRooms((prev) => ({ ...prev, [roomId]: newRoom }));
      setMockQuestions((prev) => ({ ...prev, [roomId]: questions }));

      // Set as current user and room
      setGameState((prev) => ({
        ...prev,
        currentUser: newRoom.players[userId],
        currentRoom: newRoom,
        questions,
      }));

      toast({
        title: "Room created successfully",
        description: `Room code: ${roomId}`,
      });

      return roomId;
    } catch (err) {
      console.error("Error creating room:", err);
      setError("Failed to create room");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Join an existing room
  const joinRoom = (roomId: string, username: string): void => {
    try {
      setLoading(true);

      const room = mockRooms[roomId];
      if (!room) {
        throw new Error("Room not found");
      }

      if (room.status === "in-progress") {
        throw new Error("Game already in progress");
      }

      if (Object.keys(room.players || {}).length >= room.maxPlayers) {
        throw new Error("Room is full");
      }

      const userId = `user-${uuidv4()}`;
      const newPlayer = {
        id: userId,
        username,
        isReady: false,
        score: 0,
      };

      // Update room with new player
      const updatedRoom = {
        ...room,
        players: {
          ...room.players,
          [userId]: newPlayer,
        },
        playerCount: Object.keys(room.players).length + 1,
      };

      setMockRooms((prev) => ({
        ...prev,
        [roomId]: {
          ...updatedRoom,
          status: updatedRoom.status as
            | "starting"
            | "waiting"
            | "in-progress"
            | "completed",
        },
      }));

      // Set current game state
      setGameState({
        currentUser: newPlayer,
        currentRoom: updatedRoom,
        questions: mockQuestions[roomId] || [],
        currentQuestion: null,
        playerAnswers: [],
        showResults: false,
        timeRemaining: 10,
        isLoading: false,
        error: null,
      });

      navigate(`/room/${roomId}`);
    } catch (err) {
      console.error("Error joining room:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to join room",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Leave current room
  const leaveRoom = (): void => {
    if (!gameState.currentRoom || !gameState.currentUser) return;

    const roomId = gameState.currentRoom.id;
    const userId = gameState.currentUser.id;

    // If host, delete the room
    if (userId === gameState.currentRoom.hostId) {
      const { [roomId]: _, ...remainingRooms } = mockRooms;
      setMockRooms(remainingRooms);
    } else {
      // Remove player from room
      const roomPlayers = { ...gameState.currentRoom.players };
      delete roomPlayers[userId];

      const updatedRoom = {
        ...gameState.currentRoom,
        players: roomPlayers,
        playerCount: Object.keys(roomPlayers).length,
      };

      setMockRooms((prev) => ({
        ...prev,
        [roomId]: {
          ...updatedRoom,
          status: updatedRoom.status as
            | "waiting"
            | "starting"
            | "in-progress"
            | "completed",
        },
      }));
    }

    // Reset game state
    setGameState({
      currentUser: null,
      currentRoom: null,
      questions: [],
      currentQuestion: null,
      playerAnswers: [],
      showResults: false,
      timeRemaining: 10,
      isLoading: false,
      error: null,
    });

    navigate("/");
  };

  // Start the game (host only)
  const startGame = (): void => {
    if (!gameState.currentRoom || !gameState.currentUser) return;
    if (gameState.currentUser.id !== gameState.currentRoom.hostId) return;

    const roomId = gameState.currentRoom.id;
    const updatedRoom = {
      ...gameState.currentRoom,
      status: "starting",
      startTime: Date.now() + 5000,
    };

    setMockRooms((prev) => ({
      ...prev,
      [roomId]: {
        ...updatedRoom,
        status: updatedRoom.status as
          | "waiting"
          | "starting"
          | "in-progress"
          | "completed",
      },
    }));
    setGameState((prev) => ({
      ...prev,
      currentRoom: {
        ...updatedRoom,
        status: updatedRoom.status as
          | "waiting"
          | "starting"
          | "in-progress"
          | "completed",
      },
    }));

    // Simulate countdown
    const countdown = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(countdown);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    // Start game after countdown
    setTimeout(() => {
      const startedRoom = {
        ...updatedRoom,
        status: "in-progress" as "in-progress",
        currentQuestionIndex: 0,
        questionStartTime: Date.now(),
      };

      setMockRooms((prev) => ({ ...prev, [roomId]: startedRoom }));
      setGameState((prev) => ({
        ...prev,
        currentRoom: {
          ...startedRoom,
          status: "in-progress" as "in-progress",
        },
        currentQuestion: prev.questions[0],
        timeRemaining: 10,
      }));

      // Start question timer
      startQuestionTimer();
    }, 5000);
  };

  // Update player ready status
  const updatePlayerReadyStatus = (isReady: boolean): void => {
    if (!gameState.currentRoom || !gameState.currentUser) return;

    const roomId = gameState.currentRoom.id;
    const userId = gameState.currentUser.id;

    const updatedRoom = {
      ...gameState.currentRoom,
      players: {
        ...gameState.currentRoom.players,
        [userId]: {
          ...gameState.currentRoom.players[userId],
          isReady,
        },
      },
    };

    setMockRooms((prev) => ({ ...prev, [roomId]: updatedRoom }));
    setGameState((prev) => ({ ...prev, currentRoom: updatedRoom }));
  };

  // Submit answer to current question
  const submitAnswer = (questionId: string, selectedOption: number): void => {
    if (
      !gameState.currentRoom ||
      !gameState.currentUser ||
      !gameState.currentQuestion
    )
      return;

    const roomId = gameState.currentRoom.id;
    const userId = gameState.currentUser.id;
    const isCorrect =
      selectedOption === gameState.currentQuestion.correctOption;

    // Calculate score (simplified)
    const scoreToAdd = isCorrect ? 100 : 0;

    const updatedPlayer = {
      ...gameState.currentRoom.players[userId],
      score: (gameState.currentRoom.players[userId].score || 0) + scoreToAdd,
      lastAnswerCorrect: isCorrect,
      currentQuestionAnswered: true,
    };

    const updatedRoom = {
      ...gameState.currentRoom,
      players: {
        ...gameState.currentRoom.players,
        [userId]: updatedPlayer,
      },
    };

    // Update state
    setMockRooms((prev) => ({ ...prev, [roomId]: updatedRoom }));
    setGameState((prev) => ({
      ...prev,
      currentRoom: updatedRoom,
      currentUser: updatedPlayer,
      playerAnswers: [
        ...prev.playerAnswers,
        {
          userId,
          questionId,
          selectedOption,
          isCorrect,
          timeToAnswer: 10000 - timeRemaining * 1000,
        },
      ],
    }));

    // If host, check if all players answered
    if (userId === gameState.currentRoom.hostId) {
      checkAllPlayersAnswered();
    }
  };

  // Check if all players answered (host only)
  const checkAllPlayersAnswered = (): void => {
    if (!gameState.currentRoom) return;

    const allAnswered = Object.values(gameState.currentRoom.players).every(
      (player) => player.currentQuestionAnswered
    );

    if (allAnswered) {
      setTimeout(() => {
        const currentIndex = gameState.currentRoom?.currentQuestionIndex || 0;
        const nextIndex = currentIndex + 1;
        const questions = gameState.questions;

        if (nextIndex < questions.length) {
          // Move to next question
          const updatedRoom = {
            ...gameState.currentRoom,
            currentQuestionIndex: nextIndex,
            questionStartTime: Date.now(),
          };

          // Reset answered status for all players
          Object.keys(updatedRoom.players).forEach((playerId) => {
            updatedRoom.players[playerId].currentQuestionAnswered = false;
          });

          setMockRooms((prev) => ({ ...prev, [updatedRoom.id]: updatedRoom }));
          setGameState((prev) => ({
            ...prev,
            currentRoom: updatedRoom,
            currentQuestion: questions[nextIndex],
            timeRemaining: 10,
          }));

          // Start timer for next question
          startQuestionTimer();
        } else {
          // End of quiz
          const completedRoom = {
            ...gameState.currentRoom,
            status: "completed",
          };

          setMockRooms((prev) => ({
            ...prev,
            [completedRoom.id]: completedRoom as Room,
          }));
          setGameState((prev) => ({
            ...prev,
            currentRoom: {
              ...completedRoom,
              status: "completed",
            },
            showResults: true,
          }));
        }
      }, 3000);
    }
  };

  // Get list of available rooms
  const getRooms = (): Room[] => {
    return Object.values(mockRooms).filter(
      (room) => room.status === "waiting" && !room.isPrivate
    );
  };

  // Start question timer
  const startQuestionTimer = () => {
    if (timer) clearInterval(timer);

    setTimeRemaining(10);
    const newTimer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(newTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimer(newTimer);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  const contextValue: QuizContextProps = {
    gameState,
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    updatePlayerReadyStatus,
    submitAnswer,
    getRooms,
    timeRemaining,
    loading,
    error,
  };

  return (
    <QuizContext.Provider value={contextValue}>{children}</QuizContext.Provider>
  );
};
// In QuizContext.tsx
const createRoom = (
  roomName: string,
  isPrivate: boolean,
  category: string,
  maxPlayers: number
): string => {
  const roomId = uuidv4().substring(0, 6).toUpperCase();
  const userId = `user-${uuidv4()}`;
  const questions = getQuestionsByCategory(category);

  const newRoom: Room = {
    id: roomId,
    name: roomName,
    hostId: userId,
    isPrivate,
    status: "waiting",
    playerCount: 1,
    maxPlayers,
    players: {
      [userId]: {
        id: userId,
        username: "Host", // Temporary, will be updated in joinRoom
        isReady: true,
        score: 0,
      },
    },
    category,
  };

  // Store both room and questions
  setMockRooms((prev) => ({ ...prev, [roomId]: newRoom }));
  setMockQuestions((prev) => ({ ...prev, [roomId]: questions }));

  return roomId;
};

const joinRoom = (roomId: string, username: string): void => {
  const room = mockRooms[roomId];
  if (!room) {
    throw new Error("Room not found");
  }

  const userId = `user-${uuidv4()}`;
  const newPlayer = {
    id: userId,
    username,
    isReady: false,
    score: 0,
  };

  const updatedRoom = {
    ...room,
    players: {
      ...room.players,
      [userId]: newPlayer,
    },
    playerCount: Object.keys(room.players).length + 1,
  };

  setMockRooms((prev) => ({ ...prev, [roomId]: updatedRoom }));
  setGameState({
    currentUser: newPlayer,
    currentRoom: updatedRoom,
    questions: mockQuestions[roomId] || [],
    currentQuestion: null,
    playerAnswers: [],
    showResults: false,
    timeRemaining: 10,
    isLoading: false,
    error: null,
  });

  navigate(`/room/${roomId}`);
};

export default QuizContext;
