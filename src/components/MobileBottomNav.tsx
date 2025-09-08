import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, MessageCircle, Search, User, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const MobileBottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

  const navItems = [
    {
      path: '/',
      icon: Heart,
      label: 'Discover',
      activeColor: 'text-mjolo-pink',
      inactiveColor: 'text-gray-400'
    },
    {
      path: '/mjolo',
      icon: Search,
      label: 'Browse',
      activeColor: 'text-mjolo-purple',
      inactiveColor: 'text-gray-400'
    },
    {
      path: '/games',
      icon: Zap,
      label: 'Games',
      activeColor: 'text-mjolo-orange',
      inactiveColor: 'text-gray-400'
    },
    {
      path: '/messaging',
      icon: MessageCircle,
      label: 'Messages',
      activeColor: 'text-mjolo-coral',
      inactiveColor: 'text-gray-400'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center py-2 px-3 touch-target"
            >
              <Icon 
                className={`h-6 w-6 ${active ? item.activeColor : item.inactiveColor} transition-colors`}
                fill={active ? 'currentColor' : 'none'}
              />
              <span className={`text-xs mt-1 ${active ? item.activeColor : item.inactiveColor} font-medium`}>
                {item.label}
              </span>
            </Link>
          );
        })}
        
        {/* Profile Avatar */}
        <Link
          to="/settings"
          className="flex flex-col items-center py-2 px-3 touch-target"
        >
          <div className={`${isActive('/settings') ? 'ring-2 ring-mjolo-pink ring-offset-2' : ''} rounded-full transition-all`}>
            <Avatar className="h-6 w-6">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-gradient-to-r from-mjolo-pink to-mjolo-purple text-white text-xs">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </div>
          <span className={`text-xs mt-1 ${isActive('/settings') ? 'text-mjolo-pink' : 'text-gray-400'} font-medium`}>
            Profile
          </span>
        </Link>
      </div>
    </div>
  );
};

export default MobileBottomNav;