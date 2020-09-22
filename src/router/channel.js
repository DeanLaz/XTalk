const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandlers");
const roomController = require("../controllers/channelController");

const auth = require("../middleware/auth");

router.post("/create", auth, catchErrors(roomController.createRoom));

router.get("/", auth, catchErrors(roomController.getAllRooms));

module.exports = router;
