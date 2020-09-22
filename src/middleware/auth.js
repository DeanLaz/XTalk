const jwt = require("jwt-then");

module.exports = async (request, response, next) => {
  try {
    if (!request.headers.authorization) throw "Forbidden Authorization";
    const token = request.headers.authorization.split(" ")[1];
    const payload = await jwt.verify(token, process.env.SECRET);
    request.payload = payload;
    next();
  } catch (err) {
    response.status(401).json({
      message: "Forbidden 401",
    });
  }
};
