import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Hardcoded admin credentials
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";
const ADMIN_USERNAME = "Admin";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Approve user
const approveUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.status = "Aktif";
    await user.save();

    res.json({ success: true, message: "User approved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to approve user" });
  }
};


// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Login sebagai admin hardcoded
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      let admin = await userModel.findOne({ email });

      if (!admin) {
        const hashedPassword = await bcrypt.hash(password, 10);
        admin = await userModel.create({
          username: ADMIN_USERNAME,
          email: ADMIN_EMAIL,
          password: hashedPassword,
          kategori: "Admin",
          bagian: "Admin", // Bagian untuk admin
          namaLengkap: "Administrator Sistem",
          jenisKelamin: "Laki-laki",
          noTelepon: "0000000000",
          alamat: "Kantor Pusat",
          foto: "default.jpg",
          status: "Aktif",
          kodePetugas: "ADM-ADM-000", // tambahkan ini
        });
      }

      const token = createToken(admin._id);
      return res.json({
        success: true,
        message: "Admin logged in successfully",
        token,
        user: {
          username: admin.username,
          email: admin.email,
          kategori: admin.kategori,
          bagian: admin.bagian,
        },
      });
    }

    // Login pegawai
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    if (user.status !== "Aktif") {
      return res.json({
        success: false,
        message: "Akun Anda belum disetujui oleh admin.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id);
    res.json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        username: user.username,
        email: user.email,
        kategori: user.kategori,
        bagian: user.bagian,
      },
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// Fungsi pembuat kode otomatis
const generateKodePetugas = (namaLengkap, bagian) => {
  if (!namaLengkap || !bagian) {
    throw new Error(
      "Nama lengkap dan bagian harus diisi untuk membuat kode petugas"
    );
  }

  const prefixNama = namaLengkap.trim().slice(0, 3).toUpperCase();
  const prefixBagian = bagian.trim().slice(0, 3).toUpperCase();
  const randomDigits = Math.floor(1 + Math.random() * 999)
    .toString()
    .padStart(3, "0");

  return `${prefixNama}-${prefixBagian}-${randomDigits}`;
};

// Register user (pegawai only)
const registerUser = async (req, res) => {
  const {
    username,
    email,
    kodePetugas,
    password,
    namaLengkap,
    jenisKelamin,
    noTelepon,
    alamat,
    bagian, // Tambahan untuk bagian
  } = req.body;

  const foto = req.file?.filename;

  try {
    if (email === ADMIN_EMAIL) {
      return res.json({
        success: false,
        message: "You cannot register as admin",
      });
    }

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 6) {
      return res.json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    if (!bagian) {
      return res.json({
        success: false,
        message: "Bagian harus dipilih",
      });
    }

    const kodePetugas = generateKodePetugas(namaLengkap, bagian);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      username,
      email,
      kodePetugas,
      password: hashedPassword,
      kategori: "Pegawai",
      bagian,
      namaLengkap,
      jenisKelamin,
      noTelepon,
      alamat,
      foto,
      status: "pending",
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token, kodePetugas: user.kodePetugas });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, "-password -__v");
    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal ambil user", error: err });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userModel.findById(id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch user", error });
  }
};

// Update user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, bagian } = req.body;

  try {
    const user = await userModel.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.kategori === "Admin") {
      return res
        .status(403)
        .json({ success: false, message: "Cannot update Admin user" });
    }

    if (email && !validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (bagian) user.bagian = bagian;

    if (password) {
      if (password.length < 6) {
        return res.json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({ success: true, message: "User updated successfully", user });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update user", error });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userModel.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.kategori === "Admin") {
      return res
        .status(403)
        .json({ success: false, message: "Cannot delete Admin user" });
    }

    await userModel.findByIdAndDelete(id);

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete user", error });
  }
};

export {
  loginUser,
  registerUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  approveUser,
};
