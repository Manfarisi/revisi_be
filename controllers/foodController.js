import foodModel from "../models/foodModel.js";
import fs from "fs";
import userModel from "../models/userModel.js";

// === FOOD (Stok Utama) ===

const generateProductCode = (namaProduk, kategori) => {
  // Tambahkan validasi untuk parameter
  if (!namaProduk || !kategori) {
    throw new Error("Nama produk dan kategori diperlukan untuk generate kode");
  }

  // Ambil 3 huruf pertama dan pastikan panjang cukup
  const prefix = namaProduk.toString().slice(0, 3).toUpperCase();
  const categoryCode = kategori.toString().slice(0, 3).toUpperCase();

  // Generate 3 digit angka random
  const randomDigits = Math.floor(100 + Math.random() * 900); // 100-999

  return `${prefix}-${categoryCode}-${randomDigits}`;
};

const addFood = async (req, res) => {
  try {
    // 1. Validasi data yang diperlukan
    if (!req.body.userId || !req.body.namaProduk || !req.body.kategori) {
      return res.status(400).json({
        success: false,
        message: "userId, namaProduk, dan kategori wajib diisi",
      });
    }

    // 2. Validasi file gambar
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Gambar produk wajib diupload",
      });
    }

    // 3. Validasi user
    const user = await userModel.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    // 4. Generate kode produk dengan error handling
    let kodeProduk;
    try {
      kodeProduk = generateProductCode(req.body.namaProduk, req.body.kategori);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // 5. Buat dan simpan data makanan
    const food = new foodModel({
      namaProduk: req.body.namaProduk,
      kodeProduk: kodeProduk,
      harga: Number(req.body.harga),
      jumlah: Number(req.body.jumlah),
      keterangan: req.body.keterangan || "", // default value jika kosong
      kategori: req.body.kategori,
      hpp: Number(req.body.hpp) || 0, // default 0 jika kosong
      image: req.file.filename,
      petugas: user._id,
      kodePetugas: user.kodePetugas || "N/A", // default value jika kosong
    });

    await food.save();

    res.status(201).json({
      success: true,
      message: "Produk berhasil ditambahkan",
      data: {
        id: food._id,
        kodeProduk: food.kodeProduk,
      },
    });
  } catch (error) {
    console.error("Error in addFood:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Terjadi kesalahan server",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const editFood = async (req, res) => {
  try {
    const { id, namaProduk, harga, hpp, keterangan, jumlah, kategori } =
      req.body;
    const food = await foodModel.findById(id);
    if (!food)
      return res
        .status(404)
        .json({ success: false, message: "Food not found" });

    let image_filename = food.image;
    if (req.file) {
      fs.unlink(`uploads/${food.image}`, () => {});
      image_filename = req.file.filename;
    }

    food.namaProduk = namaProduk || food.namaProduk;
    food.harga = harga || food.harga;
    food.keterangan = keterangan || food.keterangan;
    food.jumlah = jumlah || food.jumlah;
    food.hpp = hpp || food.hpp;
    food.kategori = kategori || food.kategori;
    food.image = image_filename;

    await food.save();
    res.json({ success: true, message: "Food updated", data: food });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Update Error" });
  }
};

const editIdFood = async (req, res) => {
  try {
    const { id } = req.params || req.body;
    const food = await foodModel.findById(id);
    if (!food)
      return res
        .status(404)
        .json({ success: false, message: "Food not found" });

    let image_filename = food.image;
    if (req.file) {
      fs.unlink(`uploads/${food.image}`, () => {});
      image_filename = req.file.filename;
    }

    food.image = image_filename;
    await food.save();

    res.json({ success: true, data: food });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const kurangiStokFood = async (req, res) => {
  try {
    const { id, jumlah, userId } = req.body;

    if (!jumlah || isNaN(jumlah) || jumlah <= 0) {
      return res.status(400).json({ success: false, message: "Jumlah tidak valid." });
    }

    const food = await foodModel.findById(id);
    if (!food) {
      return res.status(404).json({ success: false, message: "Produk tidak ditemukan" });
    }

    if (food.jumlah < jumlah) {
      return res.status(400).json({
        success: false,
        message: `Stok tidak mencukupi. Tersisa ${food.jumlah}`,
      });
    }

    // --- Tambahan penting ---
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    // Kurangi stok & catat petugas
    food.jumlah -= jumlah;
    food.petugas = user._id;
    food.kodePetugas = user.kodePetugas;

    await food.save();

    return res.json({
      success: true,
      message: `Stok berhasil dikurangi sebanyak ${jumlah}`,
      data: food,
    });
  } catch (err) {
    console.error("Error kurangi stok:", err);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
};

const getFoodById = async (req, res) => {
  try {
    const { id } = req.params;
    const produk = await foodModel.findById(id);

    if (!produk) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      data: produk,
    });
  } catch (error) {
    console.error("Gagal ambil detail produk:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
};

export {
  // Food
  addFood,
  listFood,
  removeFood,
  editFood,
  editIdFood,
  kurangiStokFood,
  getFoodById,
};
