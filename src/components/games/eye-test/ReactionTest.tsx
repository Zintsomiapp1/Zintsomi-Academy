
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const ReactionTest = () => {
  const [isActive, setIsActive] = useState(false);
  const [reactionStart, setReactionStart] = useState<number | null>(null);
  const [showTarget, setShowTarget] = useState(false);
  const { toast } = useToast();

  const startTest = () => {
    setIsActive(true);
    setShowTarget(false);
    
    const delay = Math.random() * 3000 + 1000; // 1-4 seconds
    setTimeout(() => {
      setShowTarget(true);
      setReactionStart(Date.now());
    }, delay);
  };

  const handleClick = () => {
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

  return (
    <div className="text-center">
      <div className="mb-6">
        <div 
          className={`w-48 h-48 rounded-full mx-auto flex items-center justify-center text-2xl font-bold cursor-pointer transition-all ${
            !isActive ? 'bg-gray-300 text-gray-600' :
            showTarget ? 'bg-red-500 text-white animate-pulse' : 
            'bg-yellow-400 text-gray-800'
          }`}
          onClick={isActive ? handleClick : undefined}
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
        <Button onClick={startTest}>
          Start Reaction Test
        </Button>
      )}
    </div>
  );
};

export default ReactionTest;
