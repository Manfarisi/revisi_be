import express from 'express'
import { addDaftarKeluarProduk, editDaftarKeluarProduk, getDaftarKeluarProdukById, listDaftarKeluarProduk, removeDaftarKeluarProduk } from '../controllers/DaftarKeluarController.js'

const ProdukKeluarRouter = express.Router()

ProdukKeluarRouter.post("/produkKeluar",addDaftarKeluarProduk)
ProdukKeluarRouter.get("/daftarProdukKeluar",listDaftarKeluarProduk)
ProdukKeluarRouter.post("/hapusProdukKeluar",removeDaftarKeluarProduk)
ProdukKeluarRouter.post("/editProdukKeluar",editDaftarKeluarProduk)
ProdukKeluarRouter.get("/editProdukKeluar/:id",getDaftarKeluarProdukById)

export default ProdukKeluarRouter
