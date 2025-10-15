import { Request, Response } from "express";
import { CustomError, SignInUserDto, SignUpUserDto } from "../../domain";
import { AuthService } from "../services/auth.service";

export class AuthController {
  constructor(public readonly _auth: AuthService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError)
      return res.status(error.statusCode).json({ error: error.message });

    console.log(`${error}`);
    return res.status(500).json({ error: "Internal server error" });
  };

  signupUser = (req: Request, res: Response) => {
    const [error, suDto] = SignUpUserDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this._auth
      .signupUser(suDto!)
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res));
  };

  signinUser = (req: Request, res: Response) => {
    const [error, siDto] = SignInUserDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this._auth
      .signinUser(siDto!)
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res));
  };

  validateEmail = (req: Request, res: Response) => {
    const { token } = req.params;

    this._auth
      .validateEmail(token)
      .then(() => res.json({ message: "Email validated" }))
      .catch((error) => this.handleError(error, res));
  };
}
