
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, ShoppingCart, Gift } from 'lucide-react';

interface GamingTimeDisplayProps {
  timeRemaining: number;
  formatTime: (seconds: number) => string;
  getFreeTimeRemaining: () => number;
  getTimeUntilReset: () => number;
  onPurchaseClick: () => void;
}

const GamingTimeDisplay = ({ 
  timeRemaining, 
  formatTime, 
  getFreeTimeRemaining, 
  getTimeUntilReset,
  onPurchaseClick 
}: GamingTimeDisplayProps) => {
  const freeTimeLeft = getFreeTimeRemaining();
  const timeUntilReset = getTimeUntilReset();
  const hasPurchasedTime = timeRemaining > freeTimeLeft;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 shadow-lg border border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Gaming Time</h3>
            <div className="text-sm text-gray-600">
              {freeTimeLeft > 0 ? (
                <span>Free time: <span className="font-medium text-green-600">{formatTime(freeTimeLeft)}</span></span>
              ) : (
                <span>Free time: <span className="font-medium text-red-600">Used up</span></span>
              )}
              {hasPurchasedTime && (
                <span className="ml-2">
                  | Purchased: <span className="font-medium text-blue-600">{formatTime(timeRemaining - freeTimeLeft)}</span>
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">
            {formatTime(timeRemaining)}
          </div>
          <Button
            onClick={onPurchaseClick}
            size="sm"
            variant="outline"
            className="mt-1 text-xs"
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            Buy More
          </Button>
        </div>
      </div>
      
      {/* Daily reset info */}
      <div className="bg-white/60 rounded-lg p-3 border border-blue-100">
        <div className="flex items-center gap-2 mb-1">
          <Gift className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium text-gray-700">Daily Free Gaming</span>
        </div>
        <p className="text-xs text-gray-600">
          Get 10 minutes free every day! Next reset in: <span className="font-medium">{formatTime(timeUntilReset)}</span>
        </p>
        <p className="text-xs text-blue-600 mt-1">
          💡 Unused minutes don't carry over - use them or lose them!
        </p>
      </div>
    </div>
  );
};

export default GamingTimeDisplay;
