
import React, { useState } from 'react';
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

  const handleGameStart = (gameId: GameType) => {
    // Skip time check for admins
    if (!isAdmin && gamingTime.totalTimeRemaining <= 0) {
      setShowPurchaseModal(true);
      return;
    }
    setCurrentGame(gameId);
  };

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

        {/* Featured Games - Easy Access */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleGameStart('chess')}>
            <CardContent className="p-6 text-center">
              <Crown className="w-12 h-12 mx-auto mb-3 text-purple-600" />
              <h3 className="font-semibold text-lg mb-2">Chess vs Khalulu</h3>
              <p className="text-sm text-gray-600 mb-4">Strategic board game</p>
              <Button className="w-full">Play Now</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleGameStart('checkers')}>
            <CardContent className="p-6 text-center">
              <Target className="w-12 h-12 mx-auto mb-3 text-red-600" />
              <h3 className="font-semibold text-lg mb-2">Checkers vs Khalulu</h3>
              <p className="text-sm text-gray-600 mb-4">Classic strategy game</p>
              <Button className="w-full">Play Now</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleGameStart('sudoku')}>
            <CardContent className="p-6 text-center">
              <Puzzle className="w-12 h-12 mx-auto mb-3 text-blue-600" />
              <h3 className="font-semibold text-lg mb-2">Sudoku</h3>
              <p className="text-sm text-gray-600 mb-4">Number puzzle challenge</p>
              <Button className="w-full">Play Now</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleGameStart('eye-test')}>
            <CardContent className="p-6 text-center">
              <Eye className="w-12 h-12 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold text-lg mb-2">Eye Test</h3>
              <p className="text-sm text-gray-600 mb-4">Visual acuity test</p>
              <Button className="w-full">Play Now</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleGameStart('iq-quiz')}>
            <CardContent className="p-6 text-center">
              <Brain className="w-12 h-12 mx-auto mb-3 text-orange-600" />
              <h3 className="font-semibold text-lg mb-2">IQ Quiz</h3>
              <p className="text-sm text-gray-600 mb-4">Cognitive challenge</p>
              <Button className="w-full">Play Now</Button>
            </CardContent>
          </Card>
        </div>

        {/* Game Categories - More Detailed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-purple-500 text-white">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">Strategy Games</CardTitle>
                  <p className="text-gray-600 text-sm">Classic board games against AI Khalulu</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => handleGameStart('chess')}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Chess vs Khalulu - Master Strategy
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => handleGameStart('checkers')}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Checkers vs Khalulu - Quick Tactics
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  disabled
                >
                  <Timer className="w-4 h-4 mr-2" />
                  Tic-Tac-Toe - Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-500 text-white">
                  <Puzzle className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">Puzzle Games</CardTitle>
                  <p className="text-gray-600 text-sm">Challenge your problem-solving skills</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => handleGameStart('sudoku')}
                >
                  <Puzzle className="w-4 h-4 mr-2" />
                  Sudoku - Number Logic Puzzle
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  disabled
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Word Puzzles - Coming Soon
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  disabled
                >
                  <Puzzle className="w-4 h-4 mr-2" />
                  Logic Grid - Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-500 text-white">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">Eye Tests</CardTitle>
                  <p className="text-gray-600 text-sm">Test and improve your visual acuity</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => handleGameStart('eye-test')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Visual Acuity Test
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  disabled
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Color Blind Test - Coming Soon
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  disabled
                >
                  <Timer className="w-4 h-4 mr-2" />
                  Reaction Time - Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-orange-500 text-white">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">IQ Challenges</CardTitle>
                  <p className="text-gray-600 text-sm">Test your cognitive abilities</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => handleGameStart('iq-quiz')}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  IQ Pattern Recognition
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  disabled
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Number Sequences - Coming Soon
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  disabled
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Spatial Reasoning - Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
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
