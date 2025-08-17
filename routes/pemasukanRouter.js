import express from 'express'
import { daftarPemasukan, editIdPemasukan, editPemasukan, hapusPemasukan, pemasukan } from '../controllers/pemasukanController.js'

const pemasukanRouter =  express.Router()

pemasukanRouter.post("/pemasukan",pemasukan)
pemasukanRouter.get("/daftarPemasukan",daftarPemasukan)
pemasukanRouter.post("/hapusPemasukan",hapusPemasukan)
pemasukanRouter.post("/editPemasukan",editPemasukan)
pemasukanRouter.get("/editPemasukan/:id",editIdPemasukan)

export default pemasukanRouter