import mongoose from "mongoose";

const BahanBakuKeluarSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    jumlah: { type: Number, required: true, min: 1 },
    satuan: {
      type: String,
      required: true,
      enum: [
        "kg","gram","ons","liter","ml","meter","cm","mm","pack","lusin","kodi",
        "rim","box","unit","pcs","set","roll","tablet","botol","tube","kaleng",
        "bungkus","tray","cup",
      ],
    },
    jenisPengeluaran: {
      type: String,
      required: true,
      enum: ["Produksi", "Rusak", "Lainya"],
    },
    keterangan: { type: String, default: "" },
    tanggal: { type: Date, default: Date.now },

    // Tambahkan ini
    petugas: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    kodePetugas: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const BahanBakuKeluarModel =
  mongoose.models.BahanBakuKeluar ||
  mongoose.model("BahanBakuKeluar", BahanBakuKeluarSchema);
export default BahanBakuKeluarModel;
