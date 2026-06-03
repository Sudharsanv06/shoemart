const transporter = require("../config/mailer");

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({ from: process.env.EMAIL_FROM || process.env.EMAIL_USER, to, subject, html });
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error(`❌ Email failed:`, err.message);
    // Do NOT throw or rethrow here — email failure must never break order creation
  }
};

module.exports = sendEmail;
