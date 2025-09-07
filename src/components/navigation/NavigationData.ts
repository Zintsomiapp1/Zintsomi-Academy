
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
    { path: '/', label: 'Home', icon: Home, gradient: 'from-mjolo-pink to-mjolo-purple' },
    { path: '/mjolo', label: 'Mjolo', icon: Heart, gradient: 'from-mjolo-coral to-mjolo-pink' },
    { path: '/games', label: 'Games', icon: Gamepad2, gradient: 'from-purple-600 to-blue-600' },
    { path: '/brain-training', label: 'Brain Training', icon: Brain, gradient: 'from-green-600 to-blue-600' },
    { path: '/gamification', label: 'Achievements', icon: Trophy, gradient: 'from-yellow-500 to-orange-600' },
  ];

  if (isAdmin) {
    baseItems.push({ path: '/admin-dashboard', label: 'Admin Panel', icon: Shield, gradient: 'from-red-600 to-red-800' });
  }

  return baseItems;
};
