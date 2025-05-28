
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const ColorTest = () => {
  const [currentColorTest, setCurrentColorTest] = useState(0);
  const { toast } = useToast();

  const colorTests = [
    { number: '8', colors: ['#ff0000', '#00ff00'], background: '#888888' },
    { number: '3', colors: ['#0000ff', '#ffff00'], background: '#888888' },
    { number: '6', colors: ['#ff00ff', '#00ffff'], background: '#888888' },
  ];

  const handleAnswer = (number: string) => {
    const correct = colorTests[currentColorTest].number;
    if (number === correct) {
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
            onClick={() => handleAnswer(option)}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ColorTest;
