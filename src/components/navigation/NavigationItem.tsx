
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartContext } from '@/contexts/CartContext';

interface NavigationItemProps {
  item: {
    path: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  };
  isActive: boolean;
  showCartBadge?: boolean;
}

const NavigationItem = ({ item, isActive, showCartBadge }: NavigationItemProps) => {
  const { totalItems } = useCartContext();
  const Icon = item.icon;

  return (
    <Link to={item.path}>
      <Button
        variant={isActive ? "default" : "ghost"}
        size="sm"
        className="relative"
      >
        <Icon className="w-4 h-4 mr-2" />
        {item.label}
        {showCartBadge && item.path === '/cart' && totalItems > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
          >
            {totalItems}
          </Badge>
        )}
      </Button>
    </Link>
  );
};

export default NavigationItem;
