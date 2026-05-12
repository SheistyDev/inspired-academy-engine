import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  throw new Error("TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be defined");
}

export const twilioClient = twilio(accountSid, authToken);

export async function sendReminderText(to: string, message: string) {
  try {
    const response = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    return response;
  } catch (error) {
    console.error("Failed to send reminder text:", error);
    throw error;
  }
}
