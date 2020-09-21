const mongoose = require("mongoose");
const Room = mongoose.model("Room");

exports.createRoom = async (req, res) => {
  const { name } = req.body;

  const nameRegex = /^[A-Za-z\s]+$/;

  if (!nameRegex.test(name))
    throw "A GroupChat can name can contain only alphabets.";

  const roomExists = await Room.findOne({ name });

  if (roomExists) throw "A GroupChat with that name already exists!";

  const room = new Room({
    name,
  });

  await room.save();

  res.json({
    message: "GroupChat created!",
  });
};

exports.getAllRooms = async (req, res) => {
  const rooms = await Room.find({});

  res.json(rooms);
};
