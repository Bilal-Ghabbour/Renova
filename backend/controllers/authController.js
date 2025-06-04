import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto"; // 🆕 Token generieren
import { sendVerificationEmail } from "../utils/sendEmail.js";




// ✅ **Benutzer registrieren**
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, location } = req.body;

    // 🛑 **Validierung: Alle Felder müssen ausgefüllt sein**
    if (!name || !email || !password || !location) {
      return res.status(400).json({ message: "Alle Felder sind erforderlich!" });
    }

    // 🔍 **Prüfen, ob der Benutzer bereits existiert**
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: "Benutzer existiert bereits" });
    }

    // 🔐 **Passwort hashen**
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex"); // 🆕 Token generieren

    // ✅ **Benutzer erstellen**
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      location, 
      verificationToken, // 🆕 Token speichern
      isVerified: false, // 🆕 Standardmäßig nicht verifiziert
    });

    // 📧 **Verifikations-E-Mail senden**
    const verificationLink = `http://localhost:5173/verify-email?token=${verificationToken}`;
    await sendVerificationEmail(user.email, verificationLink);

    // 🎉 Erfolgreiche Registrierung
    res.status(201).json({ 
      message: "✅ Benutzer erfolgreich registriert! Bitte überprüfe deine E-Mail.",
      user: { 
        _id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        isVerified: user.isVerified
      } 
    });

  } catch (error) {
    console.error("❌ Registrierungsfehler:", error);
    res.status(500).json({ message: "❌ Fehler beim Registrieren", error: error.message });
  }
};

// ✅ **E-Mail verifizieren**
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "❌ Ungültiger oder abgelaufener Token!" });
    }

    // 🔄 **Benutzer als verifiziert markieren**
    user.isVerified = true;
    user.verificationToken = undefined; // 🆕 Setze das Token-Feld zurück
    await user.save();

    res.status(200).json({ message: "✅ E-Mail erfolgreich verifiziert!" });
  } catch (error) {
    console.error("❌ Fehler bei der E-Mail-Verifikation:", error);
    res.status(500).json({ message: "❌ Fehler bei der E-Mail-Verifikation", error: error.message });
  }
};




// ✅ **Benutzer einloggen**
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "❌ Benutzer nicht gefunden!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "❌ Falsches Passwort!" });
    }

    // Überprüfe  JWT_SECRET

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

      //  Token-Erstellung überprüfen
      console.log("JWT_SECRET beim Erstellen des Tokens:", process.env.JWT_SECRET);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "❌ Serverfehler", error: error.message });
  }
};
