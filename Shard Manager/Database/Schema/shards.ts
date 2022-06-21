import mongoose from "mongoose";
const ShardSchema = mongoose.model("Shards", new mongoose.Schema({
    name: { type: String },
    ip: { type: String },
    port: { type: String },
    registeredAt: { type: Number, default: Date.now() },
 }));

 export default ShardSchema;