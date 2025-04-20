
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuiz } from '../context/QuizContext';
import Navbar from '../components/Navbar';
import RoomCard from '../components/RoomCard';
import { Room } from '../types';
import { motion } from 'framer-motion';
import { Loader, Search } from 'lucide-react';

const BrowseRooms = () => {
  const navigate = useNavigate();
  const { getRooms, joinRoom } = useQuiz();
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [username, setUsername] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [joinRoomId, setJoinRoomId] = useState<string | null>(null);
  
  // Load rooms
  useEffect(() => {
    const loadRooms = async () => {
      setIsLoading(true);
      const availableRooms = await getRooms();
      setRooms(availableRooms);
      setIsLoading(false);
    };
    
    loadRooms();
    // Refresh every 10 seconds
    const interval = setInterval(loadRooms, 10000);
    
    return () => clearInterval(interval);
  }, [getRooms]);
  
  // Handle room join
  const handleJoinRoom = async (room: Room) => {
    if (!username.trim()) {
      // Focus the username input
      const usernameInput = document.getElementById('username-input');
      if (usernameInput) {
        usernameInput.focus();
      }
      setJoinRoomId(room.id);
      return;
    }
    
    try {
      await joinRoom(room.id, username);
    } catch (err) {
      console.error("Failed to join room:", err);
    }
  };
  
  // Filter rooms by search term
  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 p-6">
        <div className="w-full max-w-5xl mx-auto">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl font-bold mb-2 neon-text">Browse Rooms</h1>
            <p className="text-muted-foreground mb-6">
              Join a public room or create your own
            </p>
            
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    className="neon-input pl-10"
                    placeholder="Search rooms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <Input
                id="username-input"
                className={`neon-input ${joinRoomId ? 'border-neon-pink animate-pulse' : ''}`}
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={15}
              />
              
              <Button 
                className="neon-button"
                onClick={() => navigate('/create')}
              >
                Create Room
              </Button>
            </div>
          </motion.div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader className="animate-spin mr-2" size={24} />
              <span>Loading rooms...</span>
            </div>
          ) : filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room, index) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onJoin={() => handleJoinRoom(room)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground mb-4">No rooms available</p>
              <Button 
                className="neon-button"
                onClick={() => navigate('/create')}
              >
                Create a Room
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BrowseRooms;
