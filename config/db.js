import mongoose from "mongoose";

export const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://foodorder:foodorder@foodorder.uhxnw.mongodb.net/food-order').then(()=>console.log("DB Connected"))
}
