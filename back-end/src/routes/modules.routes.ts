import { Router } from "express";
import verifyEmployeeJWT from "../middlewares/employee.auth.middlewares.ts";
import { getModules } from "../controllers/module.controllers.ts";

const moduleRouter = Router();

moduleRouter.route("/").get(verifyEmployeeJWT, getModules);
    
export default moduleRouter;