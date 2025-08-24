
import { 
  Home, 
  BookOpen, 
  User, 
  Brain,
  Search,
  Heart,
  ShoppingCart,
  Gamepad2,
  Shield,
  Trophy,
  Music,
  Scroll,
  Feather,
  Library,
  MessageSquare
} from 'lucide-react';

export const createNavItems = (isAdmin: boolean) => {
  const baseItems = [
    { path: '/', label: 'Home', icon: Home, gradient: 'from-sky-500 to-blue-600' },
    { path: '/mjolo', label: 'Mjolo', icon: Heart, gradient: 'from-pink-500 to-red-600' },
    { path: '/games', label: 'Games', icon: Gamepad2, gradient: 'from-orange-500 to-red-600' },
    { path: '/brain-training', label: 'Brain Training', icon: Brain, gradient: 'from-indigo-500 to-purple-600' },
  ];

  if (isAdmin) {
    baseItems.push({ path: '/admin-dashboard', label: 'Admin Panel', icon: Shield, gradient: 'from-red-600 to-red-800' });
  }

  return baseItems;
};
