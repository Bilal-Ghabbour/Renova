import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendVerificationEmail = async (email, verificationLink) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "E-Mail Verifizieren",
      html: `<p>Klicke auf den folgenden Link, um deine E-Mail zu verifizieren:</p>
             <a href="${verificationLink}">${verificationLink}</a>`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Verifizierungs-E-Mail gesendet an ${email}`);
  } catch (error) {
    console.error("❌ Fehler beim Senden der E-Mail:", error.message);
  }
};