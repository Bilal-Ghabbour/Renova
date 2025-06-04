import jwt from "jsonwebtoken";
import User from "../models/userModel.js"; // Stelle sicher, dass du das User-Modell importierst
import dotenv from "dotenv";

dotenv.config();  // Wichtig! Damit die .env Datei korrekt gelesen wird.

// ✅ Middleware zum Überprüfen des Tokens (TokenCheck und AuthMiddleware zusammen)
const authMiddleware = async (req, res, next) => {
  try {
    console.log("🔒 AuthMiddleware wurde aufgerufen");

    // Token aus dem Header holen
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    console.log("🔑 Erhaltener Token:", token);

    if (!token) {
      console.log("❌ Kein Token gesendet!");
      return res.status(401).json({ message: "❌ Kein Token, Zugriff verweigert!" });
    }

    // Überprüfen, ob der Token korrekt ist
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🛠️ Decoded Token:", decoded);

    // Benutzer abrufen
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.log("❌ Benutzer nicht gefunden!");
      return res.status(401).json({ message: "❌ Benutzer existiert nicht!" });
    }

    console.log("✅ Authentifizierung erfolgreich! Benutzer:", user.name);
    req.user = user; // Benutzer wird zur Anfrage hinzugefügt

    next(); // Anfrage geht weiter
  } catch (error) {
    console.error("❌ Auth-Fehler:", error.message);
    return res.status(401).json({ message: "❌ Token ist ungültig oder abgelaufen!" });
  }
};

export default authMiddleware;
