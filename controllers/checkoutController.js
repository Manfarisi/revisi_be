import checkoutModel from "../models/checkoutModel.js";
import pemasukanModel from "../models/pemasukanModel.js";
import { generateInvoiceCode } from "../models/counterModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";

// ✅ Tambah Data Checkout + Invoice Otomatis
export const tambahCheckout = async (req, res) => {
  const {
    cartItems,
    paymentMethod,
    customerGender,
    customerNumber,
    discountPercent,
    subtotal,
    total,
    userId, // Dikirim dari frontend
  } = req.body;

  try {
    // 1. Validasi user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    // 2. Kurangi stok food per item terlebih dahulu
    for (const item of cartItems) {
      const food = await foodModel.findById(item._id);
      if (!food) {
        return res.status(404).json({ 
          success: false, 
          message: `Produk ${item.namaProduk} tidak ditemukan` 
        });
      }
      if (food.jumlah < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Stok ${item.namaProduk} tidak mencukupi. Tersisa ${food.jumlah}` 
        });
      }
      
      // Kurangi stok dan catat petugas
      food.jumlah -= item.quantity;
      food.petugas = user._id;
      food.kodePetugas = user.kodePetugas;
      await food.save();
    }

    // 3. Generate kode invoice
    const kodePesanan = await generateInvoiceCode();

    // 4. Simpan data checkout
    const checkout = new checkoutModel({
      cartItems: cartItems.map((item) => ({
        ...item,
        kodePesanan,
      })),
      paymentMethod,
      customerGender,
      customerNumber,
      discountPercent,
      subtotal,
      total,
      kodePesanan,
      petugas: user._id,
      kodePetugas: user.kodePetugas,
    });

    await checkout.save();

    // 5. Simpan data pemasukan
    const pemasukan = new pemasukanModel({
      items: cartItems.map((item) => ({
        namaProduk: item.namaProduk,
        kodePesanan,
        quantity: item.quantity,
        hargaSatuan: item.harga,
        total: item.harga * item.quantity,
      })),
      kodePesanan,
      totalPemasukan: total,
      keterangan: `Checkout oleh ${customerGender || "Customer"} (Petugas: ${user.kodePetugas})`,
      tanggal: new Date(),
      checkoutId: checkout._id,
      petugas: user._id,
      kodePetugas: user.kodePetugas,
    });

    await pemasukan.save();

    res.status(201).json({
      success: true,
      message: "Checkout berhasil",
      data: {
        kodePesanan,
        petugas: {
          id: user._id,
          nama: user.username,
          kode: user.kodePetugas,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Gagal melakukan checkout",
    });
  }
};


// ✅ Daftar Semua Checkout
export const daftarCheckout = async (req, res) => {
  try {
    const data = await checkoutModel
      .find()
      .populate("petugas", "username kodePetugas");

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data checkout",
    });
  }
};

// ✅ Hapus Checkout
export const hapusCheckout = async (req, res) => {
  const { id } = req.params;
  try {
    const checkout = await checkoutModel.findByIdAndDelete(id);
    if (!checkout) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan",
      });
    }

    await pemasukanModel.deleteOne({ checkoutId: id });
    res.json({
      success: true,
      message: "Data berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal menghapus data",
    });
  }
};
