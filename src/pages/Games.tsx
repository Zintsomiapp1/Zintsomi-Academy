
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Puzzle, Eye, Brain, Target, Timer } from 'lucide-react';
import SudokuGame from '@/components/games/SudokuGame';
import EyeTest from '@/components/games/EyeTest';
import IQQuiz from '@/components/games/IQQuiz';

type GameType = 'sudoku' | 'eye-test' | 'iq-quiz' | null;

const Games = () => {
  const [currentGame, setCurrentGame] = useState<GameType>(null);

  const gameCategories = [
    {
      title: 'Puzzle Games',
      description: 'Challenge your problem-solving skills',
      icon: Puzzle,
      games: ['Sudoku', 'Word Puzzles', 'Logic Grid'],
      color: 'bg-blue-500',
      gameId: 'sudoku' as GameType
    },
    {
      title: 'Eye Tests',
      description: 'Test and improve your visual acuity',
      icon: Eye,
      games: ['Visual Acuity', 'Color Blind Test', 'Reaction Time'],
      color: 'bg-green-500',
      gameId: 'eye-test' as GameType
    },
    {
      title: 'IQ Challenges',
      description: 'Test your cognitive abilities',
      icon: Brain,
      games: ['Pattern Recognition', 'Number Sequences', 'Spatial Reasoning'],
      color: 'bg-purple-500',
      gameId: 'iq-quiz' as GameType
    },
    {
      title: 'Memory Games',
      description: 'Enhance your memory skills',
      icon: Target,
      games: ['Memory Match', 'Sequence Memory', 'Visual Memory'],
      color: 'bg-orange-500',
      gameId: null
    }
  ];

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
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enhance your cognitive abilities through fun and engaging games
          </p>
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
                  <Button 
                    className="w-full" 
                    onClick={() => category.gameId && setCurrentGame(category.gameId)}
                    disabled={!category.gameId}
                  >
                    {category.gameId ? 'Play Games' : 'Coming Soon'}
                  </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => setCurrentGame('sudoku')}
              >
                <Puzzle className="w-6 h-6" />
                <span>Quick Sudoku</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => setCurrentGame('eye-test')}
              >
                <Eye className="w-6 h-6" />
                <span>Eye Test</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => setCurrentGame('iq-quiz')}
              >
                <Brain className="w-6 h-6" />
                <span>IQ Quiz</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Games;
