
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Camera, Plus, Users, Flame, Trees } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import GamificationWidget from '@/components/gamification/GamificationWidget';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDailyStreak } from '@/hooks/useDailyStreak';
import OnboardingChecklist from '@/components/user/OnboardingChecklist';
import StageTracker from '@/components/user/StageTracker';

const UserDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();
  const userKey = user?.id || user?.email || null;
  const { streak } = useDailyStreak(userKey);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen mobile-scroll pb-[calc(6rem+env(safe-area-inset-bottom))]">
      {userKey && <OnboardingChecklist userKey={userKey} />}
      {/* Stories Section */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center space-x-4 overflow-x-auto">
          {/* Your Story */}
          <div className="flex flex-col items-center space-y-1 min-w-0">
            <div className="relative">
              <Avatar className="h-16 w-16 ring-2 ring-gray-200">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-r from-mjolo-pink to-mjolo-purple text-white">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-mjolo-pink rounded-full p-1">
                <Plus className="h-3 w-3 text-white" />
              </div>
            </div>
            <span className="text-xs text-gray-600 truncate w-16 text-center">Your Story</span>
          </div>
          
          {/* Other Stories */}
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="flex flex-col items-center space-y-1 min-w-0">
              <Avatar className="h-16 w-16 ring-2 ring-mjolo-pink">
                <AvatarFallback className="bg-gradient-to-r from-mjolo-coral to-mjolo-orange text-white">
                  U{i}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-600 truncate w-16 text-center">User {i}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Section */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 ring-2 ring-mjolo-pink">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-gradient-to-r from-mjolo-pink to-mjolo-purple text-white text-xl">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{userName}</h2>
              <p className="text-gray-600 text-sm">{t('profileReady')}</p>
              <div className="flex items-center gap-1 mt-2">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-700">{streak} {t('streak')}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button className="bg-gradient-to-r from-mjolo-pink to-mjolo-purple hover:from-mjolo-pink/90 hover:to-mjolo-purple/90 text-white font-semibold py-3 rounded-xl">
            <Camera className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
          <Button variant="outline" className="border-mjolo-purple text-mjolo-purple hover:bg-mjolo-purple/5 rounded-xl py-3">
            <Users className="h-4 w-4 mr-2" />
            Share Profile
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex justify-around py-4 border-b border-gray-100">
        <div className="text-center">
          <span className="font-bold text-xl text-gray-900 block">0</span>
          <p className="text-xs text-gray-600">Matches</p>
        </div>
        <div className="text-center">
          <span className="font-bold text-xl text-gray-900 block">0</span>
          <p className="text-xs text-gray-600">Following</p>
        </div>
        <div className="text-center">
          <span className="font-bold text-xl text-gray-900 block">0</span>
          <p className="text-xs text-gray-600">Followers</p>
        </div>
      </div>

      {/* Feed Section */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-3 gap-1">
          {[1,2,3,4,5,6,7,8,9].map((i) => (
            <div key={i} className="aspect-square bg-gradient-to-br from-mjolo-pink/20 to-mjolo-purple/20 rounded-lg flex items-center justify-center">
              <Camera className="h-8 w-8 text-mjolo-pink/60" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="px-4 py-4 border-t border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">{t('discoverLove')}</h3>
        <div className="space-y-3">
          <Link to="/mjolo" className="block">
            <Button className="w-full bg-gradient-to-r from-mjolo-pink to-mjolo-purple hover:from-mjolo-pink/90 hover:to-mjolo-purple/90 text-white font-semibold py-4 rounded-xl">
              <Heart className="h-5 w-5 mr-2" />
              {t('startSwiping')}
            </Button>
          </Link>
          <Link to="/vr-story-forest" className="block">
            <Button variant="outline" className="w-full border-emerald-700 text-emerald-700 hover:bg-emerald-50 font-semibold py-4 rounded-xl">
              <Trees className="h-5 w-5 mr-2" />
              Enter VR Story Forest
            </Button>
          </Link>
        </div>
      </div>

      <div className="px-4 pb-4">
        <StageTracker />
      </div>

      {/* Gamification Widget */}
      <div className="px-4 pb-6">
        <GamificationWidget />
      </div>
    </div>
  );
};

export default UserDashboard;
