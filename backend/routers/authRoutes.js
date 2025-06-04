import express from "express";
import { registerUser, loginUser, verifyEmail } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // ✅ Middleware zum Schutz der Route
import { getUserProfile } from "../controllers/userController.js"; // ✅ Profilabruf hinzufügen

const router = express.Router();

// ✅ Registrierung & Login
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify-email", verifyEmail);  // 🆕 Route für Verifikation


// ✅ Geschützte Route: Benutzerprofil abrufen
router.get("/profile", authMiddleware, getUserProfile);

export default router;