
import React, { useState } from 'react';
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
        if (error) throw error;
        
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
              src="/lovable-uploads/e153d080-0e68-4853-b008-897623780941.png"
              alt="Zintsomi College"
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
