import admin from "../config/firebase";

import { SendNotificationPayload } from "../types/notification.types";

//================================================
// SEND PUSH NOTIFICATION
//================================================

export const sendPushNotification = async ({
  token,
  title,
  body,
  data = {},
}: SendNotificationPayload) => {
  try {
    const message: admin.messaging.Message = {
      token,

      notification: {
        title,
        body,
      },

      data,

      android: {
        priority: "high",
      },

      apns: {
        payload: {
          aps: {
            sound: "default",
          },
        },
      },
    };

    const response = await admin.messaging().send(message);

    console.log(response, "======= PUSH NOTIFICATION SUCCESS =======");

    return response;
  } catch (error) {
    console.log(error, "======= PUSH NOTIFICATION ERROR =======");

    throw error;
  }
};
