const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  console.log("=== SENDMAIL DEBUG ===");
  console.log("SMTP Host:", process.env.SMTP_HOST);
  console.log("SMTP Port:", process.env.SMTP_PORT);
  console.log("SMTP Service:", process.env.SMTP_SERVICE);
  console.log("SMTP Email:", process.env.SMTP_EMAIL);
  console.log("Target Email:", options.email);
  
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: parseInt(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Verify connection configuration
    await transporter.verify();
    console.log("✅ SMTP connection verified successfully!");

    const mailOptions = {
      from: `"Lumen Market" <${process.env.SMTP_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: `<p>${options.message}</p>`,
    };

    console.log("📧 Attempting to send mail to:", options.email);
    
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Activation mail sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("Response:", info.response);
    return info;
  } catch (error) {
    console.error("❌ Error sending mail:", error);
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      command: error.command,
    });
    throw error;
  }
};

module.exports = sendMail;
