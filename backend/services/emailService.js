/**
 * Email service provider placeholder (e.g. Nodemailer / SendGrid / Resend)
 */
const sendEmail = async ({ to, subject, text, html }) => {
  // In production, integrate with nodemailer, SendGrid, or Resend
  console.log(`[Email Service Mock] Sending email to: ${to} | Subject: ${subject}`);
  return { success: true, messageId: `mock-${Date.now()}` };
};

const sendWelcomeEmail = async (user) => {
  return sendEmail({
    to: user.email,
    subject: 'Welcome to the Platform!',
    text: `Hello ${user.name}, welcome aboard!`,
    html: `<h1>Welcome, ${user.name}!</h1><p>We are excited to have you with us.</p>`,
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
};
