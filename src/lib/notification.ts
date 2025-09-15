export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    return false;
  }

  let permission = Notification.permission;

  if (permission === 'default') {
    permission = await Notification.requestPermission();
  }

  return permission === 'granted';
};

export const scheduleNotification = (title: string, options: NotificationOptions, delay: number) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  setTimeout(() => {
    try {
      const notification = new Notification(title, options);
      
      // Auto close after 10 seconds
      setTimeout(() => notification.close(), 10000);
      
      // Handle notification click
      notification.onclick = function(event) {
        event.preventDefault();
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }, delay);
};

export const scheduleClassNotification = (
  courseName: string,
  time: string,
  room: string,
  minutesBefore: number = 15
) => {
  const [startTime] = time.split('-');
  const [hours, minutes] = startTime.split(':').map(Number);
  
  const now = new Date();
  const classTime = new Date(now);
  classTime.setHours(hours, minutes, 0);
  
  // Subtract notification minutes
  const notificationTime = new Date(classTime);
  notificationTime.setMinutes(notificationTime.getMinutes() - minutesBefore);
  
  // Calculate delay in milliseconds
  const delay = notificationTime.getTime() - now.getTime();
  
  // Only schedule if the notification time is in the future
  if (delay > 0) {
    scheduleNotification(
      `Kelas ${courseName} akan dimulai`,
      {
        body: `Kelas akan dimulai dalam ${minutesBefore} menit\nRuang: ${room}\nWaktu: ${time}`,
        icon: '/icons/notification.png',
        badge: '/icons/badge.png',
        tag: `class-${courseName}-${time}`, // Prevent duplicate notifications
        requireInteraction: true,
      },
      delay
    );
  }
};