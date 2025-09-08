import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface MobileHeaderProps {
  title?: string;
  showLogo?: boolean;
  showSettings?: boolean;
  showNotifications?: boolean;
}

const MobileHeader = ({ 
  title = 'Mjolo', 
  showLogo = true, 
  showSettings = true, 
  showNotifications = true 
}: MobileHeaderProps) => {
  const { user } = useAuth();

  return (
    <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-40 safe-area-top">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Logo or Title */}
        <div className="flex items-center gap-3">
          {showLogo && (
            <img
              src="/lovable-uploads/3c8a256a-babc-45a4-bf11-fb10887a065e.png"
              alt="Mjolo Logo"
              className="w-8 h-8 object-contain"
            />
          )}
          <h1 className="text-xl font-bold bg-gradient-to-r from-mjolo-pink to-mjolo-purple bg-clip-text text-transparent">
            {title}
          </h1>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-4">
          {showNotifications && user && (
            <button className="p-2 touch-target">
              <Bell className="h-6 w-6 text-gray-600" />
            </button>
          )}
          
          {showSettings && user && (
            <Link to="/settings" className="p-2 touch-target">
              <Settings className="h-6 w-6 text-gray-600" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;