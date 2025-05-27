
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import KhaluluOwl from '@/components/KhaluluOwl';

interface AuthProps {
  onLogin: (user: { name: string; email: string }) => void;
  onBack: () => void;
}

const Auth = ({ onLogin, onBack }: AuthProps) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { signUp, signIn, user } = useAuth();
  const { toast } = useToast();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user) {
      onLogin({
        name: user.user_metadata?.full_name || user.user_metadata?.username || user.email?.split('@')[0] || 'User',
        email: user.email || ''
      });
    }
  }, [user, onLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign up flow
        if (!formData.username || !formData.fullName || !formData.email || !formData.password) {
          toast({
            title: "Error",
            description: "Please fill in all fields",
            variant: "destructive",
          });
          return;
        }

        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.username,
          formData.fullName
        );

        if (error) {
          toast({
            title: "Sign Up Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success!",
            description: "Account created successfully. Please check your email to verify your account.",
          });
        }
      } else {
        // Sign in flow
        if (!formData.email || !formData.password) {
          toast({
            title: "Error",
            description: "Please fill in all fields",
            variant: "destructive",
          });
          return;
        }

        const { error } = await signIn(formData.email, formData.password);

        if (error) {
          toast({
            title: "Sign In Error",
            description: error.message,
            variant: "destructive",
          });
        }
        // Success handling is done in useEffect when user state changes
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Back to Welcome */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-gray-600 hover:text-gray-800"
        >
          ← Back to Welcome
        </Button>

        {/* Auth Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <img
                src="/lovable-uploads/e153d080-0e68-4853-b008-897623780941.png"
                alt="Khalulu the Owl"
                className="w-16 h-16 object-contain animate-bounce"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2 animate-fade-in">
              {isSignUp ? 'Join Zintsomi College' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600 animate-fade-in">
              {isSignUp 
                ? 'Create your account to start learning' 
                : 'Sign in to continue your journey'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <>
                <div>
                  <Label htmlFor="username" className="text-gray-700 font-medium">
                    Username
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Choose a username"
                    className="mt-1 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required={isSignUp}
                  />
                </div>

                <div>
                  <Label htmlFor="fullName" className="text-gray-700 font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="mt-1 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required={isSignUp}
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="mt-1 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="mt-1 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl py-3 text-lg font-semibold"
            >
              {isLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>

        {/* Khalulu Owl */}
        <div className="mt-8">
          <KhaluluOwl 
            message={isSignUp 
              ? "Ready to join our learning community?" 
              : "Welcome back to Zintsomi College!"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
