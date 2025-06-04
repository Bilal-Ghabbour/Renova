import express from "express";
import { upload } from "../utils/cloudinaryConfig.js"; // Cloudinary Middleware
import authMiddleware from "../middleware/authMiddleware.js"; // Authentifizierung
import adminMiddleware from "../middleware/adminMiddleware.js"; // Admin-Schutz

import { 
    createProduct, 
    getProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct,
    searchProducts,
    getUserListings,
    createMultipleProducts // ✅ Mehrere Produkte hinzufügen
} from "../controllers/productController.js";

const router = express.Router();

// ✅ Test Route
router.get("/test", (req, res) => {
    console.log("✅ Test-Route wurde aufgerufen!");
    res.json({ message: "✅ API funktioniert!" });
});

// 🔍 **Such-Route** (öffentlich, keine Authentifizierung nötig)
router.get("/search", searchProducts);


// 🖼 **Bild hochladen (geschützt)**
router.post("/upload", authMiddleware, upload.single("image"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "❌ Kein Bild hochgeladen!" });
        }
        res.json({ imageUrl: req.file.path }); // ✅ Cloudinary-URL zurückgeben
    } catch (error) {
        res.status(500).json({ message: "❌ Fehler beim Hochladen des Bildes", error: error.message });
    }
});

// 🛍️ **Alle Produkte abrufen (öffentlich)**
router.get("/", getProducts);

// 👤 **Eigene Anzeigen abrufen (nur für angemeldete Nutzer)**
router.get("/user-listings", authMiddleware, getUserListings);

// 📦 **Einzelnes Produkt abrufen (öffentlich)**
router.get("/:id", getProductById);

// 🆕 **Neue Anzeige erstellen (nur für angemeldete Nutzer)**
router.post("/", authMiddleware, upload.single("image"), createProduct);
router.post("/multiple", authMiddleware, createMultipleProducts); // ✅ Mehrere Produkte gleichzeitig

// 🔄 **Produkt aktualisieren (Nutzer oder Admin)**
router.put("/update/:id", authMiddleware, upload.single("image"), updateProduct);
// 🔄 **Produkt aktualisieren (nur für Ersteller oder Admins)**
router.put("/:id", authMiddleware, upload.single("image"), updateProduct);

//  **Produkt löschen (nur für Ersteller oder Admins)**
router.delete("/:id", authMiddleware, deleteProduct);



export default router;
