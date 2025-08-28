
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
  ];

  if (isAdmin) {
    baseItems.push({ path: '/admin-dashboard', label: 'Admin Panel', icon: Shield, gradient: 'from-red-600 to-red-800' });
  }

  return baseItems;
};
