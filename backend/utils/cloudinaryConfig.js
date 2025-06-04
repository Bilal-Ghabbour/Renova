import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config(); // Lädt die Cloudinary-Umgebungsvariablen

// ✅ Cloudinary konfigurieren
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Speicher für Multer mit Cloudinary definieren
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "projekt-vitage", // 🔹 Stelle sicher, dass dies der Name deines Cloudinary-Ordners ist!
    format: async (req, file) => "jpg", // Standardformat setzen
    public_id: (req, file) => Date.now() + "-" + file.originalname.split(".")[0],
  },
});

// ✅ Multer Middleware
const upload = multer({ storage });

export { cloudinary, upload };