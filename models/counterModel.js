import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, default: 0 }
});

const Counter = mongoose.models.Counter || mongoose.model("Counter", counterSchema);

// Fungsi untuk generate kode invoice (Format: INV-YYYYMM-00001)
export async function generateInvoiceCode() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const prefix = `LBD-${year}${month}-`;

  // Cari atau buat counter untuk bulan ini
  const counterName = `invoice-${year}${month}`;
  const counter = await Counter.findOneAndUpdate(
    { name: counterName },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  return prefix + String(counter.value).padStart(5, '0');
}