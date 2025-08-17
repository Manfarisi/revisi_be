import mongoose from "mongoose";

const pengeluaranSchema = new mongoose.Schema({
  nama: { type: String, required: true, unique: true },
  keterangan: { type: String, required: true },
  jumlah: { type: Number, required: true },
  jenisPengeluaran: {
    type: String,
    required: true,
    enum: [
      "Listrik",
      "Air",
      "Gaji",
      "Operasional",
      "Sewa",
      "Transportasi",
      "Konsumsi",
      "Bahan",
      "Barang",
      "Lainnya",
    ], // bisa kamu ubah sesuai kasus
  },
  tanggal: { type: Date, required: true },
  petugas: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  kodePetugas: { type: String, required: true },
});

const pengeluaranModel =
  mongoose.models.pengeluaran ||
  mongoose.model("pengeluaran", pengeluaranSchema);
export default pengeluaranModel;
