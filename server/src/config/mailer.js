const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
  },
});

// Verify the connection configuration on startup (non-blocking)
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email service configuration error:", error.message);
  } else {
    console.log("✅ Email service ready");
  }
});

module.exports = transporter;
