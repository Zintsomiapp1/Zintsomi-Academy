
import React from 'react';
import NavigationItem from './NavigationItem';
import AuthButtons from './AuthButtons';

interface MobileMenuProps {
  isOpen: boolean;
  navItems: Array<{
    path: string;
    label: string;
    icon: any;
    gradient: string;
  }>;
  isActive: (path: string) => boolean;
  onItemClick: () => void;
  user: any;
  onSignOut: () => void;
}

const MobileMenu = ({ 
  isOpen, 
  navItems, 
  isActive, 
  onItemClick, 
  user, 
  onSignOut 
}: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden border-t bg-white fixed top-16 left-0 right-0 z-50 shadow-lg max-h-screen overflow-y-auto">
      <div className="px-4 pt-4 pb-6 space-y-3">
        {navItems.map((item) => (
          <div key={item.path} onClick={onItemClick} className="w-full">
            <div className="w-full p-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors">
              <NavigationItem
                item={item}
                isActive={isActive(item.path)}
                showCartBadge={true}
              />
            </div>
          </div>
        ))}
        <div className="pt-4 border-t space-y-3">
          <AuthButtons 
            user={user}
            onSignOut={onSignOut}
            isMobile={true}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
