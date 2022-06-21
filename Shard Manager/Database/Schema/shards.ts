const mongoose = require("mongoose");

module.exports = mongoose.model("Shards", new mongoose.Schema({
    name: { type: String },
    ip: { type: String },
    port: { type: String },
    registeredAt: { type: Number, default: Date.now() },
 }));