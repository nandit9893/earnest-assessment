import { Router } from "express";
import verifyEmployeeJWT from "../middlewares/employee.auth.middlewares.ts";
import { createTask, deleteTask, getTaskByID, getTasks, updateTask } from "../controllers/task.controllers.ts";

const taskRouter = Router();

taskRouter.route("/").post(verifyEmployeeJWT, createTask);
taskRouter.route("/:taskID").put(verifyEmployeeJWT, updateTask);
taskRouter.route("").get(verifyEmployeeJWT, getTasks);
taskRouter.route("/:taskID").get(verifyEmployeeJWT, getTaskByID);
taskRouter.route("/:taskID").delete(verifyEmployeeJWT, deleteTask);

export default taskRouter;