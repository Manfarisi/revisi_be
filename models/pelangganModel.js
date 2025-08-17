import mongoose from "mongoose";

const pelangganSchema = new mongoose.Schema({
  customerNumber: {
    type: String,
    required: false, // opsional
  },
  totalTransaksi:{
    type: Number,
    required: true
  }
});

export default mongoose.model("Pelanggan", pelangganSchema);
