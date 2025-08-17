import express from "express";
import {
  bahanBakuMasuk,
  daftarBahanBaku,
  editBahanBaku,
  editIdBahanBaku,
  hapusBahanBaku,
  getBahanById,
} from "../controllers/barangMasukController.js";

import {
  daftarBahanKeluar,
  editBahanKeluar,
  editIdBahanKeluar,
  hapusBahanKeluar,
  kurangiBahanBaku,
} from "../controllers/barangKeluarController.js";
import authMiddleware from "../middleware/auth.js";

const bahanBakuRouter = express.Router();

bahanBakuRouter.post("/bahanBakuMasuk", authMiddleware, bahanBakuMasuk);
bahanBakuRouter.get("/daftarBahanBaku", daftarBahanBaku);
bahanBakuRouter.get("/detail/:id", getBahanById);
bahanBakuRouter.post("/hapusBahanBaku", hapusBahanBaku);
bahanBakuRouter.post("/editBahanBaku", editBahanBaku);
bahanBakuRouter.get("/editBahanBaku/:id", editIdBahanBaku);

bahanBakuRouter.post("/kurangiBahanBaku", authMiddleware, kurangiBahanBaku);
bahanBakuRouter.get("/daftarBarangTersisa", daftarBahanKeluar);
bahanBakuRouter.post("/editBahanKeluar", editBahanKeluar);
bahanBakuRouter.get("/editBahanKeluar/:id", editIdBahanKeluar);
bahanBakuRouter.post("/hapusBahanKeluar", hapusBahanKeluar);

export default bahanBakuRouter;
