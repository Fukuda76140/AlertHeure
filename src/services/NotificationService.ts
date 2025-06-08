import PushNotification from 'react-native-push-notification';
import {Platform} from 'react-native';

class NotificationService {
  constructor() {
    this.configure();
  }

  configure = () => {
    PushNotification.configure({
      onRegister: function (token: any) {
        console.log('TOKEN:', token);
      },
      onNotification: function (notification: any) {
        console.log('NOTIFICATION:', notification);
      },
      onAction: function (notification: any) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);
      },
      onRegistrationError: function (err: any) {
        console.error(err.message, err);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    PushNotification.createChannel(
      {
        channelId: 'work-timer',
        channelName: 'Minuteur de travail',
        channelDescription: 'Notifications pour le suivi des horaires de travail',
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created: any) => console.log(`Canal créé: ${created}`)
    );
  };

  scheduleWorkCompleteNotification = (delayInSeconds: number) => {
    PushNotification.localNotificationSchedule({
      id: 'work-complete',
      channelId: 'work-timer',
      title: 'Horaire de travail terminé ! 🎉',
      message: 'Vous avez accompli votre temps de travail quotidien.',
      date: new Date(Date.now() + delayInSeconds * 1000),
      allowWhileIdle: true,
      importance: 'high',
      priority: 'high',
      vibrate: true,
      playSound: true,
    });
  };

  scheduleOvertimeWarningNotification = (delayInSeconds: number) => {
    PushNotification.localNotificationSchedule({
      id: 'overtime-warning',
      channelId: 'work-timer',
      title: 'Heures supplémentaires ⏰',
      message: 'Vous faites des heures supplémentaires. Pensez à vous reposer !',
      date: new Date(Date.now() + delayInSeconds * 1000),
      allowWhileIdle: true,
      importance: 'default',
      priority: 'default',
      vibrate: true,
      playSound: true,
    });
  };

  scheduleMaxOvertimeNotification = (delayInSeconds: number) => {
    PushNotification.localNotificationSchedule({
      id: 'max-overtime',
      channelId: 'work-timer',
      title: 'Limite d\'heures sup atteinte ! ⚠️',
      message: 'Vous avez dépassé la limite de 1h12 d\'heures supplémentaires.',
      date: new Date(Date.now() + delayInSeconds * 1000),
      allowWhileIdle: true,
      importance: 'high',
      priority: 'high',
      vibrate: true,
      playSound: true,
    });
  };

  cancelNotification = (id: string) => {
    PushNotification.cancelLocalNotification(id);
  };

  cancelAllNotifications = () => {
    PushNotification.cancelAllLocalNotifications();
  };

  showImmediateNotification = (title: string, message: string) => {
    PushNotification.localNotification({
      channelId: 'work-timer',
      title,
      message,
      playSound: true,
      vibrate: true,
    });
  };
}

export default new NotificationService();