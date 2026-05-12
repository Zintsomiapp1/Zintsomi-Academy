import React from 'react';
import { Heart, MessageCircle, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage, type SupportedLanguage } from '@/contexts/LanguageContext';

interface WelcomeProps {
  onLogin: () => void;
  onSignUp: () => void;
}

const Welcome = ({ onLogin, onSignUp }: WelcomeProps) => {
  const { language, setLanguage, languageLabels, t } = useLanguage();

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white">
      <div className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 py-8 sm:py-10">
        <div className="absolute inset-0 bg-gradient-to-br from-mjolo-pink via-mjolo-purple to-mjolo-coral"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 text-center">
          <div className="flex justify-end mb-4">
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as SupportedLanguage)}
              className="bg-white/15 border border-white/40 text-white rounded-lg px-3 py-2 text-xs sm:text-sm backdrop-blur-sm"
              aria-label="Choose language"
            >
              {Object.entries(languageLabels).map(([code, label]) => (
                <option key={code} value={code} className="text-gray-900">
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-7 sm:mb-8">
            <img
              src="/lovable-uploads/3c8a256a-babc-45a4-bf11-fb10887a065e.png"
              alt="Mjolo logo"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain mx-auto mb-5 sm:mb-6 animate-bounce"
            />
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              {t('welcomeTitleTop')}
              <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                {t('welcomeTitleBottom')}
              </span>
            </h1>
            <p className="text-white/90 text-base sm:text-lg mb-8 px-2 sm:px-4">
              {t('welcomeSubtitle')}
            </p>
          </div>

          <div className="flex justify-center space-x-4 sm:space-x-6 mb-10 sm:mb-12">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-white/80 text-xs">Smart Match</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-white/80 text-xs">Safe Chat</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2">
                <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-white/80 text-xs">Photo Swap</span>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <Button
              size="lg"
              onClick={onSignUp}
              className="w-full bg-white text-mjolo-purple hover:bg-white/90 py-4 font-bold text-base sm:text-lg shadow-xl rounded-2xl"
            >
              {t('createAccount')}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onLogin}
              className="w-full py-4 text-white border-white/30 hover:bg-white/10 backdrop-blur-sm font-semibold text-base sm:text-lg rounded-2xl"
            >
              {t('signIn')}
            </Button>
          </div>

          <p className="text-white/60 text-xs mt-6 sm:mt-8 px-4">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
