
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '../components/Navbar';
import { Star, Zap, Users, Award, Globe } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <Users size={24} />,
      title: 'Multiplayer Quiz',
      description: 'Compete with friends in real-time and see who can answer the fastest!'
    },
    {
      icon: <Zap size={24} />,
      title: 'Fast-paced Gameplay',
      description: 'Quick 10-second rounds keep everyone engaged and thinking on their feet.'
    },
    {
      icon: <Globe size={24} />,
      title: 'Diverse Categories',
      description: 'Questions from Science, Pop Culture, History, Technology, and Geography.'
    },
    {
      icon: <Star size={24} />,
      title: 'Points System',
      description: 'Score points based on accuracy and speed - the faster you answer, the more points you earn!'
    },
    {
      icon: <Award size={24} />,
      title: 'Live Leaderboard',
      description: 'Watch the rankings change in real-time as players answer questions.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-4 neon-text">About Neon Quiz</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A fast-paced multiplayer quiz game where knowledge meets speed.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-4 neon-text-pink">How to Play</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Create a private room or join an existing one with friends.
                </p>
                <p className="text-muted-foreground">
                  When everyone is ready, the host can start the quiz.
                </p>
                <p className="text-muted-foreground">
                  Each question has a 10-second timer. The faster you answer correctly, the more points you earn!
                </p>
                <p className="text-muted-foreground">
                  Watch the leaderboard update in real-time as players answer questions.
                </p>
                <p className="text-muted-foreground">
                  At the end of the quiz, see who takes the top spot!
                </p>
              </div>
              <div className="mt-6">
                <Link to="/">
                  <Button className="neon-button">Start Playing</Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              className="order-first md:order-last"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 border border-neon-purple/30 rounded-xl p-8 h-full">
                <h3 className="text-xl font-bold mb-6 neon-text-blue">Game Features</h3>
                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex">
                      <div className="mr-4 text-neon-purple">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
