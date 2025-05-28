
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import KhaluluOwl from '@/components/KhaluluOwl';

interface SuccessGreetingProps {
  username: string;
  onContinue: () => void;
}

const SuccessGreeting = ({ username, onContinue }: SuccessGreetingProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="w-full text-center">
          <CardContent className="pt-8 pb-8">
            <KhaluluOwl 
              message={`Hello ${username}! Welcome to Zintsomi College! Your account has been created successfully. Please check your email to verify your account, then you can sign in to start your learning journey.`}
              userName={username}
              className="mb-6"
            />
            <Button 
              onClick={onContinue}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
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
