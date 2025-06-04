import express from "express";
import { 
  getUserProfile, 
  deleteUserProfile, 
  getAllUsers, 
  addProductToFavorites, 
  getFavorites, 
  removeFavorite ,

} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();  // 💡 Definition des Routers

// ✅ Route zum Hinzufügen eines Produkts zu Favoriten
router.post("/favorite/:productId", authMiddleware, addProductToFavorites);

// ✅ Route zum Abrufen aller Favoriten eines Benutzers
router.get("/favorites", authMiddleware, getFavorites);

// ✅ Route zum Entfernen eines Produkts aus den Favoriten
router.delete("/favorites/:productId", authMiddleware, removeFavorite);

// ✅ Eigene Benutzer-Daten abrufen (Token wird benutzt)
router.get("/me", authMiddleware, getUserProfile);

// ✅ Benutzer löschen (Nur Admins erlaubt)
router.delete("/:id", authMiddleware, adminMiddleware, deleteUserProfile);

// ✅ Alle Benutzer abrufen (Nur Admins erlaubt)
router.get("/", authMiddleware, adminMiddleware, getAllUsers);

export default router;
