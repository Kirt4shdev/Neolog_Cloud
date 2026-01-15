import crypto from "node:crypto";
import { envs } from "@shared/envs";

class CryptoTool {
  #key: Buffer = crypto
    .createHash("sha256")
    .update(envs.CRYPTO_TOOL_PASSWORD)
    .digest();

  #algorithm: string = envs.CRYPTO_TOOL_ALGORITHM;

  encrypt(text: string) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.#algorithm, this.#key, iv);

    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");

    return iv.toString("base64") + ":" + encrypted;
  }

  decrypt(encryptedText: string) {
    const [ivBase64, encrypted] = encryptedText.split(":");

    const iv = Buffer.from(ivBase64, "base64");
    const decipher = crypto.createDecipheriv(this.#algorithm, this.#key, iv);

    let decrypted = decipher.update(encrypted, "base64", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }
}

export const cryptoTool = new CryptoTool();
