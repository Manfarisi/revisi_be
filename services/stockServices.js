import foodModel from "../models/foodModel.js";

// Mengurangi stok produk
export const kurangiStokProduk = async (namaProduk, jumlah) => {
  const produk = await foodModel.findOne({
    namaProduk: new RegExp(`^${namaProduk.trim()}$`, "i"),
  });

  if (!produk) {
    throw new Error("Produk tidak ditemukan di stok");
  }

  const jumlahAngka = Number(jumlah);
  produk.jumlah = Number(produk.jumlah); // pastikan dalam bentuk number

  if (produk.jumlah < jumlahAngka) {
    throw new Error("Stok produk tidak mencukupi");
  }

  produk.jumlah -= jumlahAngka;
  await produk.save();

  return produk;
};


// Menambahkan stok produk (DIBUTUHKAN untuk restore stok saat hapus/edit produk keluar)
export const tambahStokProduk = async (namaProduk, jumlah) => {
  const produk = await foodModel.findOne({
    namaProduk: new RegExp(`^${namaProduk.trim()}$`, "i"),
  });

  if (!produk) throw new Error("Produk tidak ditemukan");

  produk.jumlah += jumlah;
  await produk.save();

  return produk;
};
