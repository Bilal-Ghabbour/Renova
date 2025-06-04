import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/productModel.js"; // Stelle sicher, dass der Pfad korrekt ist

dotenv.config(); // .env-Datei laden

// Verbindung zur MongoDB herstellen
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ MongoDB verbunden!"))
  .catch(err => console.error("❌ Fehler bei MongoDB-Verbindung:", err));
async function checkUserProducts() {
  try {
    const userId = "67d4e6cf4bb4a85a172b2a7a"; // ❗ Ersetze das mit der echten User-ID aus der Datenbank
    console.log("🔍 Überprüfe Anzeigen für Benutzer:", userId);

    const listings = await Product.find({ userId });

    if (listings.length === 0) {
      console.log("🚫 Keine Anzeigen für diesen Benutzer gefunden.");
    } else {
      console.log("📦 Gefundene Anzeigen:", listings);
    }

    mongoose.connection.close(); // Verbindung schließen, wenn fertig
  } catch (error) {
    console.error("❌ Fehler beim Abrufen der Anzeigen:", error);
    mongoose.connection.close();
  }
}

// Funktion ausführen
checkUserProducts();
const newProduct = new Product({
    title: "Testanzeige",
    description: "Dies ist eine Testanzeige",
    price: 10,
    category: "Test",
    image: "test.jpg",
    location: "Berlin",
    userId: "67d4e6cf4bb4a85a172b2a7a" // Deine echte User-ID hier setzen
  });
  
  await newProduct.save();
  console.log("✅ Testanzeige erstellt!");
  
