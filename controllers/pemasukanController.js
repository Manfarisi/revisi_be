import pemasukanModel from "../models/pemasukanModel.js";

const pemasukan = async (req, res) => {
  const pemasukan = new pemasukanModel({
    namaPemasukan: req.body.namaPemasukan,
    jumlah: req.body.jumlah,
    keterangan: req.body.keterangan,
    jenisPemasukan: req.body.jenisPemasukan,
    tanggal: req.body.tanggal,
  });

  try {
    await pemasukan.save();
    res.json({ success: true, message: "Pemasukan Berhasil Ditambah" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const daftarPemasukan = async (req, res) => {
  try {
    const daftarPemasukan = await pemasukanModel.find({}).sort({ tanggal: -1 });
    res.json({ success: true, data: daftarPemasukan });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// hapus bahan baku item
const hapusPemasukan = async (req, res) => {
  try {
    const Pemasukan = await pemasukanModel.findById(req.body.id);
    await pemasukanModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Pemasukan Berhasil Dihapus" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// edit bahan baku
const editPemasukan = async (req, res) => {
  try {
    const {
      id,
      namaPemasukan,
      jumlah,
      keterangan,
      tanggal,
      jenisPemasukan,
    } = req.body;

    const pemasukan = await pemasukanModel.findById(id);
    if (!pemasukan) {
      return res
        .status(404)
        .json({ success: false, message: "Pemasukan tidak ditemukan" });
    }

    // Update data bahan baku
    pemasukan.namaPemasukan = namaPemasukan || pemasukan.namaPemasukan;
    pemasukan.jumlah = jumlah || pemasukan.jumlah;
    pemasukan.keterangan = keterangan || pemasukan.keterangan;
    pemasukan.jenisPemasukan = jenisPemasukan || pemasukan.jenisPemasukan;
    pemasukan.tanggal = tanggal || pemasukan.tanggal;
    // bahanBaku.image = image_filename; // jika pakai upload gambar

    await pemasukan.save();
    res.json({
      success: true,
      message: "Pemasukan berhasil diperbarui",
      data: pemasukan,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Terjadi kesalahan saat memperbarui pemasukan",
      });
  }
};

const editIdPemasukan = async (req, res) => {
  try {
    const { id } = req.params || req.body;

    const pemasukan = await pemasukanModel.findById(id);
    if (!pemasukan) {
      return res
        .status(404)
        .json({ success: false, message: "pemasukan tidak ditemukan" });
    }

    // Update data
    pemasukan.namaPemasukan = req.body.namaPemasukan || pemasukan.namaPemasukan;
    pemasukan.jumlah = req.body.jumlah || pemasukan.jumlah;
    pemasukan.keterangan = req.body.keterangan || pemasukan.keterangan;
    pemasukan.jenisPemasukan = req.body.jenisPemasukan || pemasukan.jenisPemasukan;
    pemasukan.tanggal = req.body.tanggal || pemasukan.tanggal;

    await pemasukan.save();

    res.json({
      success: true,
      message: "Pemasukan berhasil diperbarui",
      data: pemasukan,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Terjadi kesalahan saat memperbarui Bahan Baku",
      });
  }
};

export {pemasukan,editPemasukan,editIdPemasukan,hapusPemasukan,daftarPemasukan}