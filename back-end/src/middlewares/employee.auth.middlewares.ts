import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import Employee from "../models/employee.models.ts";

const   verifyEmployeeJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload;

    const employee = await Employee.findOne({
      _id: decoded._id,
      deleted: false,
    }).select("-password -refreshToken");

    if (!employee) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Employee not found.",
      });
    }

    (req as any).employee = employee;

    next();
  } catch (error: any) {
    let message = "Access denied. Invalid token.";

    if (error.name === "TokenExpiredError") {
      message = "Access denied. Token has expired.";
    }

    return res.status(401).json({
      success: false,
      message,
    });
  }
};

export default verifyEmployeeJWT;