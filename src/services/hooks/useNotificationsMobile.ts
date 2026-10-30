import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';

const API_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:4000/api'
    : 'http://localhost:4000/api';

export const useNotificationsMobile = (
  userId: string | undefined,
  role?: string,
) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);

  // --- 1. FCM Token Registration & Refresh ---
  useEffect(() => {
    if (!userId) return;

    const registerFCMToken = async () => {
      try {
        // Explicitly register for APNs remote messages on iOS before fetching token
        await messaging().registerDeviceForRemoteMessages();

        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          const fcmToken = await messaging().getToken();
          if (fcmToken) {
            console.log('[FCM] Token acquired:', fcmToken);
            // Send token to your backend API to save under user profile
            await fetch(`${API_URL}/users/fcm-token`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId, fcmToken, device: Platform.OS }),
              credentials: 'include',
            });
          }
        }
      } catch (error) {
        console.error('[FCM] Error registering token:', error);
      }
    };

    registerFCMToken();

    // Listen for dynamic FCM token refreshes
    const unsubscribeTokenRefresh = messaging().onTokenRefresh(async token => {
      try {
        await fetch(`${API_URL}/users/fcm-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            fcmToken: token,
            device: Platform.OS,
          }),
          credentials: 'include',
        });
      } catch (e) {
        console.error('[FCM] Failed to sync refreshed token:', e);
      }
    });

    return () => {
      unsubscribeTokenRefresh();
    };
  }, [userId]);

  // --- 2. FCM Foreground & Background Tap Handlers ---
  useEffect(() => {
    if (!userId) return;

    // Foreground message handler: If app is open, prevent double-injection if socket already caught it
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('[FCM] Foreground notification received:', remoteMessage);
      if (remoteMessage.notification) {
        const data = remoteMessage.data || {};
        inject(
          {
            id: remoteMessage.messageId || Date.now().toString(),
            title: remoteMessage.notification.title,
            message: remoteMessage.notification.body,
            type: data.type || 'general',
            createdAt: new Date().toISOString(),
          },
          data.isBroadcast === 'true',
        );
      }
    });

    // Handle user tapping notification from background state
    const unsubscribeNotificationOpened = messaging().onNotificationOpenedApp(
      remoteMessage => {
        console.log('[FCM] App opened from background state:', remoteMessage);
        // Optional: Handle navigation based on remoteMessage.data.actionUrl here
      },
    );

    // Handle user tapping notification when app was completely killed/closed
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('[FCM] App launched from killed state:', remoteMessage);
          // Optional: Handle navigation based on remoteMessage.data.actionUrl here
        }
      });

    return () => {
      unsubscribeForeground();
      unsubscribeNotificationOpened();
    };
  }, [userId]);

  const getReadBroadcasts = async (): Promise<string[]> => {
    if (!userId) return [];
    try {
      const stored = await AsyncStorage.getItem(`read_bcasts_${userId}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const markAsReadLocal = async (id: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id.toString() === id.toString()
          ? { ...n, read: true, unread: false }
          : n,
      ),
    );

    if (id.toString().startsWith('bcast-') && userId) {
      const readIds = await getReadBroadcasts();
      if (!readIds.includes(id)) {
        const updated = [...readIds, id];
        await AsyncStorage.setItem(
          `read_bcasts_${userId}`,
          JSON.stringify(updated),
        );
      }
    }
  };

  const markAllAsReadLocal = async () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true, unread: false })),
    );
  };

  const inject = (data: any, forceBcast = false) => {
    const isB = forceBcast || data.isBroadcast === true;
    const rawId = data.id?.toString() || Date.now().toString();
    const finalId = isB
      ? rawId.startsWith('bcast-')
        ? rawId
        : `bcast-${rawId}`
      : rawId;

    setNotifications(prev => {
      if (prev.some(n => n.id.toString() === finalId)) return prev;

      const newEntry = {
        ...data,
        id: finalId,
        isBroadcast: isB,
        read: false,
        unread: true,
        createdAt: data.createdAt || new Date().toISOString(),
      };
      return [newEntry, ...prev];
    });
  };

  // --- 3. Existing Database Fetch & Socket.io Pipeline (Completely Untouched) ---
  useEffect(() => {
    if (!userId) return;
    let isMounted = true;

    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/notifications?role=${role || ''}`, {
          credentials: 'include',
        });
        const data = await res.json();

        const formatted = (Array.isArray(data) ? data : []).map(item => ({
          ...item,
          unread: !item.read,
        }));

        if (isMounted) setNotifications(formatted);
      } catch (err) {
        console.error('Failed to load notifications:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();

    const socketUrl = API_URL.replace('/api', '');
    const cleanRole = role?.toLowerCase().trim().replace(/s$/, '');

    socketRef.current = io(`${socketUrl}/notifications`, {
      query: { userId, role: cleanRole },
      transports: ['websocket'],
      withCredentials: true,
    });

    socketRef.current.on('broadcast:general', d => inject(d, true));
    socketRef.current.on('broadcast:targeted', d => inject(d, true));
    socketRef.current.on('new_notification', d => inject(d, false));

    return () => {
      isMounted = false;
      socketRef.current?.disconnect();
    };
  }, [userId, role]);

  return { notifications, markAsReadLocal, markAllAsReadLocal, loading };
};
