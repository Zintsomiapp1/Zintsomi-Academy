
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import NavigationItem from './navigation/NavigationItem';
import AuthButtons from './navigation/AuthButtons';
import MobileMenu from './navigation/MobileMenu';
import { createNavItems } from './navigation/NavigationData';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();

  const navItems = createNavItems(isAdmin);
  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);
  const handleMenuClose = () => setIsMenuOpen(false);

  return (
    <nav className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-16">
          {/* MJOLO Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/lovable-uploads/3c8a256a-babc-45a4-bf11-fb10887a065e.png"
              alt="Mjolo Logo"
              className="w-8 h-8 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavigationItem
                key={item.path}
                item={item}
                isActive={isActive(item.path)}
                showCartBadge={true}
              />
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex">
            <AuthButtons 
              user={user}
              onSignOut={handleSignOut}
            />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMenuToggle}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileMenu
          isOpen={isMenuOpen}
          navItems={navItems}
          isActive={isActive}
          onItemClick={handleMenuClose}
          user={user}
          onSignOut={handleSignOut}
        />
      </div>
    </nav>
  );
};

export default Navigation;
