import User from "../models/userModel.js";

const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "❌ Zugriff verweigert! Nur Admins erlaubt." });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "❌ Fehler bei der Admin-Überprüfung", error: error.message });
  }
};

export default adminMiddleware;