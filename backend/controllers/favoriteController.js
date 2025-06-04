import Favorite from "../models/favoriteModel.js";
import Product from "../models/productModel.js";

// 📌 Favorit hinzufügen
export const addFavorite = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    // Überprüfen, ob dieser Favorit schon existiert
    const existingFavorite = await Favorite.findOne({ userId, productId });
    if (existingFavorite) {
      return res.status(400).json({ message: "❌ Dieses Produkt ist bereits in deinen Favoriten!" });
    }

    // Neuen Favorit erstellen
    const favorite = new Favorite({ userId, productId });
    await favorite.save();

    res.status(201).json({ message: "✅ Produkt erfolgreich zu den Favoriten hinzugefügt!" });
  } catch (error) {
    res.status(500).json({ message: "❌ Fehler beim Hinzufügen zu den Favoriten!" });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const favorites = await Favorite.find({ userId }).populate("productId");

    // Filtere ungültige Produkte heraus (falls sie gelöscht wurden)
    const validFavorites = favorites.filter(fav => fav.productId !== null);

    // Sende nur gültige Produkte an das Frontend
    res.json(validFavorites.map(fav => fav.productId));
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Abrufen der Favoriten" });
  }
};


// 📌 Favorit entfernen
export const removeFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const deletedFavorite = await Favorite.findOneAndDelete({ userId, productId });

    if (!deletedFavorite) {
      return res.status(404).json({ message: "❌ Favorit nicht gefunden!" });
    }

    res.json({ message: "✅ Produkt erfolgreich aus den Favoriten entfernt!" });
  } catch (error) {
    res.status(500).json({ message: "❌ Fehler beim Entfernen des Favoriten!" });
  }
};



/* import Favorite from "../models/favoriteModel.js";
import Product from "../models/productModel.js";

// 📌 Favorit hinzufügen
export const addFavorite = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    // Überprüfen, ob dieser Favorit schon existiert
    const existingFavorite = await Favorite.findOne({ userId, productId });
    if (existingFavorite) {
      return res.status(400).json({ message: "❌ Dieses Produkt ist bereits in deinen Favoriten!" });
    }

    // Neuen Favorit erstellen
    const favorite = new Favorite({ userId, productId });
    await favorite.save();

    res.status(201).json({ message: "✅ Produkt erfolgreich zu den Favoriten hinzugefügt!" });
  } catch (error) {
    res.status(500).json({ message: "❌ Fehler beim Hinzufügen zu den Favoriten!" });
  }
};

// 📌 Favoriten abrufen
export const getFavorites = async (req, res) => {
  try {
    const userId = req.user._id;

    const favorites = await Favorite.find({ userId }).populate("productId"); // Produktdaten abrufen

    const products = favorites.map(favorite => favorite.productId); // Nur Produktdaten zurückgeben
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "❌ Fehler beim Abrufen der Favoriten!" });
  }
};

// 📌 Favorit entfernen
export const removeFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const deletedFavorite = await Favorite.findOneAndDelete({ userId, productId });

    if (!deletedFavorite) {
      return res.status(404).json({ message: "❌ Favorit nicht gefunden!" });
    }

    res.json({ message: "✅ Produkt erfolgreich aus den Favoriten entfernt!" });
  } catch (error) {
    res.status(500).json({ message: "❌ Fehler beim Entfernen des Favoriten!" });
  }
};
 */