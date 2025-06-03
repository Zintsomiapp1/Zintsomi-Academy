
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import MFASetup from '@/components/auth/MFASetup';

const SecuritySettings = () => {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showMFASetup, setShowMFASetup] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    checkMFAStatus();
  }, []);

  const checkMFAStatus = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      
      if (error) throw error;
      
      const totpFactor = data?.totp?.find(factor => factor.status === 'verified');
      setMfaEnabled(!!totpFactor);
    } catch (error) {
      console.error('Error checking MFA status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMFAEnabled = () => {
    setMfaEnabled(true);
    setShowMFASetup(false);
    checkMFAStatus(); // Refresh status
  };

  const disableMFA = async () => {
    try {
      const { data: factors, error: listError } = await supabase.auth.mfa.listFactors();
      
      if (listError) throw listError;
      
      const totpFactor = factors?.totp?.find(factor => factor.status === 'verified');
      
      if (totpFactor) {
        const { error } = await supabase.auth.mfa.unenroll({
          factorId: totpFactor.id
        });
        
        if (error) throw error;
        
        setMfaEnabled(false);
        toast({
          title: "MFA Disabled",
          description: "Two-factor authentication has been disabled for your account.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to disable two-factor authentication.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Loading security settings...</p>
        </CardContent>
      </Card>
    );
  }

  if (showMFASetup) {
    return <MFASetup onMFAEnabled={handleMFAEnabled} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Account Security Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Account Email</span>
              </div>
            </div>
            <Badge variant="outline" className="text-green-600 border-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Two-Factor Authentication</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {mfaEnabled ? (
                <>
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Enabled
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={disableMFA}
                    className="text-red-600 hover:text-red-700"
                  >
                    Disable
                  </Button>
                </>
              ) : (
                <>
                  <Badge variant="outline" className="text-orange-600 border-orange-300">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Disabled
                  </Badge>
                  <Button
                    size="sm"
                    onClick={() => setShowMFASetup(true)}
                  >
                    Enable 2FA
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Security Recommendations */}
        {!mfaEnabled && (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-900">Enhance Your Security</h4>
                <p className="text-sm text-orange-700 mt-1">
                  Enable two-factor authentication to add an extra layer of protection to your account.
                  This helps prevent unauthorized access even if your password is compromised.
                </p>
                <Button
                  size="sm"
                  onClick={() => setShowMFASetup(true)}
                  className="mt-3"
                >
                  Set Up 2FA Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;
