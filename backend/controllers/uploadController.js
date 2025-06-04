import { v2 as cloudinary } from "cloudinary";
import Product from "../models/productModel.js";

// ✅ Upload-Funktion mit Cloudinary
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "❌ Kein Bild hochgeladen" });
    }

    // Cloudinary speichert das Bild und gibt die URL zurück
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "vintage_new", // Dein Cloudinary-Ordner
    });

    // ✅ Optional: Falls du das Bild mit einem Produkt verknüpfen möchtest
    if (req.body.productId) {
      const product = await Product.findById(req.body.productId);
      if (!product) {
        return res.status(404).json({ message: "❌ Produkt nicht gefunden" });
      }
      product.image = result.secure_url; // Speichert die Cloudinary-URL
      await product.save();
    }

    res.json({ message: "✅ Upload erfolgreich!", fileUrl: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: "❌ Fehler beim Hochladen", error: error.message });
  }
};