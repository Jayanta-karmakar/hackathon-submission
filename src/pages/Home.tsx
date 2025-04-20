
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuiz } from '../context/QuizContext';
import { motion } from 'framer-motion';
import { ArrowRight, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useToast } from '@/hooks/use-toast';

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { joinRoom } = useQuiz();
  
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [roomCodeError, setRoomCodeError] = useState('');
  
  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setUsernameError('');
    setRoomCodeError('');
    
    // Validate inputs
    if (!username.trim()) {
      setUsernameError('Username is required');
      return;
    }
    
    if (!roomCode.trim()) {
      setRoomCodeError('Room code is required');
      return;
    }
    
    try {
      await joinRoom(roomCode.trim().toUpperCase(), username.trim());
    } catch (err) {
      toast({
        title: "Error joining room",
        description: err instanceof Error ? err.message : "Failed to join room",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div 
              className="flex flex-col justify-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 neon-text">
                NEON QUIZ CHALLENGE
              </h1>
              
              <p className="text-lg mb-6 text-muted-foreground">
                Test your knowledge against friends in real-time with our neon-themed quiz game!
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-8">
                <Button 
                  className="neon-button"
                  onClick={() => navigate('/create')}
                >
                  Create Room
                </Button>
                
                <Button 
                  variant="outline" 
                  className="bg-transparent border border-neon-purple/50 hover:bg-neon-purple/10 hover:border-neon-purple"
                  onClick={() => navigate('/browse')}
                >
                  <Users size={18} className="mr-2" />
                  Browse Rooms
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              className="neon-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-bold mb-6">Join with Room Code</h2>
              
              <form onSubmit={handleJoinRoom} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium mb-1">
                    Username
                  </label>
                  <Input
                    id="username"
                    className="neon-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    maxLength={15}
                  />
                  {usernameError && <p className="mt-1 text-sm text-red-500">{usernameError}</p>}
                </div>
                
                <div>
                  <label htmlFor="roomCode" className="block text-sm font-medium mb-1">
                    Room Code
                  </label>
                  <Input
                    id="roomCode"
                    className="neon-input uppercase"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    placeholder="Enter 6-digit room code"
                    maxLength={6}
                  />
                  {roomCodeError && <p className="mt-1 text-sm text-red-500">{roomCodeError}</p>}
                </div>
                
                <Button 
                  type="submit" 
                  className="neon-button w-full"
                >
                  Join Room
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
