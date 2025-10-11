import jwt from "jsonwebtoken";
import { envs } from "./envs";

const SEED = envs.JWT_SEED;

export class Token {
  static async generate(payload: any, duration: number = 6200) {
    return new Promise((resolve) => {
      jwt.sign(payload, SEED, { expiresIn: duration }, (err, token) => {
        if (err) return resolve(null);
        resolve(token);
      });
    });
  }

  static validate(token: string) {
    return;
  }
}
