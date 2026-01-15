export class ServerError extends Error {
  constructor(
    public readonly statusCode: number,
    public override readonly message: string
  ) {
    super(message);
  }

  public static badRequest(message: string) {
    return new ServerError(400, message);
  }

  public static unauthorized(message: string) {
    return new ServerError(401, message);
  }

  public static forbidden(message: string) {
    return new ServerError(403, message);
  }

  public static notFound(message: string) {
    return new ServerError(404, message);
  }

  public static conflict(message: string) {
    return new ServerError(409, message);
  }

  public static unprocessableEntity(message: string) {
    return new ServerError(422, message);
  }

  public static tooManyRequests(message: string) {
    return new ServerError(429, message);
  }

  public static mappingError(message: string) {
    return new ServerError(422, message);
  }

  public static validationError(message: string) {
    return new ServerError(422, message);
  }

  public static internalServer(message: string) {
    return new ServerError(500, message);
  }
}
