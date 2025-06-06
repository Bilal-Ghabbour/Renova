import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }
}, { timestamps: true });  // ✅ Automatische Zeitstempel (createdAt, updatedAt)

const Favorite = mongoose.model("Favorite", favoriteSchema);
export default Favorite;
