require("dotenv").config({ path: "./config/.env" });

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose Connection ERR " + err.message);
});

mongoose.connection.once("open", () => {
  console.log("MongoDB is Connected!");
});

//Bring in the models
require("./models/User");
require("./models/Group");
require("./models/Msg");

const app = require("./app");

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
