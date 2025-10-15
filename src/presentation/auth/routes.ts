import { Router } from "express";
import { AuthController } from "./controller";
import { AuthService, EmailService } from "../services";
import { envs } from "../../config";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    const emailServ = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
    );
    const authService = new AuthService(emailServ);
    const controller = new AuthController(authService);
    // Definir las rutas
    router.post("/signin", controller.signinUser);
    router.post("/signup", controller.signupUser);
    router.get("/validate-email/:token", controller.validateEmail);

    return router;
  }
}
