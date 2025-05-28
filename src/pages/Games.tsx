import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import KhaluluOwl from '@/components/KhaluluOwl';
import TimePurchaseModal from '@/components/games/TimePurchaseModal';
import GamingTimeDisplay from '@/components/games/GamingTimeDisplay';
import { useGamingTime } from '@/hooks/useGamingTime';
import { useToast } from '@/hooks/use-toast';
import { 
  Grid2x2, 
  Square, 
  Triangle, 
  Circle, 
  MemoryStick, 
  Zap, 
  Puzzle,
  MousePointer,
  TextCursor,
  TextSelect,
  Volume2,
  VolumeX
} from 'lucide-react';

interface Game {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const Games = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const { toast } = useToast();
  
  const {
    totalTimeRemaining,
    isTimeUp,
    isPlaying,
    startPlaying,
    stopPlaying,
    purchaseTime,
    formatTime,
    getFreeTimeRemaining,
  } = useGamingTime();

  const games: Game[] = [
    {
      id: 'tic-tac-toe',
      title: 'Tic Tac Toe',
      description: 'Classic two-player strategy game',
      icon: Grid2x2,
      difficulty: 'Easy'
    },
    {
      id: 'solitaire',
      title: 'Solitaire',
      description: 'Card sorting puzzle',
      icon: Square,
      difficulty: 'Medium'
    },
    {
      id: 'tetris',
      title: 'Tetris (Falling Shapes)',
      description: 'Arrange blocks to clear lines',
      icon: Triangle,
      difficulty: 'Medium'
    },
    {
      id: 'memory-match',
      title: 'Memory Match',
      description: 'Match card pairs',
      icon: MemoryStick,
      difficulty: 'Easy'
    },
    {
      id: 'snake',
      title: 'Snake Game',
      description: 'Eat, grow, don\'t crash',
      icon: Zap,
      difficulty: 'Medium'
    },
    {
      id: '2048',
      title: '2048',
      description: 'Slide numbers to combine into 2048',
      icon: Square,
      difficulty: 'Hard'
    },
    {
      id: 'simon-says',
      title: 'Simon Says',
      description: 'Color sequence memory',
      icon: Circle,
      difficulty: 'Medium'
    },
    {
      id: 'letter-dash',
      title: 'Letter Dash',
      description: 'Tap falling letters in order',
      icon: TextCursor,
      difficulty: 'Medium'
    },
    {
      id: 'math-pop',
      title: 'Math Pop',
      description: 'Pop the correct math answers',
      icon: MousePointer,
      difficulty: 'Easy'
    },
    {
      id: 'zulu-scramble',
      title: 'Zulu Word Scramble',
      description: 'Unscramble words in isiZulu',
      icon: TextSelect,
      difficulty: 'Hard'
    },
    {
      id: 'story-puzzle',
      title: 'Story Puzzle',
      description: 'Arrange story pieces in sequence',
      icon: Puzzle,
      difficulty: 'Medium'
    },
    {
      id: 'khalulu-says',
      title: 'Khalulu Says',
      description: 'Fun Simon Says with Khalulu\'s voice',
      icon: Circle,
      difficulty: 'Easy'
    }
  ];

  const handlePlayGame = (gameId: string) => {
    if (totalTimeRemaining <= 0) {
      setShowPurchaseModal(true);
      return;
    }

    console.log(`Playing game: ${gameId}`);
    startPlaying();
    
    toast({
      title: "Game Started!",
      description: `Playing ${games.find(g => g.id === gameId)?.title}. Time remaining: ${formatTime(totalTimeRemaining)}`,
    });
    
    // Simulate game ending after some time (for demo purposes)
    setTimeout(() => {
      stopPlaying();
      if (totalTimeRemaining <= 60) { // Less than 1 minute left
        toast({
          title: "Low Time Warning",
          description: "You have less than 1 minute of gaming time left!",
          variant: "destructive"
        });
      }
    }, 5000); // Stop after 5 seconds for demo
  };

  const handlePurchaseTime = () => {
    purchaseTime();
    setShowPurchaseModal(false);
    toast({
      title: "Purchase Successful!",
      description: "You've purchased 60 minutes of gaming time for R20!",
    });
  };

  const handlePurchaseClick = () => {
    setShowPurchaseModal(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-start justify-between mb-8 gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎮 Zintsomi Arcade
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Challenge your mind with our collection of educational games! 
              Learn while you play and have fun expanding your knowledge.
            </p>
            
            {/* Gaming Time Display */}
            <div className="mb-6">
              <GamingTimeDisplay
                timeRemaining={totalTimeRemaining}
                formatTime={formatTime}
                getFreeTimeRemaining={getFreeTimeRemaining}
                onPurchaseClick={handlePurchaseClick}
              />
            </div>
            
            {/* Sound Toggle */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="flex items-center gap-2"
              >
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
                Sound {soundEnabled ? 'On' : 'Off'}
              </Button>
            </div>
          </div>

          {/* Khalulu Mascot */}
          <div className="lg:w-80">
            <KhaluluOwl 
              message={
                totalTimeRemaining > 0 
                  ? "Ready to challenge your brain? Pick a game and let's have some fun learning together! 🎯" 
                  : "Oops! Looks like you're out of gaming time. Purchase more time to continue your learning adventure! 💫"
              }
              className="transform lg:scale-90"
            />
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game) => {
            const IconComponent = game.icon;
            const canPlay = totalTimeRemaining > 0;
            
            return (
              <Card
                key={game.id}
                className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg ${
                  !canPlay ? 'opacity-60' : ''
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300 ${
                      !canPlay ? 'opacity-50' : ''
                    }`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                      {game.difficulty}
                    </span>
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {game.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm mb-4 overflow-hidden" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {game.description}
                  </p>
                  <Button
                    onClick={() => handlePlayGame(game.id)}
                    className={`w-full font-medium py-2 rounded-lg transition-all duration-300 group-hover:scale-105 ${
                      canPlay 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed hover:bg-gray-300'
                    }`}
                    disabled={!canPlay}
                  >
                    {canPlay ? 'Play Now' : 'Time Expired'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Time Purchase Modal */}
        <TimePurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          onPurchase={handlePurchaseTime}
          timeRemaining={totalTimeRemaining}
          formatTime={formatTime}
        />

        {/* Footer Section */}
        <div className="mt-12 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              More Games Coming Soon! 🚀
            </h3>
            <p className="text-gray-600">
              We're constantly adding new educational games to make learning even more fun. 
              Stay tuned for updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games;
