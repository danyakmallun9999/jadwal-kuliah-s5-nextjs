'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import { requestNotificationPermission } from '@/lib/notification';

interface NotificationToggleProps {
  variant?: 'default' | 'card' | 'white';
}

export function NotificationToggle({ variant = 'default' }: NotificationToggleProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    // Check notification support and permission on mount
    const checkPermission = async () => {
      if (!('Notification' in window)) {
        setSupported(false);
        setLoading(false);
        return;
      }

      try {
        const isGranted = await requestNotificationPermission();
        setNotificationsEnabled(isGranted);
      } catch (error) {
        console.error('Error checking notification permission:', error);
        setSupported(false);
      } finally {
        setLoading(false);
      }
    };

    checkPermission();
  }, []);

  const handleToggle = async () => {
    if (!supported) {
      alert('Browser Anda tidak mendukung notifikasi');
      return;
    }

    try {
      setLoading(true);
      if (notificationsEnabled) {
        // Can't actually revoke permission programmatically,
        // but we can show instructions
        alert('Untuk menonaktifkan notifikasi, silakan ubah pengaturan notifikasi di browser Anda');
      } else {
        const isGranted = await requestNotificationPermission();
        setNotificationsEnabled(isGranted);
        
        if (isGranted) {
          // Send test notification
          new Notification('Notifikasi Berhasil Diaktifkan', {
            body: 'Anda akan menerima pengingat 15 menit sebelum kelas dimulai.',
            icon: '/icons/notification.png',
          });
        }
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      alert('Terjadi kesalahan saat mengatur notifikasi');
    } finally {
      setLoading(false);
    }
  };

  // Style variants
  const getButtonStyle = () => {
    if (variant === 'white') {
      return notificationsEnabled
        ? "bg-white text-blue-600 hover:bg-gray-100 border-0 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
        : "bg-white/10 text-white hover:bg-white/20 border-white/20 dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-600/50";
    }

    if (variant === 'card') {
      return notificationsEnabled
        ? "bg-blue-500 hover:bg-blue-600 text-white border-0 dark:bg-blue-600 dark:hover:bg-blue-700"
        : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:border-gray-600";
    }

    // default variant
    return notificationsEnabled
      ? "bg-green-500 hover:bg-green-600 text-white border-0 dark:bg-green-600 dark:hover:bg-green-700"
      : "bg-white/10 text-white hover:bg-white/20 border-white/20 dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-600/50";
  };

  if (!supported) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className={`rounded-xl ${getButtonStyle()}`}
      >
        <BellOff className="h-4 w-4 mr-2" />
        Notifikasi Tidak Didukung
      </Button>
    );
  }

  if (loading) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className={`rounded-xl ${getButtonStyle()}`}
      >
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Memeriksa...
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      disabled={loading}
      className={`rounded-xl ${getButtonStyle()}`}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : notificationsEnabled ? (
        <Bell className="h-4 w-4 mr-2" />
      ) : (
        <BellOff className="h-4 w-4 mr-2" />
      )}
      {notificationsEnabled ? "Notifikasi Aktif" : "Aktifkan Notifikasi"}
    </Button>
  );
}