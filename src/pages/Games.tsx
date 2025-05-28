
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import KhaluluOwl from '@/components/KhaluluOwl';
import { 
  Grid2x2, 
  Square, 
  Triangle, 
  Circle, 
  MemoryStick, 
  Snake, 
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
      icon: Snake,
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
    // Placeholder for future game implementation
    console.log(`Playing game: ${gameId}`);
    alert(`${games.find(g => g.id === gameId)?.title} coming soon!`);
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
              message="Ready to challenge your brain? Pick a game and let's have some fun learning together! 🎯"
              className="transform lg:scale-90"
            />
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game) => {
            const IconComponent = game.icon;
            return (
              <Card
                key={game.id}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300">
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
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {game.description}
                  </p>
                  <Button
                    onClick={() => handlePlayGame(game.id)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2 rounded-lg transition-all duration-300 group-hover:scale-105"
                  >
                    Play Now
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

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
