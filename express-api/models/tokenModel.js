const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  userID: {
    type: ObjectId,
    ref: "user",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 86400,
  },
});

module.exports = mongoose.model("Token", tokenSchema);
