
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type TestType = 'acuity' | 'color' | 'reaction';

const EyeTest = () => {
  const [currentTest, setCurrentTest] = useState<TestType>('acuity');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [reactionStart, setReactionStart] = useState<number | null>(null);
  const [showTarget, setShowTarget] = useState(false);
  const { toast } = useToast();

  // Visual Acuity Test
  const generateRandomLetter = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[Math.floor(Math.random() * letters.length)];
  };

  const [currentLetter, setCurrentLetter] = useState(generateRandomLetter());
  const [letterOptions, setLetterOptions] = useState<string[]>([]);

  useEffect(() => {
    const options = [currentLetter];
    while (options.length < 4) {
      const letter = generateRandomLetter();
      if (!options.includes(letter)) {
        options.push(letter);
      }
    }
    setLetterOptions(options.sort(() => Math.random() - 0.5));
  }, [currentLetter, level]);

  // Color Blind Test
  const colorTests = [
    { number: '8', colors: ['#ff0000', '#00ff00'], background: '#888888' },
    { number: '3', colors: ['#0000ff', '#ffff00'], background: '#888888' },
    { number: '6', colors: ['#ff00ff', '#00ffff'], background: '#888888' },
  ];

  const [currentColorTest, setCurrentColorTest] = useState(0);

  // Reaction Time Test
  const startReactionTest = () => {
    setIsActive(true);
    setShowTarget(false);
    
    const delay = Math.random() * 3000 + 1000; // 1-4 seconds
    setTimeout(() => {
      setShowTarget(true);
      setReactionStart(Date.now());
    }, delay);
  };

  const handleReactionClick = () => {
    if (!showTarget || !reactionStart) return;
    
    const reactionTime = Date.now() - reactionStart;
    setShowTarget(false);
    setIsActive(false);
    setReactionStart(null);
    
    toast({
      title: "Reaction Time",
      description: `${reactionTime}ms - ${reactionTime < 250 ? 'Excellent!' : reactionTime < 400 ? 'Good!' : 'Keep practicing!'}`,
    });
  };

  const handleAcuityAnswer = (letter: string) => {
    if (letter === currentLetter) {
      setScore(prev => prev + 1);
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
    setCurrentLetter(generateRandomLetter());
  };

  const handleColorAnswer = (number: string) => {
    const correct = colorTests[currentColorTest].number;
    if (number === correct) {
      setScore(prev => prev + 1);
      toast({
        title: "Correct!",
        description: "Good color vision",
      });
    } else {
      toast({
        title: "Incorrect",
        description: "Consider consulting an eye care professional",
        variant: "destructive"
      });
    }
    setCurrentColorTest(prev => (prev + 1) % colorTests.length);
  };

  const renderAcuityTest = () => (
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
            onClick={() => handleAcuityAnswer(letter)}
          >
            {letter}
          </Button>
        ))}
      </div>
      <p className="text-sm text-gray-500 mt-4">Score: {score}</p>
    </div>
  );

  const renderColorTest = () => {
    const test = colorTests[currentColorTest];
    return (
      <div className="text-center">
        <div className="mb-6">
          <div 
            className="inline-block w-48 h-48 rounded-full relative mx-auto"
            style={{ backgroundColor: test.background }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="text-6xl font-bold opacity-70"
                style={{ 
                  background: `linear-gradient(45deg, ${test.colors[0]}, ${test.colors[1]})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {test.number}
              </div>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">What number do you see?</p>
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          {['8', '3', '6', 'None'].map((option) => (
            <Button
              key={option}
              variant="outline"
              onClick={() => handleColorAnswer(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const renderReactionTest = () => (
    <div className="text-center">
      <div className="mb-6">
        <div 
          className={`w-48 h-48 rounded-full mx-auto flex items-center justify-center text-2xl font-bold cursor-pointer transition-all ${
            !isActive ? 'bg-gray-300 text-gray-600' :
            showTarget ? 'bg-red-500 text-white animate-pulse' : 
            'bg-yellow-400 text-gray-800'
          }`}
          onClick={isActive ? handleReactionClick : undefined}
        >
          {!isActive ? 'Start Test' :
           showTarget ? 'CLICK NOW!' : 
           'Wait...'}
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        {!isActive ? 'Click the circle to start' :
         showTarget ? 'Click as fast as you can!' :
         'Wait for red, then click!'}
      </p>
      {!isActive && (
        <Button onClick={startReactionTest}>
          Start Reaction Test
        </Button>
      )}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Eye Tests</CardTitle>
          <div className="flex justify-center gap-2">
            {(['acuity', 'color', 'reaction'] as const).map((type) => (
              <Button
                key={type}
                variant={currentTest === type ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentTest(type)}
              >
                {type === 'acuity' && 'Visual Acuity'}
                {type === 'color' && 'Color Vision'}
                {type === 'reaction' && 'Reaction Time'}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {currentTest === 'acuity' && renderAcuityTest()}
          {currentTest === 'color' && renderColorTest()}
          {currentTest === 'reaction' && renderReactionTest()}
        </CardContent>
      </Card>
    </div>
  );
};

export default EyeTest;
