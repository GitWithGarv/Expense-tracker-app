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
      service: 'gmail',
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });
  }
  return transporter;
};

export const sendMail = async (to, subject, html) => {
  try {
    if (!process.env.SENDER_EMAIL || !process.env.SENDER_PASSWORD) {
      throw new Error("Mail credentials are not configured (SENDER_EMAIL/SENDER_PASSWORD)");
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
    throw new Error(`Failed to send email: ${error.message}`);
  }
};