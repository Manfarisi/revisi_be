import express from "express";
import { getDaftarPelanggan, hapusPelanggan, tambahPelanggan } from "../controllers/pelangganController.js";

const pelangganRouter = express.Router();

pelangganRouter.post("/tambah", tambahPelanggan);
pelangganRouter.get("/daftar", getDaftarPelanggan);
pelangganRouter.delete("/hapus/:id", hapusPelanggan);

export default pelangganRouter;
