import { Router } from "express";
import verifyEmployeeJWT from "../middlewares/employee.auth.middlewares.ts";
import { getModuleFields } from "../controllers/module.field.controllers.ts";

const moduleFieldRouter = Router();

moduleFieldRouter.route("/").get(verifyEmployeeJWT, getModuleFields);
    
export default moduleFieldRouter;