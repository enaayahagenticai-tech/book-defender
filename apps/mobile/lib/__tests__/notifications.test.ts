import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { scheduleDelayedNotification, registerForPushNotificationsAsync, schedulePushNotification } from '../notifications';

// Mock expo-device
jest.mock('expo-device', () => ({
  isDevice: true,
}));

jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  setNotificationCategoryAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  getPermissionsAsync: jest.fn(),
  getExpoPushTokenAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  addNotificationReceivedListener: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(),
  removeNotificationSubscription: jest.fn(),
  SchedulableTriggerInputTypes: {
    TIME_INTERVAL: 'timeInterval',
  },
  AndroidImportance: {
    MAX: 'max',
  },
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      eas: {
        projectId: 'test-project-id',
      },
    },
  },
  easConfig: {
      projectId: 'test-project-id'
  }
}));

describe('Notifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Notifications.getExpoPushTokenAsync as jest.Mock).mockResolvedValue({ data: 'test-token' });
  });

  describe('scheduleDelayedNotification', () => {
    it('schedules a delayed notification correctly', async () => {
      const title = 'Test Title';
      const body = 'Test Body';
      const seconds = 5;
      const data = { id: 1 };
      const categoryId = 'test-category';

      await scheduleDelayedNotification(title, body, seconds, data, categoryId);

      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
        content: {
          title,
          body,
          data,
          sound: true,
          categoryIdentifier: categoryId,
        },
        trigger: {
          seconds,
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        },
      });
    });
  });

  describe('schedulePushNotification', () => {
    it('schedules an immediate notification correctly', async () => {
      const title = 'Test Title';
      const body = 'Test Body';
      const data = { id: 1 };
      const categoryId = 'test-category';

      await schedulePushNotification(title, body, data, categoryId);

      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
        content: {
          title,
          body,
          data,
          sound: true,
          categoryIdentifier: categoryId,
        },
        trigger: null,
      });
    });
  });

  describe('registerForPushNotificationsAsync', () => {
    it('registers for push notifications on device', async () => {
      const token = await registerForPushNotificationsAsync();

      expect(Notifications.getPermissionsAsync).toHaveBeenCalled();
      expect(Notifications.getExpoPushTokenAsync).toHaveBeenCalledWith({ projectId: 'test-project-id' });
      expect(token).toBe('test-token');
    });

    it('requests permissions if not initially granted', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({ status: 'undetermined' });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce({ status: 'granted' });

      const token = await registerForPushNotificationsAsync();

      expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
      expect(token).toBe('test-token');
    });

    it('returns undefined if permission denied', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });

      const token = await registerForPushNotificationsAsync();

      expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
      expect(token).toBeUndefined();
    });
  });
});
