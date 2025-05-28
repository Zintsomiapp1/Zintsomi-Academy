
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, ShoppingCart } from 'lucide-react';

interface GamingTimeDisplayProps {
  timeRemaining: number;
  formatTime: (seconds: number) => string;
  getFreeTimeRemaining: () => number;
  onPurchaseClick: () => void;
}

const GamingTimeDisplay = ({ 
  timeRemaining, 
  formatTime, 
  getFreeTimeRemaining, 
  onPurchaseClick 
}: GamingTimeDisplayProps) => {
  const freeTimeLeft = getFreeTimeRemaining();
  const hasPurchasedTime = timeRemaining > freeTimeLeft;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
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
    </div>
  );
};

export default GamingTimeDisplay;
