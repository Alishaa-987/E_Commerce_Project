require("dotenv").config({
    path: "backend/config/.env"
});

const nodemailer = require("nodemailer");

const testEmail = async () => {
    console.log("🧪 Testing SMTP Configuration...\n");
    console.log("SMTP Settings:");
    console.log("- Host:", process.env.SMTP_HOST);
    console.log("- Port:", process.env.SMTP_PORT);
    console.log("- Service:", process.env.SMTP_SERVICE);
    console.log("- Email:", process.env.SMTP_EMAIL);
    console.log("- Password length:", process.env.SMTP_PASSWORD?.length);
    console.log("\n");

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT),
            secure: parseInt(process.env.SMTP_PORT) === 465,
            service: process.env.SMTP_SERVICE,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        console.log("🔍 Verifying SMTP connection...");
        await transporter.verify();
        console.log("✅ SMTP connection verified successfully!\n");

        console.log("📧 Sending test email...");
        const info = await transporter.sendMail({
            from: `"Test" <${process.env.SMTP_EMAIL}>`,
            to: process.env.SMTP_EMAIL,
            subject: "Test Email from Node.js",
            text: "This is a test email to verify SMTP configuration.",
            html: "<p>This is a test email to verify SMTP configuration.</p>",
        });

        console.log("✅ Test email sent successfully!");
        console.log("Message ID:", info.messageId);
        console.log("\n🎉 All SMTP settings are correct!");
    } catch (error) {
        console.error("❌ Error:", error.message);
        console.error("\nFull Error Details:");
        console.error(error);
        console.error("\n⚠️ SMTP Configuration Issue Detected!");
        console.error("\nCommon solutions:");
        console.error("1. If using Gmail with 2FA: Create an App Password (not regular password)");
        console.error("2. Check if email and password are correct");
        console.error("3. Ensure less secure apps are allowed (if Gmail)");
        console.error("4. Verify SMTP credentials in .env file");
    }
};

testEmail();
