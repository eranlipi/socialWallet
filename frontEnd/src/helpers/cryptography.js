import { createCipheriv, createDecipheriv } from "crypto-browserify";

class Crypto {
  constructor() {
    this.key = new Buffer.from(process.env.REACT_APP_CRYPTO_KEY, "hex");
    this.iv = new Buffer.from(process.env.REACT_APP_CRYPTO_IV, "hex");
  }

  encrypt(str) {
    const cipher = createCipheriv("aes256", this.key, this.iv);
    const encryptedMessage =
      cipher.update(str, "utf-8", "hex") + cipher.final("hex");

    return encryptedMessage;
  }

  decrypt(encryptedStr) {
    const decipher = createDecipheriv("aes256", this.key, this.iv);
    let decryptedMessage = decipher.update(encryptedStr, "hex", "utf-8");
    decryptedMessage += decipher.final("utf-8");

    return decryptedMessage;
  }
}

export default new Crypto();
