
import { useState, useEffect } from 'react';

interface GamingTimeState {
  freeTimeUsed: number; // in seconds (out of 600 daily)
  purchasedTime: number; // in seconds
  purchasedTimeExpiry: number; // timestamp when purchased time expires
  lastResetDate: string; // date when free time was last reset
  totalTimeRemaining: number; // in seconds
  isTimeUp: boolean;
}

export const useGamingTime = () => {
  const [gamingTime, setGamingTime] = useState<GamingTimeState>(() => {
    const saved = localStorage.getItem('zintsomi-gaming-time');
    const today = new Date().toDateString();
    
    if (saved) {
      const parsed = JSON.parse(saved);
      const isNewDay = parsed.lastResetDate !== today;
      
      // Check if purchased time has expired (30 days)
      const now = Date.now();
      const validPurchasedTime = (parsed.purchasedTimeExpiry && now < parsed.purchasedTimeExpiry) 
        ? parsed.purchasedTime || 0 
        : 0;
      
      return {
        freeTimeUsed: isNewDay ? 0 : (parsed.freeTimeUsed || 0), // Reset if new day
        purchasedTime: validPurchasedTime,
        purchasedTimeExpiry: validPurchasedTime > 0 ? parsed.purchasedTimeExpiry : 0,
        lastResetDate: today,
        totalTimeRemaining: Math.max(0, (600 - (isNewDay ? 0 : (parsed.freeTimeUsed || 0))) + validPurchasedTime),
        isTimeUp: false,
      };
    }
    
    return {
      freeTimeUsed: 0,
      purchasedTime: 0,
      purchasedTimeExpiry: 0,
      lastResetDate: today,
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
      purchasedTimeExpiry: gamingTime.purchasedTimeExpiry,
      lastResetDate: gamingTime.lastResetDate,
    }));
  }, [gamingTime.freeTimeUsed, gamingTime.purchasedTime, gamingTime.purchasedTimeExpiry, gamingTime.lastResetDate]);

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
          ...prev,
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
    const now = Date.now();
    const thirtyDaysFromNow = now + (30 * 24 * 60 * 60 * 1000); // 30 days in milliseconds
    
    setGamingTime(prev => ({
      ...prev,
      purchasedTime: prev.purchasedTime + 3600, // 60 minutes in seconds
      purchasedTimeExpiry: thirtyDaysFromNow,
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

  const getTimeUntilReset = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return Math.floor((tomorrow.getTime() - now.getTime()) / 1000);
  };

  return {
    ...gamingTime,
    isPlaying,
    startPlaying,
    stopPlaying,
    purchaseTime,
    formatTime,
    getFreeTimeRemaining,
    getTimeUntilReset,
  };
};
