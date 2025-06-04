import Product from "../models/productModel.js";
import mongoose from "mongoose";
import User from "../models/userModel.js"


// ✅ **Alle Produkte abrufen**
export const getProducts = async (req, res) => {
  try {
    console.log("🔍 Suchanfrage:", req.query);
    const { query, category, minPrice, maxPrice, location } = req.query;
    let filter = {};

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } }
      ];
    }

    if (category && category !== "Alle Kategorien") {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (location && location !== "Alle Orte") { 
      filter.location = location;
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .select("title price image location userId")
      .populate("userId", "name");  // 🔍 Benutzerinformationen hinzufügen

    console.log("📦 Gefundene Produkte:", products);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "❌ Fehler beim Abrufen der Produkte", error: error.message });
  }
};

// Produkt suchen (mit Kategorie, Ort und Suchbegriff)
/* export const searchProducts = async (req, res) => {
  const { query, category, location } = req.query;

  let filter = {};

  if (query) filter.title = { $regex: new RegExp(query, "i") }; 
  if (category) filter.category = category;
  if (location) filter.location = { $regex: new RegExp(location.trim(), "i") };  // Achtung auf .trim()
  
  try {
      const products = await Product.find(filter);
      console.log("Gefundene Produkte:", products);  // Debugging: Zeige gefundene Produkte in der Konsole
      res.json(products);
  } catch (error) {
      res.status(500).json({ message: "Fehler bei der Produktsuche." });
  }
  
  
}; */
// Produkt suchen (mit Kategorie, Ort und Suchbegriff)
export const searchProducts = async (req, res) => {
  const { query, category, location } = req.query;

  let filter = {};

  if (query) filter.title = { $regex: new RegExp(query, "i") };
  if (category) filter.category = category;
  if (location) filter.location = { $regex: new RegExp(location.trim(), "i") };  // Achtung auf .trim()

  try {
    const products = await Product.find(filter);
    console.log("Gefundene Produkte:", products);  // Debugging: Zeige gefundene Produkte in der Konsole
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Fehler bei der Produktsuche." });
  }


};
export const getProductById = async (req, res) => {
  try {
    console.log("🔍 Anfrage an getProductById erhalten. ID:", req.params.id);

    const product = await Product.findById(req.params.id).populate("userId", "name _id");

    if (!product) {
      console.log("❌ Produkt nicht gefunden!");
      return res.status(404).json({ message: "❌ Produkt nicht gefunden!" });
    }

    console.log("🖼️ Produkt-Bild-URL:", product.image);

    res.status(200).json(product);
  } catch (error) {
    console.error("❌ Fehler in getProductById:", error.message);
    res.status(500).json({ message: "❌ Fehler beim Abrufen des Produkts", error: error.message });
  }
};

// ✅ **Eigene Anzeigen abrufen**
export const getUserListings = async (req, res) => {
  try {
    console.log("🔍 Anfrage an getUserListings erhalten!");

    if (!req.user) {
      console.log("❌ Kein Benutzer in der Anfrage!");
      return res.status(401).json({ message: "❌ Nicht autorisiert!" });
    }

    console.log("👤 Benutzer-ID aus Token:", req.user._id);

    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
      console.log("❌ Ungültige Benutzer-ID!");
      return res.status(400).json({ message: "❌ Ungültige Benutzer-ID" });
    }

    console.log("🔍 Suche nach Anzeigen für Benutzer:", req.user._id);

    const listings = await Product.find({ userId: req.user._id }).populate("userId", "name location");

    console.log("📦 Gefundene Anzeigen:", listings);

    res.json(listings);
  } catch (error) {
    console.error("❌ Fehler beim Abrufen der Anzeigen:", error.message);
    res.status(500).json({ message: "❌ Fehler beim Abrufen deiner Anzeigen", error: error.message });
  }
};


// ✅ **Neues Produkt erstellen mit Bild-Upload**
export const createProduct = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "❌ Nicht autorisiert!" });
    }

    const { title, description, price, category } = req.body;

    // 🔍 Standort vom Benutzer abrufen
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "❌ Benutzer nicht gefunden!" });

    const location = user.location || "Unbekannter Ort"; // ✅ Fix für fehlenden Standort

    const image = req.file ? req.file.secure_url || req.file.path : null;
    if (!image) {
      return res.status(400).json({ message: "❌ Kein Bild hochgeladen!" });
    }

    console.log("🚀 Gespeicherte Bild-URL:", image);
    console.log("📍 Standort:", location); // ✅ Debugging

    const newProduct = new Product({
      title,
      description,
      price,
      category,
      image,
      location, // ✅ Standort speichern
      userId: req.user._id, // **Wichtig: userId statt user**
    });

    await newProduct.save();
    res.status(201).json({ message: "✅ Produkt erfolgreich erstellt!", product: newProduct });
  } catch (error) {
    console.error("❌ Fehler beim Erstellen des Produkts:", error);
    res.status(500).json({ message: "❌ Fehler beim Erstellen des Produkts", error: error.message });
  }
};
// ✅ **Neue Anzeige mit Cloudinary**
export const createListing = async (req, res) => {
  try {
    console.log("📢 Anfrage an createListing erhalten");
    console.log("🔍 Benutzer aus Middleware:", req.user);

    if (!req.user || !req.user._id) {
      console.error("❌ Fehler: Benutzer nicht gefunden!");
      return res.status(401).json({ message: "❌ Nicht autorisiert!" });
    }

    const { title, description, price, category } = req.body;
    console.log("📦 Erhaltene Daten:", { title, description, price, category });

    if (!title || !description || !price || !category) {
      console.error("❌ Fehler: Fehlende Felder!", { title, description, price, category });
      return res.status(400).json({ message: "❌ Alle Felder sind erforderlich!" });
    }

    console.log("📤 Datei-Upload für Listing:", req.file);

    const imageUrl = req.file ? req.file.secure_url || req.file.path : null;

    if (!imageUrl) {
      console.error("❌ Fehler: Bild nicht hochgeladen!");
      return res.status(400).json({ message: "❌ Kein Bild hochgeladen!" });
    }

    console.log("👤 Benutzer-ID für Anzeige:", req.user._id);

    const newListing = new Product({
      title,
      description,
      price,
      category,
      image: imageUrl,
      userId: req.user._id, // ✅ userId explizit setzen
    });

    await newListing.save();
    console.log("✅ Anzeige erfolgreich gespeichert:", newListing);
    res.status(201).json({ message: "✅ Anzeige erfolgreich erstellt!", listing: newListing });

  } catch (error) {
    console.error("❌ Fehler beim Erstellen der Anzeige:", error);
    res.status(500).json({ message: "❌ Fehler beim Erstellen der Anzeige", error: error.message });
  }
};
export const createMultipleProducts = async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ message: "❌ Daten müssen ein Array sein" });
    }

    const products = req.body.map(product => ({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image || null,
    }));

    const savedProducts = await Product.insertMany(products);
    res.status(201).json(savedProducts);
  } catch (error) {
    res.status(500).json({ message: "❌ Fehler beim Erstellen der Produkte", error: error.message });
  }
};

/* // ✅ **Produkt aktualisieren**
export const updateProduct = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    const updateData = { title, description, price, category };

    if (req.file) {
      updateData.image = req.file.path || req.file.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "❌ Produkt nicht gefunden!" });
    }

    res.json({ message: "✅ Produkt erfolgreich aktualisiert!", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "❌ Fehler beim Aktualisieren des Produkts", error: error.message });
  }
}; */

/* //  **Produkt nur vom Ersteller oder Admin löschen**
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "❌ Produkt nicht gefunden!" });
    }

    // ✅ Admins dürfen alles löschen, Ersteller nur seine eigenen Produkte
    if (product.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "❌ Zugriff verweigert!" });
    }

    await product.deleteOne();
    res.json({ message: "✅ Produkt erfolgreich gelöscht!" });
  } catch (error) {
    res.status(500).json({ message: "❌ Fehler beim Löschen des Produkts", error: error.message });
  }
}; */



// 📦 Produkt löschen
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "❌ Produkt nicht gefunden!" });
    }

    // 🔍 Überprüfen, ob der Benutzer existiert
    if (!product.userId) {
      return res.status(400).json({ message: "❌ Produkt besitzt keinen Benutzer!" });
    }

    // 🔍 Überprüfen, ob der Benutzer der Eigentümer oder Admin ist
    if (product.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "❌ Nicht autorisiert, dieses Produkt zu löschen!" });
    }

    await Product.deleteOne({ _id: req.params.id }); // ✅ Produkt löschen
    res.json({ message: "✅ Produkt erfolgreich gelöscht!" });

  } catch (error) {
    console.error("❌ Fehler beim Löschen des Produkts:", error.message);
    res.status(500).json({ message: "❌ Fehler beim Löschen des Produkts" });
  }
};





// 📦 Produkt aktualisieren
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {};

    // Alle Felder, die geändert werden, werden zum updates Objekt hinzugefügt
    if (req.body.title) updates.title = req.body.title;
    if (req.body.description) updates.description = req.body.description;
    if (req.body.price) updates.price = req.body.price;
    if (req.body.category) updates.category = req.body.category;
    if (req.body.location) updates.location = req.body.location;

    // Bild aktualisieren, falls hochgeladen
    if (req.file) {
      updates.image = req.file.path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "❌ Produkt nicht gefunden!" });
    }

    res.json({ message: "✅ Produkt erfolgreich aktualisiert!", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "❌ Fehler beim Aktualisieren des Produkts", error: error.message });
  }
};
