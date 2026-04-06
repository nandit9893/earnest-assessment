import express from "express";
import type { Request, Response } from "express";
import Employee from "../models/employee.models.ts";
import { generateSlug } from "../utils/slugify.ts";
import generateTokens from "../utils/generatAccessRefreshToken.ts";
import { accountRegistrationEmail, sendOTPEmail } from "../utils/nodemailer.ts";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.ts";
import generateOTP from "../utils/generate.otp.ts";
import Website from "../models/website.models.ts";

const registerEmployee = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, gender, role, modules } =
    req.body;
  const employeeID = (req as any).employee?._id;

  if (!firstName?.trim())
    return res
      .status(400)
      .json({ success: false, message: "First Name is required" });
  if (!lastName?.trim())
    return res
      .status(400)
      .json({ success: false, message: "Last Name is required" });
  if (!email?.trim())
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  if (!password?.trim())
    return res
      .status(400)
      .json({ success: false, message: "Password is required" });
  if (!gender?.trim())
    return res
      .status(400)
      .json({ success: false, message: "Gender is required" });
  if (!role?.trim())
    return res
      .status(400)
      .json({ success: false, message: "Role ID is required" });
  if (modules && !Array.isArray(modules)) {
    return res.status(400).json({
      success: false,
      message: "Modules must be an array of module IDs",
    });
  }

  try {
    const isEmployeeExist = await Employee.findOne({
      email: email.trim(),
      deleted: false,
    });
    if (isEmployeeExist)
      return res.status(400).json({
        success: false,
        message: "Employee with this email already exists",
      });

    const randomNum = Math.floor(100 + Math.random() * 900);
    const slug = generateSlug(`${firstName} ${lastName} ${randomNum}`);
    const now = new Date();
    const pad = (num: number) => num.toString().padStart(2, "0");
    const empId = `EMP${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

    const employee = await Employee.create({
      employeeID: empId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password: password.trim(),
      gender,
      role,
      slug,
      createdBy: employeeID,
      modules,
    });

    const employeeData = await Employee.findById(employee._id)
      .select("firstName lastName email role")
      .populate<{ role: { roleType: string; permissions: string[] } }>("role");

    const employeeDetails = {
      fullName: `${employeeData?.firstName} ${employeeData?.lastName}`,
      email: employeeData?.email || "",
      password: password.trim(),
      role: employeeData?.role?.roleType || "",
      employeeID: employeeData?.employeeID || "",
    };

    accountRegistrationEmail(employeeDetails);

    return res.status(201).json({
      success: true,
      message: "Employee Created Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create employee",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const loginEmployee = async (req: Request, res: Response) => {
  const { email, password } = req.body || {};

  if (!email?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  if (!password?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }
  try {
    const employee = await Employee.findOne({ email, deleted: false }).select(
      "+password"
    );
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }
    const isPasswordValid = await employee.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
    const { accessToken, refreshToken } = generateTokens(employee);
    employee.refreshToken = refreshToken;
    await employee.save({ validateBeforeSave: false });
    await employee.populate([
      {
        path: "role",
        select: "_id roleType permissions",
      },
      {
        path: "modules",
        select: "_id",
      },
    ]);
    const {
      password: _password,
      refreshToken: _refreshToken,
      ...employeeData
    } = employee.toObject();
    res.clearCookie("refreshToken");

    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        employee: employeeData,
        accessToken,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      success: false,
      message: "Failed to login employee",
      error: message,
    });
  }
};

const updateProfile = async (req: Request, res: Response) => {
  const employeeID = (req as any).employee?._id;
  const { password } = req.body || {};
  const avatarLocalPath = req.file?.path;

  if (!employeeID) {
    return res.status(400).json({
      success: false,
      message: "Employee ID is required",
    });
  }

  try {
    const employee = await Employee.findOne({
      _id: employeeID,
      deleted: false,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (password) employee.password = password.trim();

    if (avatarLocalPath) {
      if (employee.imageURL) {
        await deleteFromCloudinary(employee.imageURL);
      }

      const uploadedImage = await uploadOnCloudinary(avatarLocalPath);

      if (uploadedImage?.secure_url) {
        employee.imageURL = uploadedImage.secure_url;
      }
    }

    await employee.save();

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return res.status(500).json({
      success: false,
      message: "Failed to update employee",
      error: message,
    });
  }
};

const updateEmployee = async (req: Request, res: Response) => {
  const employeeID = (req as any).employee?._id;
  const employeeIDToUpdate = req.query.employeeIDToUpdate;
  const { role, deleted, modules } = req.body || {};

  if (!employeeIDToUpdate) {
    return res.status(400).json({
      success: false,
      message: "Employee ID to update is required",
    });
  }

  try {
    const employee = await Employee.findById(employeeIDToUpdate);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (role) employee.role = role;

    if (deleted !== undefined) employee.deleted = deleted;
    if (employeeID) employee.modifiedBy = employeeID;
    if (modules) {
      if (!Array.isArray(modules)) {
        return res.status(400).json({
          success: false,
          message: "Modules must be an array of module IDs",
        });
      }
      employee.modules = modules;
    }

    await employee.save();

    return res.status(200).json({
      success: true,
      message: "Employee Updated Successfully",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      success: false,
      message: "Failed to update employee",
      error: message,
    });
  }
};

const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const currentEmployeeID = (req as any).employee?._id;
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    const search = (req.query.search as string)?.trim();
    const deleted = req.query.deleted === "true";
    const role = req.query.role;

    const filter: any = { deleted };
    if (currentEmployeeID) filter._id = { $ne: currentEmployeeID };
    if (role && role !== "") filter.role = role;

    let employeesQuery = Employee.find(filter)
      .populate("role")
      .populate("createdBy", "firstName lastName")
      .populate("modifiedBy", "firstName lastName"); 

    if (search) {
      const nameRegex = new RegExp(search, "i");
      employeesQuery = employeesQuery.where({
        $or: [
          { firstName: { $regex: nameRegex } },
          { lastName: { $regex: nameRegex } },
          {
            $expr: {
              $regexMatch: {
                input: { $concat: ["$firstName", " ", "$lastName"] },
                regex: nameRegex,
              },
            },
          },
        ],
      });
    }
    let employees = await employeesQuery
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Employee.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      success: true,
      data: employees,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
      error: message,
    });
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body || {};

  if (!email?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    const employee = await Employee.findOne({
      email: email.trim().toLowerCase(),
      deleted: false,
    });

    if (!employee) {  
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const otp = generateOTP(6);
    const websiteConfig = await Website.findOne();
    const otpTimer = websiteConfig?.otpTimer || 2;

    await employee.setOTP(otp, otpTimer);

    const employeeDetails = {
      fullName: `${employee.firstName} ${employee.lastName}`,
      email: employee.email,
      otp,
    };

    await sendOTPEmail(employeeDetails, otpTimer);
    const employeeData = {
       _id: employee._id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      otpStartTime: employee.otpStartTime,
      otpExpiryTime: employee.otpExpiryTime,
    };

    return res.status(201).json({
      success: true,
      message: "OTP Sent to email. Please Verify to complete login",
      data: employeeData,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      success: false,
      message: "Failed to process forgot password request",
      error: message,
    });
  }
};

const verifyOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body || {};

  if (!email || !email.trim()) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  if (!otp || !otp.trim()) {
    return res.status(400).json({
      success: false,
      message: "OTP is required",
    });
  }

  try {
    const employee = await Employee.findOne({ email, deleted: false });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (!employee.otp || !employee.otpExpiryTime) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or already used",
      });
    }

    if (employee.otpExpiryTime < new Date()) {
      employee.otp = undefined;
      employee.otpStartTime = undefined;
      employee.otpExpiryTime = undefined;
      await employee.save();

      return res.status(400).json({
        success: false,
        message: "OTP expired. Request new",
      });
    }

    if (employee.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    employee.otp = undefined;
    employee.otpStartTime = undefined;
    employee.otpExpiryTime = undefined;
    await employee.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully. You can now reset your password",
      data: {
        _id: employee._id,
        firstName: employee.firstName,
        lastName: employee.lastName,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return res.status(500).json({
      success: false,
      message: "Failed to process forgot password request",
      error: message,
    });
  }
};

const updatePassword = async (req: Request, res: Response) => {
  const { _id, newPassword } = req.body || {};

  if (!_id || !_id.trim()) {
    return res.status(400).json({
      success: false,
      message: "Employee ID is required",
    });
  }

  if (!newPassword || !newPassword.trim()) {
    return res.status(400).json({
      success: false,
      message: "New password is required",
    });
  }

  try {
    const employee = await Employee.findById(_id).select("+password");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const isSamePassword = await employee.isPasswordCorrect(newPassword);

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "Password must be different from previous",
      });
    }

    employee.password = newPassword;
    await employee.save();

    return res.status(200).json({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      success: false,
      message: "Failed to process forgot password request",
      error: message,
    });
  }
};

export {
  registerEmployee,
  loginEmployee,
  updateProfile,
  updateEmployee,
  getAllEmployees,
  forgotPassword,
  verifyOTP,
  updatePassword,
};
