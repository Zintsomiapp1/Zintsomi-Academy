
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AcuityTestProps {
  score: number;
  onScoreUpdate: (score: number) => void;
}

const AcuityTest = ({ score, onScoreUpdate }: AcuityTestProps) => {
  const [level, setLevel] = useState(1);
  const [currentLetter, setCurrentLetter] = useState('');
  const [letterOptions, setLetterOptions] = useState<string[]>([]);
  const { toast } = useToast();

  const generateRandomLetter = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[Math.floor(Math.random() * letters.length)];
  };

  useEffect(() => {
    const letter = generateRandomLetter();
    setCurrentLetter(letter);
    
    const options = [letter];
    while (options.length < 4) {
      const newLetter = generateRandomLetter();
      if (!options.includes(newLetter)) {
        options.push(newLetter);
      }
    }
    setLetterOptions(options.sort(() => Math.random() - 0.5));
  }, [level]);

  const handleAnswer = (letter: string) => {
    if (letter === currentLetter) {
      onScoreUpdate(score + 1);
      setLevel(prev => prev + 1);
      toast({
        title: "Correct!",
        description: "Moving to next level",
      });
    } else {
      toast({
        title: "Incorrect",
        description: "Try the next one",
        variant: "destructive"
      });
    }
    
    const newLetter = generateRandomLetter();
    setCurrentLetter(newLetter);
  };

  return (
    <div className="text-center">
      <div className="mb-6">
        <div
          className="inline-block font-mono font-bold border-2 border-gray-300 bg-white p-4"
          style={{ fontSize: Math.max(20 - level, 8) + 'px' }}
        >
          {currentLetter}
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-4">Level {level} - Select the letter you see</p>
      <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
        {letterOptions.map((letter, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => handleAnswer(letter)}
          >
            {letter}
          </Button>
        ))}
      </div>
      <p className="text-sm text-gray-500 mt-4">Score: {score}</p>
    </div>
  );
};

export default AcuityTest;
