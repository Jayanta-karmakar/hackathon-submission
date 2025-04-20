import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useQuiz } from "../context/QuizContext";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import CategorySelector from "../components/CategorySelector";
import { useToast } from "@/hooks/use-toast";

const CreateRoom = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createRoom, joinRoom } = useQuiz();

  const [roomName, setRoomName] = useState("");
  const [username, setUsername] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [category, setCategory] = useState("science");
  const [isCreating, setIsCreating] = useState(false);

  // In CreateRoom.tsx
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomName.trim()) {
      toast({ title: "Room name is required", variant: "destructive" });
      return;
    }

    if (!username.trim()) {
      toast({ title: "Username is required", variant: "destructive" });
      return;
    }

    try {
      setIsCreating(true);

      // 1. First create the room
      const roomCode = createRoom(
        roomName.trim(),
        isPrivate,
        category,
        maxPlayers
      );

      // 2. Then join the room with the username
      joinRoom(roomCode, username.trim());

      toast({
        title: "Room created successfully",
        description: `Room code: ${roomCode}`,
      });

      // 3. Navigate to the room
      navigate(`/room/${roomCode}`);
    } catch (err) {
      console.error("Room creation error:", err);
      toast({
        title: "Error creating room",
        description:
          err instanceof Error ? err.message : "Failed to create room",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <motion.div
          className="w-full max-w-5xl bg-gray-800 rounded-xl border border-neon-purple/30 shadow-lg shadow-neon-purple/10 p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neon-purple">
              Create Quiz Room
            </h1>
            <p className="text-gray-400 mt-2">
              Set up your custom quiz experience
            </p>
          </div>

          <form onSubmit={handleCreateRoom} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Room Settings */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="roomName" className="text-gray-300">
                    Room Name
                  </Label>
                  <Input
                    id="roomName"
                    className="bg-gray-700 border-gray-600 text-white h-12 focus:ring-neon-purple"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Enter room name"
                    maxLength={20}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-300">
                    Your Username
                  </Label>
                  <Input
                    id="username"
                    className="bg-gray-700 border-gray-600 text-white h-12 focus:ring-neon-purple"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    maxLength={15}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg h-16">
                  <div>
                    <Label htmlFor="private-room" className="text-gray-300">
                      Private Room
                    </Label>
                  </div>
                  <Switch
                    id="private-room"
                    checked={isPrivate}
                    onCheckedChange={setIsPrivate}
                    className="data-[state=checked]:bg-neon-purple h-6 w-11"
                  />
                </div>

                <div className="space-y-4 p-4 bg-gray-700/50 rounded-lg">
                  <Label htmlFor="max-players" className="text-gray-300">
                    Max Players:{" "}
                    <span className="text-neon-purple">{maxPlayers}</span>
                  </Label>
                  <Slider
                    id="max-players"
                    min={2}
                    max={10}
                    step={1}
                    value={[maxPlayers]}
                    onValueChange={(value) => setMaxPlayers(value[0])}
                    className="[&>span]:bg-neon-purple"
                  />
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>2</span>
                    <span>10</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Category Selector */}
              <div className="space-y-2">
                <Label className="text-gray-300">Select Category</Label>
                <div className="bg-gray-700/50 rounded-lg p-4 h-full">
                  <CategorySelector
                    selectedCategory={category}
                    onSelectCategory={setCategory}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
                className="mr-4 border-gray-600 text-gray-300 h-11 px-6"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="bg-neon-purple hover:bg-neon-purple/90 text-white h-11 px-8 text-md"
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create Room"}
              </Button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default CreateRoom;
