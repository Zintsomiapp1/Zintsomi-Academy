
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
    <div className="md:hidden border-t bg-white">
      <div className="px-2 pt-2 pb-3 space-y-1">
        {navItems.map((item) => (
          <NavigationItem
            key={item.path}
            item={item}
            isActive={isActive(item.path)}
            isMobile={true}
            onClick={onItemClick}
          />
        ))}
        <div className="pt-4 border-t space-y-2">
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
