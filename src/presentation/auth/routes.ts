import { Router } from "express";
import { AuthController } from "./controller";
import { AuthService } from "../services/auth.service";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const authService = new AuthService();
    const controller = new AuthController(authService);
    // Definir las rutas
    router.post("/signin", controller.signinUser);
    router.post("/signup", controller.signupUser);
    router.get("/validate-email/:token", controller.validateEmail);

    return router;
  }
}
