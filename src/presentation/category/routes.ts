import { Router } from "express";
import { CategoryController } from "./controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { CategoryService } from "../services/category.service";

export class CategoryRoutes {
  static get routes(): Router {
    const router = Router();

    const categoryServ = new CategoryService();
    const controller = new CategoryController(categoryServ);
    // Definir las rutas
    router.post("/", [AuthMiddleware.validateJWT], controller.createCategory);
    router.get("/", controller.getCategories);

    return router;
  }
}
