// src/pages/QuizRoom.tsx
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";
import QuizQuestion from "../components/QuizQuestion";
import Leaderboard from "../components/Leaderboard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const QuizRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    gameState,
    leaveRoom,
    startGame,
    submitAnswer,
    updatePlayerReadyStatus,
    timeRemaining,
  } = useQuiz();

  useEffect(() => {
    if (
      !roomId ||
      !gameState.currentRoom ||
      gameState.currentRoom.id !== roomId
    ) {
      toast({
        title: "Room not found",
        description: "The room you're trying to access doesn't exist",
        variant: "destructive",
      });
      navigate("/browse");
    }
  }, [roomId, gameState.currentRoom, navigate, toast]);

  if (!gameState.currentRoom || gameState.currentRoom.id !== roomId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin mr-2" size={24} />
        <span>Loading room...</span>
      </div>
    );
  }

  const handleAnswerSelect = (optionIndex: number) => {
    if (gameState.currentQuestion) {
      submitAnswer(gameState.currentQuestion.id, optionIndex);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-neon-purple">
              {gameState.currentRoom.name}
            </h1>
            <Button variant="destructive" onClick={leaveRoom}>
              Leave Room
            </Button>
          </div>

          {gameState.currentRoom.status === "waiting" && (
            <div className="text-center py-20">
              <h2 className="text-xl font-semibold mb-4">
                Waiting for host to start the game
              </h2>
              <div className="flex justify-center gap-4">
                <Button
                  className="neon-button"
                  onClick={() =>
                    updatePlayerReadyStatus(!gameState.currentUser?.isReady)
                  }
                >
                  {gameState.currentUser?.isReady ? "Not Ready" : "Ready"}
                </Button>
                {gameState.currentUser?.id === gameState.currentRoom.hostId && (
                  <Button className="neon-button" onClick={startGame}>
                    Start Game
                  </Button>
                )}
              </div>
            </div>
          )}

          {gameState.currentRoom.status === "starting" && (
            <div className="text-center py-20">
              <h2 className="text-3xl font-bold text-neon-purple mb-4">
                Game starting in {timeRemaining}...
              </h2>
            </div>
          )}

          {gameState.currentRoom.status === "in-progress" &&
            gameState.currentQuestion && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <QuizQuestion
                    question={gameState.currentQuestion}
                    selectedOption={null}
                    onSelectOption={handleAnswerSelect}
                    showCorrectAnswer={false}
                    isAnswered={false}
                    timeRemaining={timeRemaining}
                  />
                </div>
                <div>
                  <Leaderboard
                    players={gameState.currentRoom.players}
                    showDeltas={true}
                  />
                </div>
              </div>
            )}

          {gameState.currentRoom.status === "completed" && (
            <div className="text-center py-20">
              <h2 className="text-3xl font-bold text-neon-purple mb-8">
                Quiz Completed!
              </h2>
              <div className="max-w-md mx-auto">
                <Leaderboard
                  players={gameState.currentRoom.players}
                  showDeltas={false}
                />
              </div>
              <Button className="mt-8 neon-button" onClick={leaveRoom}>
                Return to Lobby
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizRoom;
