const mongoose = require("mongoose");

const msgSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    required: "Channel is required!",
    ref: "Room",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: "Channel is required!",
    ref: "User",
  },
  message: {
    type: String,
    required: "Message is required!",
  },
});

module.exports = mongoose.model("Msg", msgSchema);
