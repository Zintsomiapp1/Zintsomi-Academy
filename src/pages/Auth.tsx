
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import KhaluluOwl from '@/components/KhaluluOwl';

interface AuthProps {
  onLogin: (user: { name: string; email: string }) => void;
  onBack: () => void;
}

const Auth = ({ onLogin, onBack }: AuthProps) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple form validation
    if (isSignUp && (!formData.username || !formData.email || !formData.password)) {
      return;
    }
    if (!isSignUp && (!formData.email || !formData.password)) {
      return;
    }

    // Mock successful authentication
    onLogin({
      name: formData.username || formData.email.split('@')[0],
      email: formData.email
    });
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
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">Z</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {isSignUp ? 'Join Zintsomi College' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600">
              {isSignUp 
                ? 'Create your account to start learning' 
                : 'Sign in to continue your journey'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
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
                  placeholder="Enter your username"
                  className="mt-1 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required={isSignUp}
                />
              </div>
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
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl py-3 text-lg font-semibold"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
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
