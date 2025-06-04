import express from "express";
import connectDB from "./libs/db.js";
import cors from "cors";
import userRoutes from "./routers/userRoutes.js";
import uploadRouter from "./routers/uploadRouter.js";
import authRoutes from "./routers/authRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";
import dotenv from "dotenv";
import productRoutes from "./routers/productRoutes.js";
import favoriteRoutes from "./routers/favoriteRoutes.js"; 
import messageRoutes from "./routers/messageRoutes.js";


dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// API-Routen
app.use("/api/auth", authRoutes);      
app.use("/api/users", userRoutes);     
app.use("/api/upload", uploadRouter);  
console.log("🛍️ Product Routes geladen:", productRoutes !== undefined);
console.log("📢 Registrierte API-Endpunkte:");
console.log(app._router.stack.map(layer => layer.route?.path).filter(Boolean));

app.use("/api/products", productRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api", messageRoutes);

app.post("/api/messages", (req, res) => {
    const { message, phone } = req.body;
    console.log("Neue Nachricht:", message, "Telefon:", phone);
    res.json({ success: true, message: "Nachricht gesendet!" });
});

// Fehlerbehandlung
app.use(errorHandler);

// Datenbankverbindung herstellen
connectDB();

// Server starten
app.listen(PORT, () => console.log(`✅ Server läuft auf Port ${PORT}`));