import mongoose from "mongoose";
const ShardDataSchema = mongoose.model("ShardData", new mongoose.Schema({
    fieldname: { type: String },
    field: { type: String },
    registeredAt: { type: Number, default: Date.now() },
 }));

 export default ShardDataSchema;