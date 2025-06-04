import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: [{ type: String }],  
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } ,// ✅ Verknüpfung mit Benutzer
  location: { type: String, default: "Unbekannter Ort" } // ✅ Standort speichern

}, { timestamps: true }); // ✅ Automatische Zeitstempel

const Product = mongoose.model("Product", productSchema);
export default Product;