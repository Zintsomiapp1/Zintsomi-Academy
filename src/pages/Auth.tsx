
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import AuthForm from '@/components/auth/AuthForm';
import SuccessGreeting from '@/components/auth/SuccessGreeting';

interface AuthProps {
  onLogin: (userData: { name: string; email: string }) => void;
  onBack: () => void;
}

const Auth = ({ onLogin, onBack }: AuthProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showSuccessGreeting, setShowSuccessGreeting] = useState(false);
  const [registeredUsername, setRegisteredUsername] = useState('');

  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  // Check for email verification status on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    const verified = urlParams.get('verified');
    
    if (error) {
      toast({
        title: "Verification Error",
        description: errorDescription || "There was an issue with email verification. Please try signing in or contact support.",
        variant: "destructive",
      });
      // Clear the error from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Check if this is a successful verification
    if (verified === 'true') {
      toast({
        title: "Email Verified!",
        description: "Your email has been verified successfully. You can now sign in.",
      });
      setIsLogin(true);
      // Clear the URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Handle direct verification tokens
    const token = urlParams.get('token');
    const type = urlParams.get('type');
    
    if (token && type === 'signup') {
      toast({
        title: "Email Verified!",
        description: "Your email has been verified successfully. You can now sign in.",
      });
      setIsLogin(true);
      // Clear the URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast]);

  const handleSubmit = async (formData: {
    email: string;
    password: string;
    fullName: string;
    username: string;
  }) => {
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await signIn(formData.email, formData.password);
        if (error) {
          // Check if it's an unverified email error
          if (error.message?.includes('email not confirmed')) {
            toast({
              title: "Email Not Verified",
              description: "Please check your email and click the verification link before signing in.",
              variant: "destructive",
            });
          } else {
            throw error;
          }
          return;
        }
        
        onLogin({
          name: data.user?.user_metadata?.full_name || data.user?.email?.split('@')[0] || 'User',
          email: data.user?.email || '',
        });
        
        toast({
          title: "Success!",
          description: "You've been signed in successfully.",
        });
      } else {
        const { data, error } = await signUp(
          formData.email,
          formData.password,
          formData.username,
          formData.fullName
        );
        if (error) throw error;
        
        setRegisteredUsername(formData.username || formData.fullName);
        setShowSuccessGreeting(true);
        
        toast({
          title: "Success!",
          description: "Account created! Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAfterGreeting = () => {
    setShowSuccessGreeting(false);
    setIsLogin(true);
  };

  if (showSuccessGreeting) {
    return (
      <SuccessGreeting 
        username={registeredUsername}
        onContinue={handleContinueAfterGreeting}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white">
      <div className="relative h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 safe-area-top">
          <Button
            variant="ghost"
            onClick={onBack}
            className="p-2 touch-target"
            size="sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold text-lg">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h1>
          <div className="w-9"></div> {/* Spacer for centering */}
        </div>

        {/* Logo Section */}
        <div className="px-6 py-8 text-center">
          <img
            src="/lovable-uploads/3c8a256a-babc-45a4-bf11-fb10887a065e.png"
            alt="Mjolo logo"
            className="w-20 h-20 object-contain mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-mjolo-pink to-mjolo-purple bg-clip-text text-transparent mb-2">
            Welcome to Mjolo
          </h2>
          <p className="text-gray-600">
            {isLogin
              ? 'Sign in to start swiping and find your match'
              : 'Create your profile and discover love'}
          </p>
        </div>

        {/* Form Section */}
        <div className="flex-1 px-6 pb-6">
          <AuthForm
            isLogin={isLogin}
            loading={loading}
            onSubmit={handleSubmit}
            onToggleMode={() => setIsLogin(!isLogin)}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
