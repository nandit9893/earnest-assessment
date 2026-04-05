import { Router } from "express";
import verifyEmployeeJWT from "../middlewares/employee.auth.middlewares.ts";
import { createRole, deleteRole, getAllRoles, updateRole } from "../controllers/role.controllers.ts";


const roleRouter = Router();

roleRouter.route("/").post(verifyEmployeeJWT, createRole);
roleRouter.route("/:roleID").put(verifyEmployeeJWT, updateRole);
roleRouter.route("/").delete(verifyEmployeeJWT, deleteRole);
roleRouter.route("/").get(verifyEmployeeJWT, getAllRoles);

export default roleRouter;