import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendMail = async (toMail, subject, body) => {
  if (process.env.NODE_ENV === "test") {
    console.log("📧 Mock email sent to:", toMail);
    return;
  }

  const info = await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: toMail,
    subject: subject,
    html: body,
  });

  console.log("Message sent:", info.messageId);
};
