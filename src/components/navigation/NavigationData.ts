
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
  Feather
} from 'lucide-react';

export const createNavItems = (isAdmin: boolean) => {
  const baseItems = [
    { path: '/', label: 'Home', icon: Home, gradient: 'from-sky-500 to-blue-600' },
    { path: '/courses', label: 'Courses', icon: BookOpen, gradient: 'from-green-500 to-blue-600' },
    { path: '/advanced-courses', label: 'Discover', icon: Search, gradient: 'from-purple-500 to-pink-600' },
    { path: '/stories', label: 'Stories', icon: Scroll, gradient: 'from-purple-500 to-pink-600' },
    { path: '/indigenous', label: 'Indigenous', icon: Feather, gradient: 'from-sky-500 to-blue-600' },
    { path: '/games', label: 'Games', icon: Gamepad2, gradient: 'from-orange-500 to-red-600' },
    { path: '/brain-training', label: 'Brain Training', icon: Brain, gradient: 'from-indigo-500 to-purple-600' },
    { path: '/wishlist', label: 'Wishlist', icon: Heart, gradient: 'from-pink-500 to-red-600' },
    { path: '/cart', label: 'Cart', icon: ShoppingCart, gradient: 'from-emerald-500 to-green-600' },
  ];

  if (isAdmin) {
    baseItems.push({ path: '/admin', label: 'Admin Panel', icon: Shield, gradient: 'from-red-600 to-red-800' });
  }

  return baseItems;
};
