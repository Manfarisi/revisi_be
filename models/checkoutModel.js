import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  namaProduk: { type: String, required: true },
  kodePesanan: { type: String, required: true },
  quantity: { type: Number, required: true },
  harga: { type: Number, required: true },
});

const checkoutSchema = new mongoose.Schema({
  cartItems: { type: [cartItemSchema], required: true },
  paymentMethod: { type: String, required: true },
  customerGender: { type: String },
  customerNumber: { type: String },
  discountPercent: { type: Number, default: 0 },
  subtotal: { type: Number, required: true },
  total: { type: Number, required: true },
  kodePesanan: { type: String, required: true, unique: true },
  petugas: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  kodePetugas: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.checkout ||
  mongoose.model("checkout", checkoutSchema);
