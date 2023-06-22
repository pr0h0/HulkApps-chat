class HttpError extends Error {
  constructor({ message, status, data }) {
    super(message);
    this.name = "HttpError";

    this.status = status;
    this.data = data;
  }

  static BadRequest(msg) {
    return new HttpError({ message: msg, status: 400 });
  }

  static Unauthorized(msg) {
    return new HttpError({ message: msg, status: 401 });
  }

  static Forbidden(msg) {
    return new HttpError({ message: msg, status: 403 });
  }

  static NotFound(msg) {
    return new HttpError({ message: msg, status: 404 });
  }

  static InternalServerError(msg) {
    return new HttpError({ message: msg, status: 500 });
  }

  static BadGateway(msg) {
    return new HttpError({ message: msg, status: 502 });
  }

  static ServiceUnavailable(msg) {
    return new HttpError({ message: msg, status: 503 });
  }

  static GatewayTimeout(msg) {
    return new HttpError({ message: msg, status: 504 });
  }
}

module.exports = HttpError;
