import { Room } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { motion } from "framer-motion";

// RoomCard.tsx
interface RoomCardProps {
  room: Room;
  onJoin: () => void;
}

const RoomCard = ({ room, onJoin }: RoomCardProps) => {
  return (
    <motion.div className="neon-card">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold mb-1">{room.name}</h3>
          <div className="flex space-x-2 mb-3">
            <Badge
              variant="outline"
              className="bg-secondary/40 border-neon-purple/30"
            >
              {room.category || "Mixed"}
            </Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users size={14} className="mr-1" />
              <span>
                {room.playerCount}/{room.maxPlayers}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Button className="neon-button w-full mt-2" onClick={onJoin}>
        Join Room
      </Button>
    </motion.div>
  );
};

export default RoomCard;
