import express from "express";
import { addFavorite, getFavorites, removeFavorite } from "../controllers/favoriteController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ➕ Favorit hinzufügen
router.post("/", authMiddleware, addFavorite);

// 📂 Alle Favoriten abrufen
router.get("/", authMiddleware, getFavorites);

// ❌ Favorit entfernen
router.delete("/:productId", authMiddleware, removeFavorite);

export default router;
