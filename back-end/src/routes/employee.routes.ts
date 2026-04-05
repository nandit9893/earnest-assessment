import { Router } from "express";
import { forgotPassword, getAllEmployees, loginEmployee, registerEmployee, updateEmployee, updatePassword, updateProfile, verifyOTP } from "../controllers/employee.controllers.ts";
import verifyEmployeeJWT from "../middlewares/employee.auth.middlewares.ts";
import uploadProfile from "../middlewares/upload.profile.middlewares.ts";

const employeeRouter = Router();

employeeRouter.route("/register").post(verifyEmployeeJWT, registerEmployee);
employeeRouter.route("/login").post(loginEmployee);
employeeRouter.route("/updateEmployee").put(verifyEmployeeJWT, updateEmployee);
employeeRouter.route("/updateProfile").put(verifyEmployeeJWT, uploadProfile.single("imageURL"), updateProfile);
employeeRouter.route("/getAllEmployees").get(getAllEmployees);
employeeRouter.route("/forgotPassword").post(forgotPassword);
employeeRouter.route("/verifyOTP").post(verifyOTP);
employeeRouter.route("/updatePassword").patch(updatePassword);

export default employeeRouter;