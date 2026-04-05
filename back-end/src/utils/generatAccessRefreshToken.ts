import Employee from "../models/employee.models.ts";
import { Document } from "mongoose";

const generateTokens = <
  T extends Document & {
    generateAccessToken: () => string;
    generateRefreshToken: () => string;
  }
>(
  doc: T
) => {
  const accessToken = doc.generateAccessToken();
  const refreshToken = doc.generateRefreshToken();

  return { accessToken, refreshToken };
};

export default generateTokens;