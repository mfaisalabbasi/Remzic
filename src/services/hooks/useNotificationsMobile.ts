import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

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

    const inject = (data: any, forceBcast = false) => {
      if (!isMounted) return;

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
