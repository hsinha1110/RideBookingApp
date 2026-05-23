export interface SendNotificationPayload {
  token: string;

  title: string;

  body: string;

  data?: Record<string, string>;
}
