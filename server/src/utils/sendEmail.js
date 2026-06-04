const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: "ShoeMart <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", response.data?.id || response.id);
  } catch (error) {
    console.error("❌ Email failed:", error);
  }
};

module.exports = sendEmail;
