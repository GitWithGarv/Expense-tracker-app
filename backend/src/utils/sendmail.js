import nodemailer from 'nodemailer';

// create transporter lazily so we can inspect env variables later if needed
let transporter;
const createTransporter = () => {
  if (!transporter) {
    console.log("creating transporter with", {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASSWORD ? "[hidden]" : undefined,
    });
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false // sometimes helps with cloud timeouts
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 5000, // 5 seconds
      socketTimeout: 15000, // 15 seconds
    });
  }
  return transporter;
};

export const sendMail = async (to, subject, html) => {
  try {
    if (!process.env.SENDER_EMAIL || !process.env.SENDER_PASSWORD) {
      console.warn("Mail credentials are not configured. Skipping email sending.");
      return { success: false, message: "Email not sent (credentials missing)" };
    }

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to,
      subject,
      html,
    };
    const t = createTransporter();
    await t.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("sendMail util error", error);
    // Don't throw, just return success: false so the flow can continue or fail gracefully
    return { success: false, message: error.message };
  }
};