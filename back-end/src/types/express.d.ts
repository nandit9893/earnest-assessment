import { IEmployee } from "../models/employee.models.ts";

declare global {
  namespace Express {
    interface Request {
      employee?: IEmployee;
    }
  }
}