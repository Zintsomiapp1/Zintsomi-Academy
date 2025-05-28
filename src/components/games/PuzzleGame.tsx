
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type PuzzleType = 'sliding' | 'memory' | 'pattern';

const PuzzleGame = () => {
  const [currentPuzzle, setCurrentPuzzle] = useState<PuzzleType>('sliding');
  const [slidingGrid, setSlidingGrid] = useState<(number | null)[]>([]);
  const [memoryCards, setMemoryCards] = useState<{id: number, value: string, flipped: boolean, matched: boolean}[]>([]);
  const [patternSequence, setPatternSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [showPattern, setShowPattern] = useState(false);
  const [moves, setMoves] = useState(0);
  const { toast } = useToast();

  // Sliding Puzzle Logic
  const initializeSlidingPuzzle = () => {
    const numbers = Array.from({ length: 8 }, (_, i) => i + 1);
    numbers.push(null); // Empty space
    
    // Shuffle the array
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    
    setSlidingGrid(numbers);
    setMoves(0);
  };

  const moveTile = (index: number) => {
    const emptyIndex = slidingGrid.findIndex(tile => tile === null);
    const canMove = [
      emptyIndex - 3, // above
      emptyIndex + 3, // below
      emptyIndex - 1, // left (if same row)
      emptyIndex + 1  // right (if same row)
    ].includes(index) && (
      Math.abs(emptyIndex - index) === 3 || // vertical move
      (Math.floor(emptyIndex / 3) === Math.floor(index / 3)) // same row
    );

    if (canMove) {
      const newGrid = [...slidingGrid];
      [newGrid[emptyIndex], newGrid[index]] = [newGrid[index], newGrid[emptyIndex]];
      setSlidingGrid(newGrid);
      setMoves(prev => prev + 1);
      
      // Check if solved
      const isSolved = newGrid.slice(0, 8).every((tile, index) => tile === index + 1);
      if (isSolved) {
        toast({
          title: "Puzzle Solved!",
          description: `Completed in ${moves + 1} moves!`,
        });
      }
    }
  };

  // Memory Card Logic
  const initializeMemoryGame = () => {
    const symbols = ['🎯', '🎨', '🎪', '🎭', '🎸', '🎲', '🎮', '🎺'];
    const cards = [...symbols, ...symbols].map((symbol, index) => ({
      id: index,
      value: symbol,
      flipped: false,
      matched: false
    }));
    
    // Shuffle cards
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    
    setMemoryCards(cards);
  };

  const flipCard = (id: number) => {
    const flippedCards = memoryCards.filter(card => card.flipped && !card.matched);
    if (flippedCards.length >= 2) return;
    
    const newCards = memoryCards.map(card =>
      card.id === id ? { ...card, flipped: true } : card
    );
    setMemoryCards(newCards);
    
    // Check for match after a delay
    setTimeout(() => {
      const currentFlipped = newCards.filter(card => card.flipped && !card.matched);
      if (currentFlipped.length === 2) {
        if (currentFlipped[0].value === currentFlipped[1].value) {
          setMemoryCards(prev => prev.map(card =>
            currentFlipped.some(f => f.id === card.id)
              ? { ...card, matched: true }
              : card
          ));
          toast({
            title: "Match found!",
            description: "Great memory!",
          });
        } else {
          setMemoryCards(prev => prev.map(card =>
            currentFlipped.some(f => f.id === card.id)
              ? { ...card, flipped: false }
              : card
          ));
        }
      }
    }, 1000);
  };

  // Pattern Memory Logic
  const initializePatternGame = () => {
    const newPattern = Array.from({ length: 4 }, () => Math.floor(Math.random() * 4));
    setPatternSequence(newPattern);
    setUserSequence([]);
    setShowPattern(true);
    
    setTimeout(() => setShowPattern(false), 2000);
  };

  const addToUserSequence = (value: number) => {
    const newSequence = [...userSequence, value];
    setUserSequence(newSequence);
    
    if (newSequence.length === patternSequence.length) {
      if (JSON.stringify(newSequence) === JSON.stringify(patternSequence)) {
        toast({
          title: "Pattern matched!",
          description: "Excellent memory!",
        });
        setTimeout(initializePatternGame, 1500);
      } else {
        toast({
          title: "Wrong pattern",
          description: "Try again!",
          variant: "destructive"
        });
        setUserSequence([]);
      }
    }
  };

  useEffect(() => {
    if (currentPuzzle === 'sliding') initializeSlidingPuzzle();
    if (currentPuzzle === 'memory') initializeMemoryGame();
    if (currentPuzzle === 'pattern') initializePatternGame();
  }, [currentPuzzle]);

  const renderSlidingPuzzle = () => (
    <div>
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-4">
        {slidingGrid.map((tile, index) => (
          <button
            key={index}
            className={`
              w-20 h-20 text-xl font-bold border-2 rounded-lg
              ${tile === null 
                ? 'bg-gray-100 border-gray-300' 
                : 'bg-blue-500 text-white border-blue-600 hover:bg-blue-600'
              }
            `}
            onClick={() => moveTile(index)}
            disabled={tile === null}
          >
            {tile}
          </button>
        ))}
      </div>
      <p className="text-center text-gray-600">Moves: {moves}</p>
      <div className="text-center mt-4">
        <Button onClick={initializeSlidingPuzzle}>New Puzzle</Button>
      </div>
    </div>
  );

  const renderMemoryGame = () => (
    <div>
      <div className="grid grid-cols-4 gap-2 max-w-md mx-auto mb-4">
        {memoryCards.map((card) => (
          <button
            key={card.id}
            className={`
              w-16 h-16 text-2xl border-2 rounded-lg
              ${card.flipped || card.matched
                ? 'bg-white border-blue-500'
                : 'bg-blue-500 border-blue-600 hover:bg-blue-600'
              }
            `}
            onClick={() => flipCard(card.id)}
            disabled={card.flipped || card.matched}
          >
            {card.flipped || card.matched ? card.value : '?'}
          </button>
        ))}
      </div>
      <div className="text-center">
        <Button onClick={initializeMemoryGame}>New Game</Button>
      </div>
    </div>
  );

  const renderPatternGame = () => (
    <div>
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold mb-2">
          {showPattern ? 'Memorize the pattern!' : 'Repeat the pattern'}
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto mb-4">
        {[0, 1, 2, 3].map((value) => (
          <button
            key={value}
            className={`
              w-20 h-20 rounded-lg border-2 font-bold text-xl
              ${showPattern && patternSequence.includes(value)
                ? 'bg-yellow-400 border-yellow-500'
                : 'bg-gray-200 border-gray-300 hover:bg-gray-300'
              }
            `}
            onClick={() => !showPattern && addToUserSequence(value)}
            disabled={showPattern}
          >
            {value + 1}
          </button>
        ))}
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          Progress: {userSequence.length}/{patternSequence.length}
        </p>
        <Button onClick={initializePatternGame}>New Pattern</Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Puzzle Games</CardTitle>
          <div className="flex justify-center gap-2">
            {(['sliding', 'memory', 'pattern'] as const).map((type) => (
              <Button
                key={type}
                variant={currentPuzzle === type ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPuzzle(type)}
              >
                {type === 'sliding' && 'Sliding'}
                {type === 'memory' && 'Memory'}
                {type === 'pattern' && 'Pattern'}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {currentPuzzle === 'sliding' && renderSlidingPuzzle()}
          {currentPuzzle === 'memory' && renderMemoryGame()}
          {currentPuzzle === 'pattern' && renderPatternGame()}
        </CardContent>
      </Card>
    </div>
  );
};

export default PuzzleGame;
