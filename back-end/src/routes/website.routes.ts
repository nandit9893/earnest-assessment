import { Router } from "express";
import verifyEmployeeJWT from "../middlewares/employee.auth.middlewares.ts";
import { getWebsiteData, updateWebsite } from "../controllers/website.controllers.ts";

const websiteRouter = Router();

websiteRouter.route("/").post(verifyEmployeeJWT, updateWebsite);
websiteRouter.route("/").get(verifyEmployeeJWT, getWebsiteData);

export default websiteRouter;