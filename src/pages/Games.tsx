import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Puzzle, Eye, Brain, Target, Timer, Crown, Zap } from 'lucide-react';
import SudokuGame from '@/components/games/SudokuGame';
import EyeTest from '@/components/games/EyeTest';
import IQQuiz from '@/components/games/IQQuiz';
import ChessGame from '@/components/games/ChessGame';
import CheckersGame from '@/components/games/CheckersGame';
import { useGamingTime } from '@/hooks/useGamingTime';
import { useUserRole } from '@/hooks/useUserRole';
import GamingTimeDisplay from '@/components/games/GamingTimeDisplay';
import TimePurchaseModal from '@/components/games/TimePurchaseModal';

type GameType = 'sudoku' | 'eye-test' | 'iq-quiz' | 'chess' | 'checkers' | null;

const Games = () => {
  const [currentGame, setCurrentGame] = useState<GameType>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const gamingTime = useGamingTime();
  const { isAdmin, loading } = useUserRole();

  const gameCategories = [
    {
      title: 'Strategy Games',
      description: 'Classic board games against AI Khalulu',
      icon: Crown,
      games: ['Chess vs Khalulu', 'Checkers vs Khalulu', 'Tic-Tac-Toe'],
      color: 'bg-purple-500',
      gameIds: ['chess', 'checkers'] as GameType[]
    },
    {
      title: 'Puzzle Games',
      description: 'Challenge your problem-solving skills',
      icon: Puzzle,
      games: ['Sudoku', 'Word Puzzles', 'Logic Grid'],
      color: 'bg-blue-500',
      gameIds: ['sudoku'] as GameType[]
    },
    {
      title: 'Eye Tests',
      description: 'Test and improve your visual acuity',
      icon: Eye,
      games: ['Visual Acuity', 'Color Blind Test', 'Reaction Time'],
      color: 'bg-green-500',
      gameIds: ['eye-test'] as GameType[]
    },
    {
      title: 'IQ Challenges',
      description: 'Test your cognitive abilities',
      icon: Brain,
      games: ['Pattern Recognition', 'Number Sequences', 'Spatial Reasoning'],
      color: 'bg-orange-500',
      gameIds: ['iq-quiz'] as GameType[]
    }
  ];

  const handleGameStart = (gameId: GameType) => {
    // Skip time check for admins
    if (!isAdmin && gamingTime.totalTimeRemaining <= 0) {
      setShowPurchaseModal(true);
      return;
    }
    setCurrentGame(gameId);
  };

  useEffect(() => {
    // Only start gaming time for non-admin users and only after admin status is determined
    if (!loading && !isAdmin && gamingTime.totalTimeRemaining > 0) {
      gamingTime.startPlaying();
    }
    
    return () => {
      // Only stop gaming time for non-admin users
      if (!loading && !isAdmin) {
        gamingTime.stopPlaying();
      }
    };
  }, [isAdmin, loading]);

  if (currentGame === 'chess') {
    return <ChessGame onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'checkers') {
    return <CheckersGame onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'sudoku') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Button
          variant="ghost"
          onClick={() => setCurrentGame(null)}
          className="mb-4"
        >
          ← Back to Games
        </Button>
        <SudokuGame />
      </div>
    );
  }

  if (currentGame === 'eye-test') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Button
          variant="ghost"
          onClick={() => setCurrentGame(null)}
          className="mb-4"
        >
          ← Back to Games
        </Button>
        <EyeTest />
      </div>
    );
  }

  if (currentGame === 'iq-quiz') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Button
          variant="ghost"
          onClick={() => setCurrentGame(null)}
          className="mb-4"
        >
          ← Back to Games
        </Button>
        <IQQuiz />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gamepad2 className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Learning Games</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Enhance your cognitive abilities through fun and engaging games
          </p>

          {/* Only show gaming time display for non-admin users */}
          {!isAdmin && !loading && (
            <div className="max-w-2xl mx-auto mb-6">
              <GamingTimeDisplay
                timeRemaining={gamingTime.totalTimeRemaining}
                formatTime={gamingTime.formatTime}
                getFreeTimeRemaining={gamingTime.getFreeTimeRemaining}
                getTimeUntilReset={gamingTime.getTimeUntilReset}
                onPurchaseClick={() => setShowPurchaseModal(true)}
              />
            </div>
          )}

          {/* Show admin indicator */}
          {isAdmin && !loading && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 max-w-2xl mx-auto mb-6 shadow-lg border border-purple-200">
              <div className="flex items-center justify-center gap-2">
                <Crown className="h-5 w-5 text-purple-600" />
                <span className="font-semibold text-purple-800">Admin Mode - Unlimited Gaming Time</span>
              </div>
            </div>
          )}

          {/* Gaming Advertisement */}
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6 max-w-4xl mx-auto border border-green-200">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Zap className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Free Daily Gaming!</h2>
            </div>
            <p className="text-gray-700 mb-2">
              🎮 Get <span className="font-bold text-green-600">10 minutes free</span> every day to play all our games!
            </p>
            <p className="text-sm text-gray-600">
              Want more time? Purchase 1 hour for just <span className="font-bold text-blue-600">R25</span> - valid for 30 days!
            </p>
          </div>
        </div>

        {/* Game Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {gameCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${category.color} text-white`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                      <p className="text-gray-600 text-sm">{category.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {category.games.map((game, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-sm text-gray-700">{game}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {category.gameIds.map((gameId, idx) => (
                      <Button 
                        key={idx}
                        className="w-full" 
                        onClick={() => handleGameStart(gameId)}
                        disabled={gameId === null}
                      >
                        {gameId === 'chess' && 'Play Chess vs Khalulu'}
                        {gameId === 'checkers' && 'Play Checkers vs Khalulu'}
                        {gameId === 'sudoku' && 'Play Sudoku'}
                        {gameId === 'eye-test' && 'Start Eye Test'}
                        {gameId === 'iq-quiz' && 'Take IQ Quiz'}
                        {gameId === null && 'Coming Soon'}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Play Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="w-5 h-5" />
              Quick Play
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => handleGameStart('chess')}
              >
                <Crown className="w-6 h-6" />
                <span>Chess</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => handleGameStart('checkers')}
              >
                <Target className="w-6 h-6" />
                <span>Checkers</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => handleGameStart('sudoku')}
              >
                <Puzzle className="w-6 h-6" />
                <span>Sudoku</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => handleGameStart('eye-test')}
              >
                <Eye className="w-6 h-6" />
                <span>Eye Test</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => handleGameStart('iq-quiz')}
              >
                <Brain className="w-6 h-6" />
                <span>IQ Quiz</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Only show purchase modal for non-admin users */}
      {!isAdmin && !loading && (
        <TimePurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          onPurchase={() => {
            gamingTime.purchaseTime();
            setShowPurchaseModal(false);
          }}
          timeRemaining={gamingTime.totalTimeRemaining}
          formatTime={gamingTime.formatTime}
        />
      )}
    </div>
  );
};

export default Games;
