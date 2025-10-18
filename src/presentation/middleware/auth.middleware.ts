import { NextFunction, Request, Response } from "express";
import { UserEntity } from "../../domain";
import { Token } from "../../config";
import { UserModel } from "../../data";

export class AuthMiddleware {
  static async validateJWT(req: Request, res: Response, next: NextFunction) {
    const auth = req.header("Authorization");
    if (!auth) return res.status(400).json({ message: "No token provided" });
    if (!auth.startsWith("Bearer "))
      return res.status(400).json({ message: "Invalid Bearer token" });

    const token = auth.split(" ").at(1) || "";

    try {
      const payload = await Token.validate<{ id: string }>(token);
      if (!payload) return res.status(400).json({ message: "invalid token" });

      const user = await UserModel.findById(payload.id);
      if (!user)
        return res.status(400).json({ message: "Invalid token -user" });

      req.body.user = UserEntity.fromObj(user);
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
