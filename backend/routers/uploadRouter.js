import express from "express";
import { upload } from "../utils/cloudinaryConfig.js"; // Cloudinary-Konfiguration importieren

const router = express.Router();

// ✅ **Bild-Upload-Route**
router.post("/uploadCloudinary", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "❌ Kein Bild hochgeladen!" });
    }

    // ✅ Bild wurde erfolgreich hochgeladen, sende die URL zurück
    res.json({ imageUrl: req.file.path, message: "✅ Bild erfolgreich hochgeladen!" });
  } catch (error) {
    console.error("❌ Fehler beim Hochladen des Bildes:", error);
    res.status(500).json({ message: "❌ Fehler beim Hochladen des Bildes!", error: error.message });
  }
});

export default router;