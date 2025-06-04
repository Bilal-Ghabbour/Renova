import User from "../models/userModel.js";
import bcrypt from "bcrypt";

// ✅ Benutzerprofil abrufen
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; 
    console.log("📌 Benutzer-ID:", userId);

    if (!userId) {
      return res.status(400).json({ message: "❌ Benutzer-ID erforderlich!" });
    }

    const user = await User.findById(userId).select("-password"); 
    if (!user) return res.status(404).json({ message: "❌ Benutzer nicht gefunden!" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "❌ Fehler beim Abrufen des Profils", error: error.message });
  }
};

// ✅ Benutzerprofil löschen
export const deleteUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: "❌ Benutzer-ID erforderlich!" });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: "❌ Benutzer nicht gefunden!" });

    res.json({ message: "✅ Benutzer erfolgreich gelöscht!" });
  } catch (error) {
    res.status(500).json({ message: "❌ Fehler beim Löschen des Profils", error: error.message });
  }
};

// ✅ Alle Benutzer abrufen
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (!users.length) return res.status(404).json({ message: "❌ Keine Benutzer gefunden!" });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "❌ Fehler beim Abrufen der Benutzer", error: error.message });
  }
};

// 📍 Standort aktualisieren
export const updateLocation = async (req, res) => {
  try {
    const { location } = req.body;

    if (!location) {
      return res.status(400).json({ message: "❌ Standort darf nicht leer sein!" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { location },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "❌ Benutzer nicht gefunden!" });
    }

    res.json({ message: "✅ Standort erfolgreich aktualisiert!", location: user.location });
  } catch (error) {
    res.status(500).json({ message: "❌ Fehler beim Aktualisieren des Standorts", error: error.message });
  }
};

// 🔒 Passwort ändern
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "❌ Aktuelles und neues Passwort sind erforderlich!" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "❌ Benutzer nicht gefunden!" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "❌ Falsches aktuelles Passwort." });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "✅ Passwort erfolgreich geändert." });
  } catch (error) {
    res.status(500).json({ message: "❌ Fehler beim Ändern des Passworts", error: error.message });
  }
};

// 🔥 Produkt zu Favoriten hinzufügen
export const addProductToFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Benutzer nicht gefunden." });

    if (!user.favorites.includes(productId)) {
      user.favorites.push(productId);
      await user.save();
    }

    res.json({ message: "✅ Produkt zu Favoriten hinzugefügt." });
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Hinzufügen zu Favoriten.", error: error.message });
  }
};

// 🔥 Favoriten abrufen
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    if (!user) return res.status(404).json({ message: "❌ Benutzer nicht gefunden!" });

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: "❌ Fehler beim Abrufen der Favoriten.", error: error.message });
  }
};

// 🔥 Produkt aus Favoriten entfernen
export const removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "❌ Benutzer nicht gefunden." });

    user.favorites = user.favorites.filter(fav => fav.toString() !== productId);
    await user.save();

    res.json({ message: "✅ Produkt aus Favoriten entfernt." });
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Entfernen aus Favoriten.", error: error.message });
  }
};
