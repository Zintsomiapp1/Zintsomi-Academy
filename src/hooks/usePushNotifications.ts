import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NotificationSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export const usePushNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  // Check if push notifications are supported
  useEffect(() => {
    const supported = 'serviceWorker' in navigator && 'PushManager' in window;
    setIsSupported(supported);
    
    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  // Register service worker and get subscription
  useEffect(() => {
    if (!isSupported || !user) return;

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        const existingSubscription = await registration.pushManager.getSubscription();
        setSubscription(existingSubscription);
      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    };

    registerServiceWorker();
  }, [isSupported, user]);

  // Request permission and subscribe to push notifications
  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Push notifications are not supported in this browser",
        variant: "destructive"
      });
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission === 'granted') {
        const registration = await navigator.serviceWorker.getRegistration();
        if (!registration) {
          throw new Error('Service worker not registered');
        }

        // Generate VAPID key (in production, this should be from your server)
        const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HI80NM6EHbr4QFRjYj3RFwUgWQjJ7G2-Kn1y8A_Gx9aKSm-5TY5Ek1234'; // Replace with your VAPID key

        const pushSubscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
        });

        setSubscription(pushSubscription);

        // Save subscription to database
        if (user) {
          await saveSubscriptionToDatabase(pushSubscription);
        }

        toast({
          title: "Notifications Enabled",
          description: "You'll now receive push notifications for matches and messages"
        });

        return true;
      } else {
        toast({
          title: "Permission Denied",
          description: "Enable notifications in your browser settings to receive updates",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: "Error",
        description: "Failed to enable notifications",
        variant: "destructive"
      });
      return false;
    }
  }, [isSupported, user, toast]);

  // Save subscription to database
  const saveSubscriptionToDatabase = async (subscription: PushSubscription) => {
    if (!user) return;

    try {
      const subscriptionData: NotificationSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
          auth: arrayBufferToBase64(subscription.getKey('auth')!)
        }
      };

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          push_notifications: true,
          push_subscription: subscriptionData
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving subscription:', error);
    }
  };

  // Send notification
  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (permission === 'granted') {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
    }
  }, [permission]);

  // Send notification for new message
  const notifyNewMessage = useCallback((senderName: string, message: string) => {
    sendNotification(`New message from ${senderName}`, {
      body: message,
      tag: 'new-message',
      requireInteraction: true
    });
  }, [sendNotification]);

  // Send notification for new match
  const notifyNewMatch = useCallback((matchName: string) => {
    sendNotification(`New match with ${matchName}! 💕`, {
      body: 'Start chatting now',
      tag: 'new-match',
      requireInteraction: true
    });
  }, [sendNotification]);

  // Send notification for activity
  const notifyActivity = useCallback((title: string, message: string) => {
    sendNotification(title, {
      body: message,
      tag: 'activity',
      requireInteraction: false
    });
  }, [sendNotification]);

  return {
    isSupported,
    permission,
    subscription,
    requestPermission,
    sendNotification,
    notifyNewMessage,
    notifyNewMatch,
    notifyActivity
  };
};

// Helper functions
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const binary = Array.from(bytes, byte => String.fromCharCode(byte)).join('');
  return window.btoa(binary);
}