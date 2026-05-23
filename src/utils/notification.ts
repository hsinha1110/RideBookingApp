//======================================================
// NOTIFICATION.ts
//======================================================

import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

import notifee, {
  AndroidImportance,
  EventType,
  Event,
} from '@notifee/react-native';

import { Platform } from 'react-native';

//======================================================
// IMPORT PERMISSION
//======================================================

import { requestNotificationPermission } from './permissions';

//======================================================
// CREATE ANDROID CHANNEL
//======================================================

export const createNotificationChannel = async (): Promise<void> => {
  try {
    if (Platform.OS !== 'android') {
      return;
    }

    await notifee.createChannel({
      id: 'default',

      name: 'Default Channel',

      importance: AndroidImportance.HIGH,
    });
  } catch (error) {
    console.log(error, '======= CREATE CHANNEL ERROR =======');
  }
};

//======================================================
// GET FCM TOKEN
//======================================================

export const getFcmToken = async (): Promise<string | null> => {
  try {
    const fcmToken: string = await messaging().getToken();

    console.log(fcmToken, '======= FCM TOKEN =======');

    return fcmToken;
  } catch (error) {
    console.log(error, '======= FCM TOKEN ERROR =======');

    return null;
  }
};

//======================================================
// DISPLAY NOTIFICATION
//======================================================

export const displayNotification = async (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
): Promise<void> => {
  try {
    await notifee.displayNotification({
      title: remoteMessage.notification?.title || 'Notification',

      body: remoteMessage.notification?.body || '',

      android: {
        channelId: 'default',

        pressAction: {
          id: 'default',
        },
      },
    });
  } catch (error) {
    console.log(error, '======= DISPLAY NOTIFICATION ERROR =======');
  }
};

//======================================================
// FOREGROUND LISTENER
//======================================================

export const foregroundNotificationListener = (): (() => void) => {
  return messaging().onMessage(
    async (
      remoteMessage: FirebaseMessagingTypes.RemoteMessage,
    ): Promise<void> => {
      console.log(remoteMessage, '======= FOREGROUND MESSAGE =======');

      await displayNotification(remoteMessage);
    },
  );
};

//======================================================
// BACKGROUND LISTENER
//======================================================

export const backgroundNotificationListener = (): void => {
  messaging().setBackgroundMessageHandler(
    async (
      remoteMessage: FirebaseMessagingTypes.RemoteMessage,
    ): Promise<void> => {
      console.log(remoteMessage, '======= BACKGROUND MESSAGE =======');
    },
  );
};

//======================================================
// OPEN FROM BACKGROUND
//======================================================

export const notificationOpenedListener = (): void => {
  messaging().onNotificationOpenedApp(
    (remoteMessage: FirebaseMessagingTypes.RemoteMessage): void => {
      console.log(remoteMessage, '======= OPEN FROM BACKGROUND =======');
    },
  );
};

//======================================================
// OPEN FROM QUIT STATE
//======================================================

export const quitStateNotificationListener = async (): Promise<void> => {
  try {
    const remoteMessage = await messaging().getInitialNotification();

    if (remoteMessage) {
      console.log(remoteMessage, '======= OPEN FROM QUIT STATE =======');
    }
  } catch (error) {
    console.log(error, '======= QUIT STATE ERROR =======');
  }
};

//======================================================
// INITIALIZE NOTIFICATIONS
//======================================================

export const initializeNotifications = async (): Promise<void> => {
  try {
    //==============================================
    // REQUEST PERMISSION
    //==============================================

    const granted: boolean = await requestNotificationPermission();

    console.log(granted, '======= NOTIFICATION PERMISSION =======');

    if (!granted) {
      return;
    }

    //==============================================
    // CREATE CHANNEL
    //==============================================

    await createNotificationChannel();

    //==============================================
    // GET TOKEN
    //==============================================

    const token: string | null = await getFcmToken();

    console.log(token, '======= FINAL FCM TOKEN =======');

    //==============================================
    // LISTENERS
    //==============================================

    foregroundNotificationListener();

    backgroundNotificationListener();

    notificationOpenedListener();

    await quitStateNotificationListener();
  } catch (error) {
    console.log(error, '======= INITIALIZE NOTIFICATION ERROR =======');
  }
};

//======================================================
// NOTIFEE EVENTS
//======================================================

notifee.onForegroundEvent(async ({ type, detail }: Event): Promise<void> => {
  switch (type) {
    case EventType.PRESS:
      console.log(detail.notification, '======= NOTIFICATION PRESSED =======');

      break;

    default:
      break;
  }
});
