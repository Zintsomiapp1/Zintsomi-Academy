
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// import { useCartContext } from '@/contexts/CartContext';

interface NavigationItemProps {
  item: {
    path: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    gradient?: string;
  };
  isActive: boolean;
  showCartBadge?: boolean;
}

const NavigationItem = ({ item, isActive, showCartBadge }: NavigationItemProps) => {
  // const { totalItems } = useCartContext();
  const Icon = item.icon;

  return (
    <Link to={item.path}>
      <Button
        variant="ghost"
        size="sm"
        className={`relative transition-all duration-200 ${
          isActive && item.gradient 
            ? `bg-gradient-to-r ${item.gradient} text-white hover:opacity-90 shadow-lg`
            : isActive 
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent hover:text-accent-foreground"
        }`}
      >
        <Icon className="w-4 h-4 mr-2" />
        {item.label}
        {/* Cart badge removed */}
      </Button>
    </Link>
  );
};

export default NavigationItem;
