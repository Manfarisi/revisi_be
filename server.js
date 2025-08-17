import express from 'express'
import cors from 'cors'
import 'dotenv/config.js'
import { connectDB } from './config/db.js'
import foodRouter from './routes/foodRoute.js'
import bahanBakuRouter from './routes/bahanBakuRoute.js'
import pengeluaranRouter from './routes/PengeluaranRoute.js'
import pemasukanRouter from './routes/pemasukanRouter.js'
// import ProdukKeluarRouter from './routes/ProdukKeluar.js'
import userRouter from './routes/userRoute.js'
import checkoutRouter from './routes/checkoutRoute.js'
import pelangganRouter from './routes/pelangganRoute.js'

// app config
const app = express()
const port = process.env.PORT || 4000
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




// middleware

// vercel

const allowedOrigins = [
  // 'https://vercel-fe-seven.vercel.app',
  'http://localhost:5173'
];
// railway
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked CORS from:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));



// api endpoint
app.use("/images",express.static('uploads')) //untuk foto produk

app.use("/images", express.static("public/images")); //untuk foto pengguna

app.use("/api/food",foodRouter)
app.use("/api/user",userRouter)
app.use("/api/checkout",checkoutRouter)
app.use("/api/pelanggan",pelangganRouter)


// app.use("/api/bahanKeluar",ProdukKeluarRouter)
app.use("/api/bahanBaku",bahanBakuRouter)
app.use("/api/pengeluaran",pengeluaranRouter)
app.use("/api/pemasukan",pemasukanRouter)







//db connec
await connectDB()




app.get("/",(req,res)=>{
    res.send("API WORKING!!!")
})

app.listen(port,()=>{
    console.log(`Server is running on port http://localhost:${port}`)
})

