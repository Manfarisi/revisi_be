import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    kodePetugas: { type: String, unique: true },

    // Role umum
    kategori: {
      type: String,
      enum: ["Admin", "Pegawai"],
      required: true,
    },

    // Bagian sesuai revisi ERD
    bagian: {
      type: String,
      enum: ["Gudang", "Keuangan", "Produksi", "Lainnya"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "Aktif", "rejected"],
      default: "pending",
    },

    namaLengkap: { type: String, required: true },
    jenisKelamin: {
      type: String,
      enum: ["Laki-laki", "Perempuan"],
      required: true,
    },
    noTelepon: { type: String, required: true },
    alamat: { type: String, required: true },

    foto: { type: String, required: true }, // Foto profil
    lastLogin: { type: Date },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const userModel = mongoose.model("user", userSchema);
export default userModel;
