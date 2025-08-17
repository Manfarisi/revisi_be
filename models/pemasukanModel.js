import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  namaProduk: { type: String, required: true },
  kodePesanan: { type: String, required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Pelanggan" }, // relasi ke Pelanggan
  quantity: { type: Number, required: true },
  hargaSatuan: { type: Number, required: true },
  total: { type: Number, required: true },
});

const pemasukanSchema = new mongoose.Schema({
  items: [itemSchema],
  kodePesanan: { type: String, required: true, unique: true },
  totalPemasukan: { type: Number, required: true },
  keterangan: { type: String },
  tanggal: { type: Date, default: Date.now },
  petugas: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  kodePetugas: { type: String, required: true },
  checkoutId: { type: mongoose.Schema.Types.ObjectId, ref: "checkout" },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Pelanggan" },
});

export default mongoose.models.pemasukan ||
  mongoose.model("pemasukan", pemasukanSchema);
