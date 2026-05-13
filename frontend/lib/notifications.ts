import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export interface NotificationState {
  notification?: Notifications.Notification;
  expoPushToken?: string;
}

export const TAKEDOWN_CATEGORY = 'TAKEDOWN_CATEGORY';

// Configure how notifications should be handled when the app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerNotificationCategoriesAsync() {
  if (Platform.OS === 'web') return;

  await Notifications.setNotificationCategoryAsync(TAKEDOWN_CATEGORY, [
    {
      identifier: 'APPROVE_TAKEDOWN',
      buttonTitle: 'Authorize Takedown',
      options: {
        isDestructive: true,
        opensAppToForeground: true,
      },
    },
    {
      identifier: 'IGNORE_THREAT',
      buttonTitle: 'Ignore',
      options: {
        isAuthenticationRequired: false,
        opensAppToForeground: false,
      },
    },
  ]);
}

export async function registerForPushNotificationsAsync() {
  let token;

  await registerNotificationCategoriesAsync();

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }

    // In a real app with Expo EAS, you need the projectId
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

    try {
        token = (await Notifications.getExpoPushTokenAsync({
            projectId,
        })).data;
        console.log('Expo Push Token:', token);
    } catch (e) {
        console.error('Error fetching push token:', e);
    }
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}

export async function schedulePushNotification(title: string, body: string, data: any = {}, categoryId?: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true, // Default sound
      categoryIdentifier: categoryId,
    },
    trigger: null, // null means send immediately
  });
}

export async function scheduleDelayedNotification(title: string, body: string, seconds: number, data: any = {}, categoryId?: string) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            data,
            sound: true,
            categoryIdentifier: categoryId,
        },
        trigger: {
            seconds: seconds,
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        },
    });
}
