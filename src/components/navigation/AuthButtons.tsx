
import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthButtonsProps {
  user: any;
  onSignOut: () => void;
  isMobile?: boolean;
}

const AuthButtons = ({ user, onSignOut, isMobile = false }: AuthButtonsProps) => {
  if (user) {
    return (
      <div className={`flex items-center ${isMobile ? 'space-y-2 flex-col' : 'space-x-3'}`}>
        {!isMobile && (
          <span className="text-sm text-white">
            {user.user_metadata?.full_name || user.email?.split('@')[0]}
          </span>
        )}
        {isMobile && (
          <div className="px-3 py-2 text-sm text-gray-600">
            {user.user_metadata?.full_name || user.email?.split('@')[0]}
          </div>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onSignOut}
          className={`flex items-center space-x-1 border-white text-white hover:bg-white hover:text-blue-600 ${isMobile ? 'w-full' : ''}`}
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${isMobile ? 'space-y-2 flex-col' : 'space-x-3'}`}>
      <Link to="/auth">
        <Button 
          variant="outline" 
          size="sm" 
          className={`border-white text-white hover:bg-white hover:text-blue-600 ${isMobile ? 'w-full' : ''}`}
        >
          Sign In
        </Button>
      </Link>
      <Link to="/auth">
        <Button 
          size="sm" 
          className={`bg-white text-blue-600 hover:bg-gray-100 ${isMobile ? 'w-full' : ''}`}
        >
          Get Started
        </Button>
      </Link>
    </div>
  );
};

export default AuthButtons;
