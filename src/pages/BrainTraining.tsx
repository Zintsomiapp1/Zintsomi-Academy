
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, Clock, Zap, Eye, Puzzle, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SudokuGame from '@/components/games/SudokuGame';
import IQQuiz from '@/components/games/IQQuiz';
import PuzzleGame from '@/components/games/PuzzleGame';
import EyeTest from '@/components/games/EyeTest';

interface BrainTrainingProps {
  user: { name: string; email: string };
  onBack: () => void;
}

type GameType = 'sudoku' | 'iq-quiz' | 'puzzle' | 'eye-test' | null;

const BrainTraining = ({ user, onBack }: BrainTrainingProps) => {
  const [currentGame, setCurrentGame] = useState<GameType>(null);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [credits, setCredits] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameStarted && timeRemaining > 0 && credits === 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setGameStarted(false);
            setCurrentGame(null);
            toast({
              title: "Time's up!",
              description: "Purchase credits to continue playing brain games.",
              variant: "destructive"
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameStarted, timeRemaining, credits, toast]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const canPlayGame = () => {
    return credits > 0 || timeRemaining > 0;
  };

  const startGame = (gameType: GameType) => {
    if (!canPlayGame()) {
      toast({
        title: "No time or credits remaining",
        description: "Purchase credits to continue playing.",
        variant: "destructive"
      });
      return;
    }

    setCurrentGame(gameType);
    if (credits === 0) {
      setGameStarted(true);
    }
  };

  const buyCredits = () => {
    // Simulate credit purchase - in real app this would integrate with payment
    setCredits(prev => prev + 60); // 60 minutes of gameplay
    toast({
      title: "Credits purchased!",
      description: "You now have 60 minutes of additional gameplay.",
    });
  };

  const games = [
    {
      id: 'sudoku',
      title: 'Sudoku',
      description: 'Classic number puzzle game',
      icon: Calculator,
      component: SudokuGame
    },
    {
      id: 'iq-quiz',
      title: 'IQ Quiz',
      description: 'Test your intelligence',
      icon: Brain,
      component: IQQuiz
    },
    {
      id: 'puzzle',
      title: 'Puzzle Games',
      description: 'Various brain puzzles',
      icon: Puzzle,
      component: PuzzleGame
    },
    {
      id: 'eye-test',
      title: 'Eye Test',
      description: 'Visual perception challenges',
      icon: Eye,
      component: EyeTest
    }
  ];

  if (currentGame) {
    const GameComponent = games.find(g => g.id === currentGame)?.component;
    if (GameComponent) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <Button onClick={() => setCurrentGame(null)} variant="outline">
                ← Back to Games
              </Button>
              <div className="flex items-center gap-4">
                {credits === 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Free time: {formatTime(timeRemaining)}</span>
                  </div>
                )}
                {credits > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4" />
                    <span>Credits: {Math.floor(credits / 60)}h {credits % 60}m</span>
                  </div>
                )}
              </div>
            </div>
            <GameComponent />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button onClick={onBack} variant="outline">
            ← Back to Dashboard
          </Button>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-gray-900">Brain Training</h1>
            <p className="text-gray-600">Welcome, {user.name}!</p>
          </div>
        </div>

        {/* Time and Credits Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Game Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Free Time Remaining</h3>
                <div className="flex items-center gap-2">
                  <Progress value={(timeRemaining / 600) * 100} className="flex-1" />
                  <span className="text-sm font-medium">{formatTime(timeRemaining)}</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Credits</h3>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>{Math.floor(credits / 60)}h {credits % 60}m</span>
                </div>
              </div>
              <div>
                <Button 
                  onClick={buyCredits}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                >
                  Buy More Credits
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game) => (
            <Card 
              key={game.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => startGame(game.id as GameType)}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <game.icon className="w-12 h-12 text-purple-600" />
                </div>
                <CardTitle className="text-lg">{game.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center mb-4">{game.description}</p>
                <Button 
                  className="w-full"
                  disabled={!canPlayGame()}
                  variant={canPlayGame() ? "default" : "outline"}
                >
                  {canPlayGame() ? "Play Now" : "No Time/Credits"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {!canPlayGame() && (
          <Card className="mt-8 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-orange-800 mb-2">
                  Time's Up!
                </h3>
                <p className="text-orange-700 mb-4">
                  You've used your free 10 minutes. Purchase credits to continue training your brain!
                </p>
                <Button 
                  onClick={buyCredits}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Buy Credits Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BrainTraining;
