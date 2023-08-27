import EnumsErrors from "../services/errors/EnumsErrors.js";

export default (error, req, res, next) => {
  let logMessage = "Error";
  switch (error.code) {
    case EnumsErrors.INVALID_PARAM:
      logMessage = "error";
      res.status(400);
      break;

    case EnumsErrors.ERROR_CART:
      logMessage = "warning";
      res.status(400);
      break;

    case EnumsErrors.ERROR_AUTH:
      res.status(401);
      break;

    case EnumsErrors.NOT_FOUND:
      logMessage = "error";
      res.status(404);
      break;

    case EnumsErrors.ERROR_DATABASE:
      logMessage = "fatal";
      res.status(500);
      break;  

    default:
      console.error(error);
      res.status(500);
  }
    req.logger.log(logMessage, { error: error.name, cause: error.cause });

    res.send({
      status: "error",
      error: error.name,
      cause: error.cause,
      info: error.message,
      code: error.code,
    });
};