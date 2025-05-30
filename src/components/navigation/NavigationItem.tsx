
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NavigationItemProps {
  item: {
    path: string;
    label: string;
    icon: LucideIcon;
    gradient: string;
  };
  isActive: boolean;
  isMobile?: boolean;
  onClick?: () => void;
  showCartBadge?: boolean;
}

const NavigationItem = ({ 
  item, 
  isActive, 
  isMobile = false, 
  onClick,
  showCartBadge = false 
}: NavigationItemProps) => {
  const Icon = item.icon;
  
  const getClasses = () => {
    const baseClasses = `flex items-center ${isMobile ? 'space-x-2 px-3 py-2 rounded-md text-base font-medium transition-all duration-300 w-full' : 'space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300'}`;
    
    if (isActive) {
      return `${baseClasses} bg-gradient-to-r ${item.gradient} text-white shadow-lg ${!isMobile ? 'transform scale-105' : ''}`;
    }
    
    return `${baseClasses} text-gray-600 hover:text-white hover:bg-gradient-to-r hover:${item.gradient} hover:shadow-md ${!isMobile ? 'hover:transform hover:scale-102' : ''}`;
  };

  return (
    <Link
      to={item.path}
      onClick={onClick}
      className={getClasses()}
    >
      <Icon className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
      <span>{item.label}</span>
      {showCartBadge && item.path === '/cart' && (
        <Badge variant="secondary" className="ml-1">2</Badge>
      )}
    </Link>
  );
};

export default NavigationItem;
