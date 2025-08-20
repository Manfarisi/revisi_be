import express from 'express'
import { addFood,listFood,removeFood,editFood, editIdFood, kurangiStokFood, getFoodById } from '../controllers/foodController.js'
import multer from 'multer'
import authMiddleware from '../middleware/auth.js';

const foodRouter = express.Router()

// image storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Pastikan folder "uploads" ada
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

    const upload = multer({storage:storage})

foodRouter.post("/add",upload.single("image"),authMiddleware, addFood)
foodRouter.get("/list",listFood)
foodRouter.get("/detail/:id",getFoodById)
foodRouter.post("/remove",removeFood)
foodRouter.post("/edit", upload.single("image"), editFood);
foodRouter.get("/edit/:id", editIdFood);
foodRouter.post("/kurangi-stok",authMiddleware, kurangiStokFood );






    


export default foodRouter