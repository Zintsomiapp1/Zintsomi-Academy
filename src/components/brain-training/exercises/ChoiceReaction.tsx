
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, RotateCcw } from 'lucide-react';

interface ChoiceReactionProps {
  onBack: () => void;
}

const ChoiceReaction = ({ onBack }: ChoiceReactionProps) => {
  const [gameState, setGameState] = useState<'waiting' | 'ready' | 'stimulus' | 'finished'>('waiting');
  const [currentStimulus, setCurrentStimulus] = useState<'red' | 'green' | 'blue' | null>(null);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [round, setRound] = useState(1);
  const [totalRounds] = useState(10);

  const stimulusColors = {
    red: { color: 'bg-red-500', key: '1', instruction: 'Press 1' },
    green: { color: 'bg-green-500', key: '2', instruction: 'Press 2' },
    blue: { color: 'bg-blue-500', key: '3', instruction: 'Press 3' },
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState === 'stimulus' && currentStimulus) {
        const expectedKey = stimulusColors[currentStimulus].key;
        if (event.key === expectedKey) {
          handleCorrectResponse();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, currentStimulus]);

  const startGame = () => {
    setGameState('ready');
    setReactionTimes([]);
    setRound(1);
    setTimeout(() => showStimulus(), 2000 + Math.random() * 3000);
  };

  const showStimulus = () => {
    const colors = Object.keys(stimulusColors) as Array<keyof typeof stimulusColors>;
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setCurrentStimulus(randomColor);
    setStartTime(Date.now());
    setGameState('stimulus');
  };

  const handleCorrectResponse = () => {
    const reactionTime = Date.now() - startTime;
    setReactionTimes([...reactionTimes, reactionTime]);
    setCurrentStimulus(null);

    if (round >= totalRounds) {
      setGameState('finished');
    } else {
      setRound(round + 1);
      setGameState('ready');
      setTimeout(() => showStimulus(), 2000 + Math.random() * 3000);
    }
  };

  const handleButtonClick = (color: keyof typeof stimulusColors) => {
    if (gameState === 'stimulus' && currentStimulus === color) {
      handleCorrectResponse();
    }
  };

  const calculateAverage = () => {
    if (reactionTimes.length === 0) return 0;
    return Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length);
  };

  const resetGame = () => {
    setGameState('waiting');
    setReactionTimes([]);
    setRound(1);
    setCurrentStimulus(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reaction Training
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-500 text-white">
                <Clock className="w-6 h-6" />
              </div>
              Choice Reaction Time
            </CardTitle>
            <p className="text-gray-600">
              Respond to colored signals with the correct key or button
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {gameState === 'waiting' && (
              <div className="text-center space-y-4">
                <div className="space-y-2">
                  <p className="text-lg">Instructions:</p>
                  <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                    {Object.entries(stimulusColors).map(([color, config]) => (
                      <div key={color} className="text-center">
                        <div className={`w-16 h-16 ${config.color} rounded-lg mx-auto mb-2`} />
                        <p className="text-sm">{config.instruction}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">Or click the corresponding colored button</p>
                </div>
                <Button onClick={startGame} size="lg">
                  Start Exercise
                </Button>
              </div>
            )}

            {gameState === 'ready' && (
              <div className="text-center space-y-4">
                <div className="text-lg">Round {round}/{totalRounds}</div>
                <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                  <span className="text-gray-500">Get Ready...</span>
                </div>
              </div>
            )}

            {gameState === 'stimulus' && currentStimulus && (
              <div className="text-center space-y-4">
                <div className="text-lg">Round {round}/{totalRounds}</div>
                <div 
                  className={`w-32 h-32 ${stimulusColors[currentStimulus].color} rounded-lg mx-auto cursor-pointer`}
                  onClick={() => handleButtonClick(currentStimulus)}
                />
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  {Object.entries(stimulusColors).map(([color, config]) => (
                    <Button
                      key={color}
                      className={`h-12 ${config.color}`}
                      onClick={() => handleButtonClick(color as keyof typeof stimulusColors)}
                    >
                      {config.key}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {gameState === 'finished' && (
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold">Exercise Complete!</h3>
                <div className="space-y-2">
                  <p className="text-lg">Average Reaction Time: {calculateAverage()}ms</p>
                  <p className="text-sm text-gray-600">
                    Completed {reactionTimes.length} successful reactions
                  </p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button onClick={resetGame}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  <Button variant="outline" onClick={onBack}>
                    Back to Exercises
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChoiceReaction;
