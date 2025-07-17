import * as Notifications from "expo-notifications";

export const scheduleDailyNotification = async (hour: number) => {
  await Notifications.cancelAllScheduledNotificationsAsync();

  Notifications.scheduleNotificationAsync({
    content: {
      title: "Prepare for the SAT",
      body: "Open MySimpleSAT and take a test!",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute: 0,
    },
  });
};
