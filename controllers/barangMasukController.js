import bahanBakuModel from "../models/bahanBakuModel.js";
import userModel from "../models/userModel.js";

// Tambahkan validasi dan error handling yang lebih baik
const generateProductCode = (nama, jenis) => {
  // Validasi input
  if (!nama || !jenis) {
    throw new Error("Nama dan jenis bahan harus diisi");
  }

  // Pastikan jenis adalah string
  if (typeof jenis !== "string") {
    throw new TypeError("Jenis harus berupa string");
  }

  const prefix = nama.slice(0, 3).toUpperCase();
  const categoryCode = jenis.slice(0, 3).toUpperCase();
  const randomDigits = Math.floor(1 + Math.random() * 999)
    .toString()
    .padStart(3, "0");

  return `${prefix}-${categoryCode}-${randomDigits}`;
};

const bahanBakuMasuk = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan. Silakan login ulang.",
      });
    } // userId dari token

    // Ambil data dari body dengan default value
    const {
      nama = "",
      jenis = "",
      kategori = "",
      jumlah = 0,
      satuan = "",
      hargaBeli = 0,
      keterangan = "",
      tanggal = new Date(),
    } = req.body;

    // Konversi angka ke tipe number
    const jumlahNum = Number(jumlah) || 0;
    const hargaBeliNum = Number(hargaBeli) || 0;

    // Hitung total harga
    const total = jumlahNum * hargaBeliNum;
    // Validasi lengkap
    if (!nama.trim() || !jenis.trim() || !kategori.trim() || !satuan.trim()) {
      return res.status(400).json({
        success: false,
        message: "Semua field wajib diisi",
        requiredFields: [
          "nama",
          "jenis",
          "kategori",
          "jumlah",
          "satuan",
          "hargaBeli",
        ],
      });
    }

    // Generate kode bahan unik
    const kodeBahan = generateProductCode(nama, jenis);

    // Buat data baru
    const bahanBaku = new bahanBakuModel({
      nama: nama.trim(),
      jenis: jenis.trim(),
      kategori: kategori.trim(),
      kodeBahan,
      jumlah: jumlahNum,
      hargaBeli: hargaBeliNum,
      total,
      satuan: satuan.trim(),
      keterangan: keterangan?.trim() || "",
      tanggal: new Date(tanggal),
      petugas: user._id, // simpan ID user yang mencatat
      kodePetugas: user.kodePetugas, // tambahkan field ini di schema jika ingin embed
    });

    // Simpan ke database
    await bahanBaku.save();

    res.status(201).json({
      success: true,
      message: "Bahan Baku Berhasil Ditambahkan",
      data: bahanBaku,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      errorType: error.constructor.name,
    });
  }
};

const daftarBahanBaku = async (req, res) => {
  try {
    const bahanBaku = await bahanBakuModel
      .find({})
      .sort({ tanggal: -1 })
      .populate("petugas", "namaLengkap kodePetugas bagian"); // hanya ambil field tertentu

    res.json({ success: true, data: bahanBaku });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// hapus bahan baku item
const hapusBahanBaku = async (req, res) => {
  try {
    const bahanBaku = await bahanBakuModel.findById(req.body.id);
    await bahanBakuModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Bahan Baku Berhasil Dihapus" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// edit bahan baku
const editBahanBaku = async (req, res) => {
  try {
    const {
      id,
      namaBarang,
      jumlah,
      satuan,
      keterangan,
      tanggal,
      jenisPemasukan,
    } = req.body;

    const bahanBaku = await bahanBakuModel.findById(id);
    if (!bahanBaku) {
      return res
        .status(404)
        .json({ success: false, message: "Bahan Baku tidak ditemukan" });
    }

    // Update data bahan baku
    bahanBaku.namaBarang = namaBarang || bahanBaku.namaBarang;
    bahanBaku.jumlah = jumlah || bahanBaku.jumlah;
    bahanBaku.satuan = satuan || bahanBaku.satuan;
    bahanBaku.keterangan = keterangan || bahanBaku.keterangan;
    bahanBaku.jenisPemasukan = jenisPemasukan || bahanBaku.jenisPemasukan;
    bahanBaku.tanggal = tanggal || bahanBaku.tanggal;
    // bahanBaku.image = image_filename; // jika pakai upload gambar

    await bahanBaku.save();
    res.json({
      success: true,
      message: "Bahan Baku berhasil diperbarui",
      data: bahanBaku,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memperbarui Bahan Baku",
    });
  }
};

const editIdBahanBaku = async (req, res) => {
  try {
    const { id } = req.params || req.body;

    const bahanBaku = await bahanBakuModel.findById(id);
    if (!bahanBaku) {
      return res
        .status(404)
        .json({ success: false, message: "Bahan Baku tidak ditemukan" });
    }

    // Update data
    bahanBaku.namaBarang = req.body.namaBarang || bahanBaku.namaBarang;
    bahanBaku.jumlah = req.body.jumlah || bahanBaku.jumlah;
    bahanBaku.keterangan = req.body.keterangan || bahanBaku.keterangan;
    bahanBaku.satuan = req.body.satuan || bahanBaku.satuan;
    bahanBaku.jenisPemasukan =
      req.body.jenisPemasukan || bahanBaku.jenisPemasukan;
    bahanBaku.tanggal = req.body.tanggal || bahanBaku.tanggal;

    await bahanBaku.save();

    res.json({
      success: true,
      message: "Bahan Baku berhasil diperbarui",
      data: bahanBaku,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memperbarui Bahan Baku",
    });
  }
};


const getBahanById = async (req, res) => {
  try {
    const { id } = req.params;
    const bahan = await bahanBakuModel.findById(id);

    if (!bahan) {
      return res.status(404).json({
        success: false,
        message: "Bahan baku tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      data: bahan,
    });
  } catch (error) {
    console.error("Gagal ambil detail bahan baku:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
};

export {
  bahanBakuMasuk,
  daftarBahanBaku,
  hapusBahanBaku,
  getBahanById,
  editBahanBaku,
  editIdBahanBaku,

};
