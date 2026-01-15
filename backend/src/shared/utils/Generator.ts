import crypto, { randomUUID } from "crypto";

export class Generator {
  public static randomBytes(lenght: number): string {
    return crypto.randomBytes(lenght).toString("hex");
  }

  public static uuidv4(): UUID {
    return randomUUID();
  }
}
