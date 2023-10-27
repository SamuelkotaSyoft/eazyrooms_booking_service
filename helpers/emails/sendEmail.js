import axios from "axios";

export default async function sendEmail({
  email,
  subject,
  templateName,
  variables,
  authToken,
}) {
  /**
   * create notification this will be triggered over notification service
   * you can pass an extra parameter called stores which is an array of store ids is optional
   * for further information head over to notification service
   */
  let res = await axios.post(
    `${process.env.CAMPAIGNS_SERVICE_URL}/sendTransactionalEmail`,
    {
      email: email,
      subject: subject,
      templateName: templateName,
      variables: variables,
    },
    {
      headers: {
        "eazyrooms-token": authToken,
      },
    }
  );

  return res.data;
}
