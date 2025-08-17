import express from 'express'
import { daftarPengeluaran, editIdPengeluaran, editPengeluaran, hapusPengeluaran, pengeluaran } from '../controllers/pengeluaranController.js'
import authMiddleware from '../middleware/auth.js'

const pengeluaranRouter =  express.Router()

pengeluaranRouter.post("/pengeluaran",authMiddleware, pengeluaran)
pengeluaranRouter.get("/daftarPengeluaran",daftarPengeluaran)
pengeluaranRouter.post("/hapusPengeluaran",hapusPengeluaran)
pengeluaranRouter.post("/editPengeluaran",editPengeluaran)
pengeluaranRouter.get("/editPengeluaran/:id",editIdPengeluaran)

export default pengeluaranRouter