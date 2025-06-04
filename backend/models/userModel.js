import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true 
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, 
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6 
  },
  location: {
    type: String,  // 📍 Neuer Standort-Feld
    required: true // ✅ Pflichtfeld
  },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], 
  isAdmin: {
    type: Boolean,
    default: false
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  }, // 🆕 Neu: Benutzer muss sich verifizieren!
  verificationToken: { type: String }, // 🆕 Neu: Token für Verifikation speichern
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;