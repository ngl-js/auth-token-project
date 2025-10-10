import { Router } from "express";
import { AuthController } from "./controller";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new AuthController();
    // Definir las rutas
    router.post("/signin", controller.signinUser);
    router.post("/signup", controller.signupUser);
    router.get("/validate-email/:token", controller.validateEmail);

    return router;
  }
}
