require("dotenv").config({ path: "./config/.env" });

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose Connection ERROR: " + err.message);
});

mongoose.connection.once("open", () => {
  console.log("MongoDB Connected!");
});

//Bring in the models
require("./src/models/User");
require("./src/models/Channel");
require("./src/models/Msg");

const app = require(".");

const server = app.listen(3001, () => {
  console.log("Server listening on port 3001");
});

const io = require("socket.io")(server);
const jwt = require("jwt-then");

const Message = mongoose.model("Msg");
const User = mongoose.model("User");

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token;
    const payload = await jwt.verify(token, process.env.SECRET);
    socket.userId = payload.id;
    next();
  } catch (err) {}
});

io.on("connection", (socket) => {
  console.log("Connected: " + socket.userId);

  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.userId);
  });

  socket.on("joinRoom", ({ roomId }) => {
    socket.join(roomId);
    console.log("A user joined chatroom: " + roomId);
  });

  socket.on("leaveRoom", ({ roomId }) => {
    socket.leave(roomId);
    console.log("A user left chatroom: " + roomId);
  });

  socket.on("roomMessage", async ({ roomId, message }) => {
    if (message.trim().length > 0) {
      const user = await User.findOne({ _id: socket.userId });
      const newMessage = new Message({
        room: roomId,
        user: socket.userId,
        message,
      });
      io.to(roomId).emit("newMessage", {
        message,
        name: user.name,
        userId: socket.userId,
      });
      await newMessage.save();
    }
  });
});
