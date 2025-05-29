
import { useState, useEffect } from 'react';

interface GamingTimeState {
  freeTimeUsed: number; // in seconds
  purchasedTime: number; // in seconds
  totalTimeRemaining: number; // in seconds
  isTimeUp: boolean;
}

export const useGamingTime = () => {
  const [gamingTime, setGamingTime] = useState<GamingTimeState>(() => {
    const saved = localStorage.getItem('zintsomi-gaming-time');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        freeTimeUsed: parsed.freeTimeUsed || 0,
        purchasedTime: parsed.purchasedTime || 0,
        totalTimeRemaining: Math.max(0, (600 - (parsed.freeTimeUsed || 0)) + (parsed.purchasedTime || 0)),
        isTimeUp: false,
      };
    }
    return {
      freeTimeUsed: 0,
      purchasedTime: 0,
      totalTimeRemaining: 600, // 10 minutes in seconds
      isTimeUp: false,
    };
  });

  const [isPlaying, setIsPlaying] = useState(false);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('zintsomi-gaming-time', JSON.stringify({
      freeTimeUsed: gamingTime.freeTimeUsed,
      purchasedTime: gamingTime.purchasedTime,
    }));
  }, [gamingTime.freeTimeUsed, gamingTime.purchasedTime]);

  // Timer effect
  useEffect(() => {
    if (!isPlaying || gamingTime.totalTimeRemaining <= 0) return;

    const interval = setInterval(() => {
      setGamingTime(prev => {
        const newFreeTimeUsed = prev.freeTimeUsed < 600 
          ? prev.freeTimeUsed + 1 
          : prev.freeTimeUsed;
        
        const newPurchasedTime = prev.freeTimeUsed >= 600 
          ? Math.max(0, prev.purchasedTime - 1)
          : prev.purchasedTime;

        const newTotalTimeRemaining = Math.max(0, (600 - newFreeTimeUsed) + newPurchasedTime);

        return {
          freeTimeUsed: newFreeTimeUsed,
          purchasedTime: newPurchasedTime,
          totalTimeRemaining: newTotalTimeRemaining,
          isTimeUp: newTotalTimeRemaining <= 0,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, gamingTime.totalTimeRemaining]);

  const startPlaying = () => {
    if (gamingTime.totalTimeRemaining > 0) {
      setIsPlaying(true);
    }
  };

  const stopPlaying = () => {
    setIsPlaying(false);
  };

  const purchaseTime = () => {
    setGamingTime(prev => ({
      ...prev,
      purchasedTime: prev.purchasedTime + 3600, // 60 minutes in seconds
      totalTimeRemaining: prev.totalTimeRemaining + 3600,
      isTimeUp: false,
    }));
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getFreeTimeRemaining = () => {
    return Math.max(0, 600 - gamingTime.freeTimeUsed);
  };

  return {
    ...gamingTime,
    isPlaying,
    startPlaying,
    stopPlaying,
    purchaseTime,
    formatTime,
    getFreeTimeRemaining,
  };
};
