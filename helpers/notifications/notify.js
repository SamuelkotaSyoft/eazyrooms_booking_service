import axios from "axios";

export default async function notify({
  notificationText,
  authToken,
  userId,
  propertyId,
  role,
  location,
}) {
  /**
   * create notification this will be triggered over notification service
   * you can pass an extra parameter called stores which is an array of store ids is optional
   * for further information head over to notification service
   */
  let res = await axios.post(
    `${process.env.NOTIFICATION_SERVICE_URL}/createNotification`,
    {
      notificationText: notificationText,
      userId: userId,
      propertyId: propertyId,
      role: role,
      location: location,
    },
    {
      headers: {
        "eazyrooms-token": authToken,
      },
    }
  );

  return res.data;
}
