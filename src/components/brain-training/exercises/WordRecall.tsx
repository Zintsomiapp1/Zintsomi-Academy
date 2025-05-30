
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, RotateCcw } from 'lucide-react';

interface WordRecallProps {
  onBack: () => void;
}

const WordRecall = ({ onBack }: WordRecallProps) => {
  const wordLists = [
    ['apple', 'chair', 'ocean', 'guitar', 'mountain'],
    ['book', 'flower', 'bicycle', 'sunset', 'coffee'],
    ['butterfly', 'rainbow', 'chocolate', 'lighthouse', 'symphony'],
    ['adventure', 'whisper', 'emerald', 'telescope', 'harmony', 'phoenix'],
    ['magnificent', 'serendipity', 'kaleidoscope', 'mysterious', 'enchanted', 'constellation', 'euphoria'],
  ];

  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [userInput, setUserInput] = useState('');
  const [guessedWords, setGuessedWords] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'ready' | 'memorize' | 'input' | 'results'>('ready');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'memorize' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (gameState === 'memorize' && timeLeft === 0) {
      setGameState('input');
    }
    return () => clearTimeout(timer);
  }, [gameState, timeLeft]);

  const startGame = () => {
    const wordList = wordLists[Math.min(level - 1, wordLists.length - 1)];
    setCurrentWords(wordList);
    setGuessedWords([]);
    setUserInput('');
    setGameState('memorize');
    setTimeLeft(10 + level * 2);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const word = userInput.toLowerCase().trim();
    if (word && currentWords.includes(word) && !guessedWords.includes(word)) {
      const newGuessedWords = [...guessedWords, word];
      setGuessedWords(newGuessedWords);
      setScore(score + 10);
      
      if (newGuessedWords.length === currentWords.length) {
        setGameState('results');
        setScore(score + level * 20); // Bonus for completing the level
        setTimeout(() => {
          setLevel(level + 1);
          setGameState('ready');
        }, 2000);
      }
    }
    setUserInput('');
  };

  const finishRecall = () => {
    setGameState('results');
  };

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    setGameState('ready');
    setGuessedWords([]);
    setCurrentWords([]);
    setUserInput('');
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Memory Training
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">Word Recall</CardTitle>
          <div className="flex justify-between items-center">
            <div>Level: {level}</div>
            <div>Score: {score}</div>
            <Button variant="outline" size="sm" onClick={resetGame}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {gameState === 'ready' && (
            <div className="text-center">
              <p className="mb-4">Memorize the words, then type them back</p>
              <Button onClick={startGame}>Start Level {level}</Button>
            </div>
          )}

          {gameState === 'memorize' && (
            <div className="text-center">
              <p className="text-blue-600 font-semibold mb-2">
                Memorize these words! Time: {timeLeft}s
              </p>
              <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
                {currentWords.map((word, index) => (
                  <div key={index} className="bg-blue-100 p-3 rounded-lg font-medium">
                    {word}
                  </div>
                ))}
              </div>
            </div>
          )}

          {gameState === 'input' && (
            <div>
              <p className="text-green-600 font-semibold mb-4 text-center">
                Type the words you remember:
              </p>
              <form onSubmit={handleInputSubmit} className="mb-4">
                <div className="flex gap-2">
                  <Input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type a word..."
                    className="flex-1"
                  />
                  <Button type="submit">Add</Button>
                </div>
              </form>
              
              <div className="mb-4">
                <p className="font-medium mb-2">Remembered words ({guessedWords.length}/{currentWords.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {guessedWords.map((word, index) => (
                    <span key={index} className="bg-green-100 px-3 py-1 rounded-full text-sm">
                      {word}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <Button variant="outline" onClick={finishRecall}>
                  Finish Recall
                </Button>
              </div>
            </div>
          )}

          {gameState === 'results' && (
            <div className="text-center">
              <h3 className="text-lg font-bold mb-4">Results</h3>
              <p className="mb-2">You remembered {guessedWords.length} out of {currentWords.length} words!</p>
              
              <div className="grid grid-cols-1 gap-2 max-w-md mx-auto mb-4">
                {currentWords.map((word, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-lg ${
                      guessedWords.includes(word) ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    {word} {guessedWords.includes(word) ? '✓' : '✗'}
                  </div>
                ))}
              </div>

              {guessedWords.length === currentWords.length && (
                <p className="text-green-600 font-bold">Perfect! Moving to next level...</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WordRecall;
