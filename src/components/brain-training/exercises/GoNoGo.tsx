
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, RotateCcw } from 'lucide-react';

interface GoNoGoProps {
  onBack: () => void;
}

const GoNoGo = ({ onBack }: GoNoGoProps) => {
  const [gameState, setGameState] = useState<'waiting' | 'ready' | 'stimulus' | 'finished'>('waiting');
  const [currentStimulus, setCurrentStimulus] = useState<'go' | 'nogo' | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [round, setRound] = useState(1);
  const [totalRounds] = useState(20);
  const [responded, setResponded] = useState(false);
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState === 'stimulus' && !responded) {
        if (event.key === ' ') {
          handleResponse();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, responded]);

  const startGame = () => {
    setGameState('ready');
    setScore({ correct: 0, total: 0 });
    setRound(1);
    setTimeout(() => showStimulus(), 2000 + Math.random() * 2000);
  };

  const showStimulus = () => {
    // 70% go signals, 30% no-go signals
    const isGo = Math.random() < 0.7;
    setCurrentStimulus(isGo ? 'go' : 'nogo');
    setGameState('stimulus');
    setResponded(false);
    setFeedback('');

    // Auto-advance after 1.5 seconds
    setTimeout(() => {
      if (!responded) {
        handleNoResponse();
      }
    }, 1500);
  };

  const handleResponse = () => {
    if (responded) return;
    
    setResponded(true);
    const newScore = { ...score, total: score.total + 1 };

    if (currentStimulus === 'go') {
      newScore.correct = score.correct + 1;
      setFeedback('Correct!');
    } else {
      setFeedback('Oops! Should not respond to red.');
    }

    setScore(newScore);
    advanceRound();
  };

  const handleNoResponse = () => {
    if (responded) return;

    const newScore = { ...score, total: score.total + 1 };

    if (currentStimulus === 'nogo') {
      newScore.correct = score.correct + 1;
      setFeedback('Correct! No response needed.');
    } else {
      setFeedback('Missed! Should respond to green.');
    }

    setScore(newScore);
    advanceRound();
  };

  const handleButtonClick = () => {
    if (gameState === 'stimulus' && !responded) {
      handleResponse();
    }
  };

  const advanceRound = () => {
    setTimeout(() => {
      if (round >= totalRounds) {
        setGameState('finished');
      } else {
        setRound(round + 1);
        setGameState('ready');
        setTimeout(() => showStimulus(), 1000 + Math.random() * 2000);
      }
    }, 1000);
  };

  const calculateAccuracy = () => {
    return score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
  };

  const resetGame = () => {
    setGameState('waiting');
    setScore({ correct: 0, total: 0 });
    setRound(1);
    setCurrentStimulus(null);
    setFeedback('');
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
              Go/No-Go Test
            </CardTitle>
            <p className="text-gray-600">
              Press spacebar or click for green signals, withhold response for red signals
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {gameState === 'waiting' && (
              <div className="text-center space-y-4">
                <div className="space-y-4">
                  <p className="text-lg">Instructions:</p>
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-500 rounded-lg mx-auto mb-2" />
                      <p className="text-sm font-medium">GO Signal</p>
                      <p className="text-xs text-gray-600">Press spacebar or click</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-red-500 rounded-lg mx-auto mb-2" />
                      <p className="text-sm font-medium">NO-GO Signal</p>
                      <p className="text-xs text-gray-600">Do nothing</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">React quickly but accurately!</p>
                </div>
                <Button onClick={startGame} size="lg">
                  Start Exercise
                </Button>
              </div>
            )}

            {gameState === 'ready' && (
              <div className="text-center space-y-4">
                <div className="text-lg">Round {round}/{totalRounds}</div>
                <div className="text-sm">Score: {score.correct}/{score.total}</div>
                <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                  <span className="text-gray-500">Get Ready...</span>
                </div>
              </div>
            )}

            {gameState === 'stimulus' && currentStimulus && (
              <div className="text-center space-y-4">
                <div className="text-lg">Round {round}/{totalRounds}</div>
                <div className="text-sm">Score: {score.correct}/{score.total}</div>
                <div 
                  className={`w-32 h-32 ${
                    currentStimulus === 'go' ? 'bg-green-500' : 'bg-red-500'
                  } rounded-lg mx-auto cursor-pointer transition-colors`}
                  onClick={handleButtonClick}
                />
                {feedback && (
                  <div className={`text-lg font-medium ${
                    feedback.includes('Correct') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {feedback}
                  </div>
                )}
                <Button 
                  size="lg"
                  onClick={handleButtonClick}
                  disabled={responded}
                >
                  Respond (Spacebar)
                </Button>
              </div>
            )}

            {gameState === 'finished' && (
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold">Exercise Complete!</h3>
                <div className="space-y-2">
                  <p className="text-lg">Accuracy: {calculateAccuracy()}%</p>
                  <p className="text-sm text-gray-600">
                    {score.correct} correct out of {score.total} trials
                  </p>
                  <p className="text-sm text-gray-600">
                    {calculateAccuracy() >= 80 ? 'Excellent control!' : 
                     calculateAccuracy() >= 60 ? 'Good performance!' : 'Keep practicing!'}
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

export default GoNoGo;
