
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, Smartphone, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MFASetupProps {
  onMFAEnabled?: () => void;
}

const MFASetup: React.FC<MFASetupProps> = ({ onMFAEnabled }) => {
  const [step, setStep] = useState<'initial' | 'qr' | 'verify' | 'success'>('initial');
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');
  const [factorId, setFactorId] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const { toast } = useToast();

  const startMFASetup = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Authenticator App'
      });

      if (error) throw error;

      if (data) {
        setQrCode(data.totp.qr_code);
        setFactorId(data.id);
        setSecretKey(data.totp.secret);
        setStep('qr');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to start MFA setup');
      toast({
        title: "Setup Error",
        description: "Failed to start two-factor authentication setup. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyMFACode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: factorId,
        code: verificationCode
      });

      if (error) throw error;

      setStep('success');
      toast({
        title: "🎉 Success!",
        description: "Two-Factor Authentication has been enabled successfully!",
      });
      
      if (onMFAEnabled) {
        onMFAEnabled();
      }
    } catch (err: any) {
      setError(err.message || 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copySecretKey = () => {
    navigator.clipboard.writeText(secretKey);
    toast({
      title: "Copied!",
      description: "Secret key copied to clipboard",
    });
  };

  const resetSetup = () => {
    setStep('initial');
    setQrCode('');
    setFactorId('');
    setVerificationCode('');
    setError('');
    setSecretKey('');
  };

  if (step === 'initial') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
            <Smartphone className="h-5 w-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium text-blue-900">Secure Your Account</h4>
              <p className="text-sm text-blue-700">
                Add an extra layer of security by enabling two-factor authentication. 
                You'll need an authenticator app like Google Authenticator, Authy, or 1Password.
              </p>
            </div>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={startMFASetup} 
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? 'Setting up...' : 'Enable Two-Factor Authentication (2FA)'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === 'qr') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Scan QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Scan this QR code with your authenticator app:
            </p>
            
            <div className="flex justify-center">
              <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                <img 
                  src={qrCode} 
                  alt="QR Code for 2FA setup" 
                  className="w-48 h-48"
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-500">
                Can't scan? Enter this key manually:
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-gray-100 rounded text-xs break-all">
                  {secretKey}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copySecretKey}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="verification-code">
              Enter the 6-digit code from your authenticator app:
            </Label>
            <Input
              id="verification-code"
              type="text"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              className="text-center text-lg font-mono"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={resetSetup} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={verifyMFACode} 
              disabled={loading || verificationCode.length !== 6}
              className="flex-1"
            >
              {loading ? 'Verifying...' : 'Verify & Enable'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'success') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Two-Factor Authentication Enabled
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              🎉 Success!
            </h3>
            <p className="text-green-700">
              Two-factor authentication has been successfully enabled for your account.
            </p>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your account is now more secure! You'll be asked for a verification code 
              from your authenticator app when signing in.
            </AlertDescription>
          </Alert>

          <Button onClick={resetSetup} variant="outline" className="w-full">
            Done
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default MFASetup;
