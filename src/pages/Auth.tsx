
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Welcome
        </Button>

        <Card className="w-full">
          <CardHeader className="text-center">
            <img
              src="/lovable-uploads/3c8a256a-babc-45a4-bf11-fb10887a065e.png"
              alt="Mjolo logo"
              className="w-16 h-16 object-contain mx-auto mb-4"
            />
            <CardTitle className="text-2xl font-bold">
              {isLogin ? 'Welcome Back' : 'Join Zintsomi College'}
            </CardTitle>
            <p className="text-gray-600">
              {isLogin
                ? 'Sign in to continue your learning journey'
                : 'Create an account to start exploring stories'}
            </p>
          </CardHeader>

          <CardContent>
            <AuthForm
              isLogin={isLogin}
              loading={loading}
              onSubmit={handleSubmit}
              onToggleMode={() => setIsLogin(!isLogin)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
