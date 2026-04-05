import mongoose, { Document, Model } from "mongoose";
import jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";

export interface IEmployee extends Document {
  firstName: string;
  lastName: string;
  email: string;
  slug: string;
  password: string;
  gender: "Male" | "Female" | "Other";
  imageURL?: string;
  refreshToken?: string;
  otp?: string;
  otpStartTime?: Date | null;
  otpExpiryTime?: Date | null;
  role: mongoose.Types.ObjectId;
  createdBy?: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deleted: boolean;
  modules: mongoose.Types.ObjectId[];
  employeeID: string;

  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
  setOTP(otp: string, otpTimerInMinutes: number): Promise<void>;
  verifyOTP(otp: string): Promise<boolean>;
}

const employeeSchema = new mongoose.Schema<IEmployee>(
  {
    employeeID: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    imageURL: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    otp: {
      type: String,
    },
    otpStartTime: {
      type: Date,
      default: null,
    },
    otpExpiryTime: {
      type: Date,
      default: null,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roles",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    modules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
      },
    ],
  },
  { timestamps: true }
);

employeeSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

employeeSchema.methods.isPasswordCorrect = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

employeeSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email },
    process.env.ACCESS_TOKEN_SECRET as Secret,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"] }
  );
};

employeeSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET as Secret,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"] }
  );
};

employeeSchema.methods.setOTP = async function (
  otp: string,
  otpTimerInMinutes: number
) {
  const now = new Date();
  this.otp = otp;
  this.otpStartTime = now;
  this.otpExpiryTime = new Date(now.getTime() + otpTimerInMinutes * 60 * 1000);

  await this.save();
};

employeeSchema.methods.verifyOTP = async function (otp: string) {
  if (!this.otp) return false;
  if (this.otpExpiryTime && this.otpExpiryTime < new Date()) return false;

  const isValid = this.otp === otp;

  if (isValid) {
    this.otp = undefined;
    this.otpStartTime = undefined;
    this.otpExpiryTime = undefined;
    await this.save();
  }

  return isValid;
};

const Employee: Model<IEmployee> = mongoose.model<IEmployee>(
  "Employee",
  employeeSchema
);

export default Employee;
