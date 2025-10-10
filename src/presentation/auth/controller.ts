import { Request, Response } from "express";

export class AuthController {
  constructor() {}

  signinUser = (req: Request, res: Response) => {
    res.json("signinUser");
  };

  signupUser = (req: Request, res: Response) => {
    res.json("signupUser");
  };

  validateEmail = (req: Request, res: Response) => {
    res.json("validateEmail");
  };
}
