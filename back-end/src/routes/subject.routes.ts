import { Router } from "express";
import verifyEmployeeJWT from "../middlewares/employee.auth.middlewares.ts";
import { createSubject, getAllSubjects } from "../controllers/subject.controller.ts";

const subjectRouter = Router();

subjectRouter.route("/").post(verifyEmployeeJWT, createSubject);
subjectRouter.route("/").get( getAllSubjects);

export default subjectRouter;