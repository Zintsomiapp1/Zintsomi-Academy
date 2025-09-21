
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';

interface SuccessGreetingProps {
  username: string;
  onContinue: () => void;
}

const SuccessGreeting = ({ username, onContinue }: SuccessGreetingProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-mjolo-pink/20 via-mjolo-purple/10 to-mjolo-pink/20 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background sparkles */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-mjolo-pink rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-mjolo-purple rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-mjolo-pink rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-mjolo-purple rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>
      
      {/* Hearts animation container */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Left heart */}
        <div className="absolute animate-[slide-in-left_2s_ease-out_forwards]">
          <Heart 
            className="w-12 h-12 text-mjolo-pink fill-mjolo-pink drop-shadow-[0_0_20px_rgba(255,105,180,0.7)] animate-pulse" 
            style={{
              filter: 'drop-shadow(0 0 30px rgba(255, 105, 180, 0.8))',
              animationDelay: '0.5s'
            }}
          />
        </div>
        
        {/* Right heart */}
        <div className="absolute animate-[slide-in-right_2s_ease-out_forwards]">
          <Heart 
            className="w-12 h-12 text-mjolo-purple fill-mjolo-purple drop-shadow-[0_0_20px_rgba(147,51,234,0.7)] animate-pulse" 
            style={{
              filter: 'drop-shadow(0 0 30px rgba(147, 51, 234, 0.8))',
              animationDelay: '0.8s'
            }}
          />
        </div>
        
        {/* Meeting glow effect */}
        <div className="absolute w-24 h-24 bg-gradient-to-r from-mjolo-pink/30 to-mjolo-purple/30 rounded-full blur-xl animate-[scale-in_1s_ease-out_2s_forwards] opacity-0"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="w-full text-center backdrop-blur-sm bg-background/80 border-mjolo-pink/20 shadow-2xl">
          <CardContent className="pt-8 pb-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to Mjolo! 💕</h1>
              <p className="text-muted-foreground">
                Hello {username}! Your account has been created successfully. 
                Please check your email to verify your account, then you can sign in to start your dating journey.
              </p>
            </div>
            
            <Button 
              onClick={onContinue}
              className="bg-gradient-to-r from-mjolo-pink to-mjolo-purple hover:from-mjolo-pink/90 hover:to-mjolo-purple/90 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Continue to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuccessGreeting;
