import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function ensureNotificationPermission() {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function scheduleTimerNotification(title: string, seconds: number) {
  const granted = await ensureNotificationPermission();
  if (!granted) return undefined;

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'LabPilot Timer',
      body: `${title} ist fertig.`,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: Math.max(1, Math.round(seconds)),
    },
  });
}

export async function cancelNotification(id?: string) {
  if (!id) return;
  await Notifications.cancelScheduledNotificationAsync(id);
}
