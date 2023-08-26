import EnumsErrors from "../services/errors/EnumsErrors.js";

export default (error, req, res, next) => {
  switch (error.code) {
    case EnumsErrors.INVALID_PARAM:
      res.status(400).send({
        status: "error",
        error: error.name,
        cause: error.cause,
        info: error.message,
        code: error.code,
      });
      break;

    case EnumsErrors.ERROR_CART:
      res.status(400).send({
        status: "error",
        error: error.name,
        cause: error.cause,
        info: error.message,
        code: error.code,
      });
      break;

    case EnumsErrors.ERROR_AUTH:
      res.status(401).send({
        status: "error",
        error: error.name,
        cause: error.cause,
        info: error.message,
        code: error.code,
      });
      break;

    case EnumsErrors.NOT_FOUND:
      res.status(404).send({
        status: "error",
        error: error.name,
        cause: error.cause,
        info: error.message,
        code: error.code,
      });
      break;

    case EnumsErrors.ERROR_DATABASE:
      res.status(500).send({
        status: "error",
        error: error.name,
        cause: error.cause,
        info: error.message,
        code: error.code,
      });
      break;  

    default:
      res.send({ status: "error", error: "Unhandled error" });
  }
};