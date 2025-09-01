import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Bell, BellOff, MessageCircle, Heart, Activity } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NotificationPreferences {
  push_notifications: boolean;
  message_notifications: boolean;
  match_notifications: boolean;
  activity_notifications: boolean;
}

const NotificationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    isSupported,
    permission,
    subscription,
    requestPermission,
  } = usePushNotifications();

  const [preferences, setPreferences] = useState<NotificationPreferences>({
    push_notifications: false,
    message_notifications: true,
    match_notifications: true,
    activity_notifications: true,
  });
  const [loading, setLoading] = useState(false);

  // Load user preferences
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setPreferences({
            push_notifications: data.push_notifications,
            message_notifications: data.message_notifications,
            match_notifications: data.match_notifications,
            activity_notifications: data.activity_notifications,
          });
        }
      } catch (error) {
        console.error('Error loading notification preferences:', error);
      }
    };

    loadPreferences();
  }, [user]);

  // Update preferences in database
  const updatePreferences = async (newPreferences: Partial<NotificationPreferences>) => {
    if (!user) return;

    setLoading(true);
    try {
      const updatedPreferences = { ...preferences, ...newPreferences };

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          ...updatedPreferences,
        });

      if (error) throw error;

      setPreferences(updatedPreferences);
      
      toast({
        title: "Settings Updated",
        description: "Your notification preferences have been saved"
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePushNotificationToggle = async (enabled: boolean) => {
    if (enabled && permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return;
    }

    await updatePreferences({ push_notifications: enabled });
  };

  const getPermissionStatusText = () => {
    switch (permission) {
      case 'granted':
        return 'Enabled';
      case 'denied':
        return 'Blocked';
      default:
        return 'Not enabled';
    }
  };

  const getPermissionStatusColor = () => {
    switch (permission) {
      case 'granted':
        return 'text-green-600';
      case 'denied':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-mjolo-pink" />
          Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Push Notifications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications even when the app is closed
              </p>
              {isSupported && (
                <p className={`text-xs ${getPermissionStatusColor()}`}>
                  Status: {getPermissionStatusText()}
                </p>
              )}
            </div>
            <Switch
              checked={preferences.push_notifications && permission === 'granted'}
              onCheckedChange={handlePushNotificationToggle}
              disabled={loading || !isSupported}
            />
          </div>

          {!isSupported && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Push notifications are not supported in this browser
              </p>
            </div>
          )}

          {permission === 'denied' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                Notifications are blocked. Enable them in your browser settings.
              </p>
            </div>
          )}
        </div>

        {/* Message Notifications */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base font-medium flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-mjolo-pink" />
              Message Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Get notified when you receive new messages
            </p>
          </div>
          <Switch
            checked={preferences.message_notifications}
            onCheckedChange={(checked) => updatePreferences({ message_notifications: checked })}
            disabled={loading}
          />
        </div>

        {/* Match Notifications */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base font-medium flex items-center gap-2">
              <Heart className="w-4 h-4 text-mjolo-pink" />
              Match Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Get notified when you have new matches
            </p>
          </div>
          <Switch
            checked={preferences.match_notifications}
            onCheckedChange={(checked) => updatePreferences({ match_notifications: checked })}
            disabled={loading}
          />
        </div>

        {/* Activity Notifications */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base font-medium flex items-center gap-2">
              <Activity className="w-4 h-4 text-mjolo-pink" />
              Activity Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Get notified about profile views, likes, and other activities
            </p>
          </div>
          <Switch
            checked={preferences.activity_notifications}
            onCheckedChange={(checked) => updatePreferences({ activity_notifications: checked })}
            disabled={loading}
          />
        </div>

        {/* Test Notification Button */}
        {preferences.push_notifications && permission === 'granted' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              new Notification('Test Notification', {
                body: 'Push notifications are working! 🎉',
                icon: '/favicon.ico'
              });
            }}
            className="w-full"
          >
            Send Test Notification
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;