import bahanBakuModel from "../models/bahanBakuModel.js";
import BahanBakuKeluarModel from "../models/bahanKeluarModels.js";
import userModel from "../models/userModel.js";

// controller barang keluar untuk barang baku
const kurangiBahanBaku = async (req, res) => {
  try {
    // 1. Ambil user dari token/body
    const user = await userModel.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan. Silakan login ulang.",
      });
    }

    // 2. Ambil data dari body dengan default
    const {
      nama = "",
      jumlah = 0,
      satuan = "",
      jenisPengeluaran = "",
      keterangan = "",
      tanggal = new Date(),
    } = req.body;

    const jumlahAngka = Number(jumlah) || 0;
    if (!nama.trim() || jumlahAngka <= 0 || isNaN(jumlahAngka)) {
      return res.status(400).json({
        success: false,
        message: "Nama barang dan jumlah harus diisi dengan benar",
      });
    }

    // 3. Cari stok bahan baku
    const bahanBaku = await bahanBakuModel.findOne({ nama: nama.trim() });
    if (!bahanBaku) {
      return res.status(404).json({
        success: false,
        message: "Bahan Baku tidak ditemukan",
      });
    }

    // 4. Validasi satuan
    if (satuan.trim() !== (bahanBaku.satuan || "").trim()) {
      return res.status(400).json({
        success: false,
        message: `Satuan tidak sesuai. Harusnya '${bahanBaku.satuan}'`,
      });
    }

    // 5. Validasi stok cukup
    if (jumlahAngka > bahanBaku.jumlah) {
      return res.status(400).json({
        success: false,
        message: "Jumlah melebihi stok yang tersedia",
      });
    }

    // 6. Kurangi stok
    bahanBaku.jumlah -= jumlahAngka;
    bahanBaku.total = bahanBaku.jumlah * bahanBaku.hargaBeli;
    // Tambahkan ini ↓
    bahanBaku.petugas = user._id;
    bahanBaku.kodePetugas = user.kodePetugas || "AUTO";
    await bahanBaku.save();

    // 7. Simpan log keluar (otomatis petugas)
    const logData = {
      nama: nama.trim(),
      jumlah: jumlahAngka,
      satuan: satuan.trim(),
      jenisPengeluaran: jenisPengeluaran.trim(),
      keterangan: keterangan.trim(),
      tanggal: new Date(tanggal),
      petugas: user._id,
      kodePetugas: user.kodePetugas || "AUTO", // default kalau kosong
    };

    const result = await BahanBakuKeluarModel.create(logData);

    res.json({
      success: true,
      message: "Jumlah bahan baku berhasil dikurangi dan log dicatat",
      data: {
        stokBaru: bahanBaku.jumlah,
        log: result,
      },
    });
  } catch (error) {
    console.error("❌ ERROR SERVER:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengurangi bahan baku",
    });
  }
};

const daftarBahanKeluar = async (req, res) => {
  try {
    const dataKeluar = await BahanBakuKeluarModel.find({}).sort({
      tanggal: -1,
    }); // urut terbaru dulu
    res.json({
      success: true,
      message: "Daftar bahan baku yang keluar berhasil diambil",
      data: dataKeluar,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data bahan baku yang keluar",
    });
  }
};

const editBahanKeluar = async (req, res) => {
  try {
    const { id, nama, jumlah, satuan, keterangan, tanggal, jenisPengeluaran } =
      req.body;

    const bahan = await BahanBakuKeluarModel.findById(id); // hanya jika modelnya sama
    if (!bahan) {
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan" });
    }

    // Update data
    bahan.nama = nama || bahan.nama;
    bahan.jumlah = jumlah || bahan.jumlah;
    bahan.satuan = satuan || bahan.satuan;
    bahan.keterangan = keterangan || bahan.keterangan;
    bahan.tanggal = tanggal || bahan.tanggal;
    bahan.jenisPengeluaran = jenisPengeluaran || bahan.jenisPengeluaran;

    // Update jenis sesuai konteks
    if (jenisPengeluaran) bahan.jenisPengeluaran = jenisPengeluaran;

    await bahan.save();

    res.json({
      success: true,
      message: "Data berhasil diperbarui",
      data: bahan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memperbarui data",
    });
  }
};

const editIdBahanKeluar = async (req, res) => {
  try {
    const { id } = req.params || req.body;

    const bahanKeluar = await BahanBakuKeluarModel.findById(id); // Pastikan model ini ada
    if (!bahanKeluar) {
      return res
        .status(404)
        .json({ success: false, message: "Bahan Keluar tidak ditemukan" });
    }

    // Hanya mengizinkan perubahan pada jumlah, keterangan, jenisPengeluaran, dan tanggal
    bahanKeluar.jumlah = req.body.jumlah || bahanKeluar.jumlah;
    bahanKeluar.keterangan = req.body.keterangan || bahanKeluar.keterangan;
    bahanKeluar.jenisPengeluaran =
      req.body.jenisPengeluaran || bahanKeluar.jenisPengeluaran;
    bahanKeluar.tanggal = req.body.tanggal || bahanKeluar.tanggal;

    await bahanKeluar.save();

    res.json({
      success: true,
      message: "Bahan Keluar berhasil diperbarui",
      data: bahanKeluar,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memperbarui Bahan Keluar",
    });
  }
};

const hapusBahanKeluar = async (req, res) => {
  try {
    const bahanKeluar = await BahanBakuKeluarModel.findById(req.body.id);
    if (!bahanKeluar) {
      return res
        .status(404)
        .json({ success: false, message: "Data bahan keluar tidak ditemukan" });
    }

    const bahanAsli = await bahanBakuModel.findOne({
      namaBarang: bahanKeluar.namaBarang,
    });

    if (!bahanAsli) {
      return res
        .status(404)
        .json({ success: false, message: "Bahan baku asal tidak ditemukan" });
    }

    // Kembalikan stok
    bahanAsli.jumlah += bahanKeluar.jumlah;
    await bahanAsli.save();

    // Hapus data bahan keluar
    await BahanBakuKeluarModel.findByIdAndDelete(req.body.id);

    res.json({
      success: true,
      message: "Bahan Baku Keluar berhasil dihapus dan stok diperbarui",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menghapus data",
    });
  }
};

export {
  kurangiBahanBaku,
  daftarBahanKeluar,
  editBahanKeluar,
  editIdBahanKeluar,
  hapusBahanKeluar,
};
