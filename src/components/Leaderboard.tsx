
import { User } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Award, Medal } from "lucide-react";

interface LeaderboardProps {
  players: Record<string, User>;
  showDeltas?: boolean;
}

const Leaderboard = ({ players, showDeltas = false }: LeaderboardProps) => {
  // Sort players by score (descending)
  const sortedPlayers = Object.values(players).sort((a, b) => 
    (b.score || 0) - (a.score || 0)
  );
  
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy size={18} className="mr-2 text-yellow-400" />;
      case 1:
        return <Award size={18} className="mr-2 text-gray-300" />;
      case 2:
        return <Medal size={18} className="mr-2 text-amber-700" />;
      default:
        return <span className="w-4 h-4 mr-2 inline-flex items-center justify-center">{index + 1}</span>;
    }
  };
  
  const getBorderColor = (index: number) => {
    switch (index) {
      case 0:
        return "border-yellow-400";
      case 1:
        return "border-gray-300";
      case 2:
        return "border-amber-700";
      default:
        return "border-secondary/50";
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center neon-text">Leaderboard</h2>
      
      <div className="space-y-2">
        <AnimatePresence>
          {sortedPlayers.map((player, index) => (
            <motion.div
              key={player.id}
              className={`leaderboard-item ${getBorderColor(index)}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <div className="flex items-center">
                {getRankIcon(index)}
                <span className="font-medium">{player.username}</span>
                
                {/* Show correct/incorrect indicator */}
                {showDeltas && player.lastAnswerCorrect !== undefined && (
                  <span className={`ml-2 text-sm ${player.lastAnswerCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {player.lastAnswerCorrect ? '✓' : '✗'}
                  </span>
                )}
              </div>
              
              <div className="flex items-center">
                <span className="font-bold text-neon-purple">{player.score || 0}</span>
                
                {/* Show delta animation */}
                {showDeltas && player.lastAnswerCorrect && (
                  <motion.span
                    className="ml-1 text-sm text-green-400"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {player.lastAnswerTime ? `+${Math.round(1000 * (1 - player.lastAnswerTime / 10000))}` : ''}
                  </motion.span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Leaderboard;
