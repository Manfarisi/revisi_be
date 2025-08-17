import pelangganModel from "../models/pelangganModel.js";


// POST - Simpan data pelanggan
const tambahPelanggan = async (req, res) => {
  try {
    const { customerNumber, totalTransaksi } = req.body;

    if (!customerNumber) {
      return res.status(400).json({ success: false, message: "NoTelp wajib diisi" });
    }

    // Cek apakah pelanggan dengan nomor ini sudah ada
    const existing = await pelangganModel.findOne({ customerNumber });

    if (existing) {
      // Jika ada, update totalTransaksi
      existing.totalTransaksi += totalTransaksi;
      await existing.save();
      return res.status(200).json({ success: true, message: "Total transaksi diperbarui" });
    }

    // Jika belum ada, buat baru
    const pelangganBaru = new pelangganModel({
      customerNumber,
      totalTransaksi,
    });

    await pelangganBaru.save();
    res.status(201).json({ success: true, message: "Data pelanggan berhasil disimpan" });
  } catch (error) {
    console.error("Error tambah pelanggan:", error);
    res.status(500).json({ success: false, message: "Gagal menyimpan data pelanggan" });
  }
};


// GET - Ambil semua data pelanggan
const getDaftarPelanggan = async (req, res) => {
  try {
    const data = await pelangganModel.find()
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error ambil data pelanggan:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil data pelanggan" });
  }
};

// DELETE - Hapus data pelanggan berdasarkan ID
const hapusPelanggan = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pelangganModel.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
    }

    res.json({ success: true, message: "Data pelanggan berhasil dihapus" });
  } catch (error) {
    console.error("Error hapus pelanggan:", error);
    res.status(500).json({ success: false, message: "Gagal menghapus data pelanggan" });
  }
};

export { getDaftarPelanggan, tambahPelanggan, hapusPelanggan };
