
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Clock, CreditCard } from 'lucide-react';

interface TimePurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => void;
  timeRemaining: number;
  formatTime: (seconds: number) => string;
}

const TimePurchaseModal = ({ 
  isOpen, 
  onClose, 
  onPurchase, 
  timeRemaining, 
  formatTime 
}: TimePurchaseModalProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            Gaming Time Expired!
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <div className="text-center">
              <p className="text-gray-600 mb-2">
                Time remaining: <span className="font-semibold text-red-600">{formatTime(timeRemaining)}</span>
              </p>
              <p className="text-gray-700">
                You've used up your free gaming time! Purchase more time to continue playing.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">60 Minutes Gaming</h4>
                  <p className="text-sm text-gray-600">Unlock 1 hour of unlimited gaming</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">R20</p>
                  <p className="text-xs text-gray-500">South African Rands</p>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            Maybe Later
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onPurchase}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Purchase R20
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TimePurchaseModal;
