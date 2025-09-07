
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Heart, 
  MessageCircle, 
  Eye, 
  Calendar,
  Camera,
  Settings,
  User,
  Plus,
  Users,
  Flame
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import GamificationWidget from '@/components/gamification/GamificationWidget';

const UserDashboard = () => {
  const { user } = useAuth();
  
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Instagram-style Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-gradient-to-r from-mjolo-pink to-mjolo-purple text-white text-xs">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold text-lg bg-gradient-to-r from-mjolo-pink to-mjolo-purple bg-clip-text text-transparent">
              Mjolo
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Heart className="h-6 w-6 text-mjolo-pink" />
            <MessageCircle className="h-6 w-6 text-mjolo-purple" />
            <Link to="/profile-settings">
              <Settings className="h-6 w-6 text-gray-600" />
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="px-4 py-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 ring-2 ring-mjolo-pink ring-offset-2">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-gradient-to-r from-mjolo-pink to-mjolo-purple text-white text-xl">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{userName}</h2>
            <p className="text-gray-600 text-sm">Ready to find love ✨</p>
            <div className="flex items-center gap-1 mt-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">0 streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex justify-around py-4 border-b border-gray-100">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Heart className="h-4 w-4 text-mjolo-pink" />
            <span className="font-bold text-lg">0</span>
          </div>
          <p className="text-xs text-gray-600">Matches</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <MessageCircle className="h-4 w-4 text-mjolo-purple" />
            <span className="font-bold text-lg">0</span>
          </div>
          <p className="text-xs text-gray-600">Chats</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Eye className="h-4 w-4 text-mjolo-accent" />
            <span className="font-bold text-lg">0</span>
          </div>
          <p className="text-xs text-gray-600">Views</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Calendar className="h-4 w-4 text-mjolo-success" />
            <span className="font-bold text-lg">0</span>
          </div>
          <p className="text-xs text-gray-600">Dates</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-6 space-y-3">
        <Link to="/mjolo" className="block">
          <Button className="w-full bg-gradient-to-r from-mjolo-pink to-mjolo-purple hover:from-mjolo-pink/90 hover:to-mjolo-purple/90 text-white font-semibold py-3 rounded-xl">
            <Heart className="h-5 w-5 mr-2" />
            Start Swiping
          </Button>
        </Link>
        
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="border-mjolo-pink text-mjolo-pink hover:bg-mjolo-pink/5 rounded-xl py-3">
            <Camera className="h-4 w-4 mr-2" />
            Add Photos
          </Button>
          <Button variant="outline" className="border-mjolo-purple text-mjolo-purple hover:bg-mjolo-purple/5 rounded-xl py-3">
            <Users className="h-4 w-4 mr-2" />
            Browse
          </Button>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="px-4 pb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <Link to="/mjolo?tab=photos" className="block">
            <Card className="border-mjolo-pink/20 hover:border-mjolo-pink/40 transition-colors">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-mjolo-pink/10 to-mjolo-pink/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Camera className="h-6 w-6 text-mjolo-pink" />
                </div>
                <p className="font-medium text-sm text-gray-900">Photo Swaps</p>
                <p className="text-xs text-gray-600 mt-1">Share & exchange</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/mjolo?tab=quiz" className="block">
            <Card className="border-mjolo-purple/20 hover:border-mjolo-purple/40 transition-colors">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-mjolo-purple/10 to-mjolo-purple/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Plus className="h-6 w-6 text-mjolo-purple" />
                </div>
                <p className="font-medium text-sm text-gray-900">Quiz Battle</p>
                <p className="text-xs text-gray-600 mt-1">Test compatibility</p>
              </CardContent>
            </Card>
          </Link>
        </div>
        
        {/* Gamification Widget */}
        <div className="mt-6">
          <GamificationWidget />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
