import mongoose from "mongoose";

const bahanBakuSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    jenis: {
      type: String,
      enum: ["BAHAN", "BARANG"],
      required: true,
    },
    kategori: {
      type: String,
      enum: [
        "BAHAN_MAKANAN",
        "BAHAN_KEMASAN",
        "BARANG_ATK",
        "BARANG_INVENTARIS",
      ],
      required: true,
    },
    kodeBahan: { type: String, required: true, unique: true },
    keterangan: { type: String, required: true },
    satuan: { type: String, required: true },
    jumlah: { type: Number, required: true },
    hargaBeli: { type: Number, required: true },
    total: { type: Number, required: true },
    tanggal: { type: Date, required: true },

    // Petugas yang input
    petugas: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    kodePetugas: { type: String, required: true }
  },
  { timestamps: true }
);

bahanBakuSchema.pre("save", function (next) {
  this.total = this.hargaBeli * this.jumlah;
  next();
});

const bahanBakuModel =
  mongoose.models.bahanBaku || mongoose.model("bahanBaku", bahanBakuSchema);
export default bahanBakuModel;
