import pengeluaranModel from "../models/pengeluaranModel.js";
import userModel from "../models/userModel.js";

const pengeluaran = async (req, res) => {
  try {
  const user = await userModel.findById(req.body.userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User tidak ditemukan",
    });
  }

  const pengeluaran = new pengeluaranModel({
    nama: req.body.nama,
    jumlah: req.body.jumlah,
    keterangan: req.body.keterangan,
    jenisPengeluaran: req.body.jenisPengeluaran,
    tanggal: req.body.tanggal,
    petugas: user._id,
    kodePetugas: user.kodePetugas,
  });

  // 3. Simpan ke database
    await pengeluaran.save();

    res.status(201).json({ 
      success: true, 
      message: "Pengeluaran berhasil dicatat",
      data: pengeluaran 
    });
  
  }catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      errorType: error.name
    });
  }
}


const daftarPengeluaran = async (req, res) => {
  try {
    const daftarPengeluaran = await pengeluaranModel
      .find({})
      .sort({ tanggal: -1 });
    res.json({ success: true, data: daftarPengeluaran });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// hapus bahan baku item
const hapusPengeluaran = async (req, res) => {
  try {
    const pengeluaran = await pengeluaranModel.findById(req.body.id);
    await pengeluaranModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Pengeluaran Berhasil Dihapus" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// edit bahan baku
const editPengeluaran = async (req, res) => {
  try {
    const {
      id,
      namaPengeluaran,
      jumlah,
      keterangan,
      tanggal,
      jenisPengeluaran,
    } = req.body;

    const pengeluaran = await pengeluaranModel.findById(id);
    if (!pengeluaran) {
      return res
        .status(404)
        .json({ success: false, message: "Pengeluaran tidak ditemukan" });
    }

    // Update data bahan baku
    pengeluaran.namaPengeluaran =
      namaPengeluaran || pengeluaran.namaPengeluaran;
    pengeluaran.jumlah = jumlah || pengeluaran.jumlah;
    pengeluaran.keterangan = keterangan || pengeluaran.keterangan;
    pengeluaran.jenisPengeluaran =
      jenisPengeluaran || pengeluaran.jenisPengeluaran;
    pengeluaran.tanggal = tanggal || pengeluaran.tanggal;
    // bahanBaku.image = image_filename; // jika pakai upload gambar

    await pengeluaran.save();
    res.json({
      success: true,
      message: "Pengeluaran berhasil diperbarui",
      data: pengeluaran,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memperbarui pengeluaran",
    });
  }
};

const editIdPengeluaran = async (req, res) => {
  try {
    const { id } = req.params || req.body;

    const pengeluaran = await pengeluaranModel.findById(id);
    if (!pengeluaran) {
      return res
        .status(404)
        .json({ success: false, message: "Pengeluaran tidak ditemukan" });
    }

    // Update data
    pengeluaran.namaPengeluaran =
      req.body.namaPengeluaran || pengeluaran.namaPengeluaran;
    pengeluaran.jumlah = req.body.jumlah || pengeluaran.jumlah;
    pengeluaran.keterangan = req.body.keterangan || pengeluaran.keterangan;
    pengeluaran.jenisPengeluaran =
      req.body.jenisPengeluaran || pengeluaran.jenisPengeluaran;
    pengeluaran.tanggal = req.body.tanggal || pengeluaran.tanggal;

    await pengeluaran.save();

    res.json({
      success: true,
      message: "Pengeluaran berhasil diperbarui",
      data: pengeluaran,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memperbarui Bahan Baku",
    });
  }
};

export {
  pengeluaran,
  editPengeluaran,
  editIdPengeluaran,
  hapusPengeluaran,
  daftarPengeluaran,
};
