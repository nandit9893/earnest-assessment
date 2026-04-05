import express from "express";
import type { Request, Response } from "express";
import Role from "../models/role.models.ts";

const ALLOWED_PERMISSIONS = ["Read", "Write", "Update", "Delete"];

const createRole = async (req: Request, res: Response) => {
  const { roleType, permissions } = req.body || {};
  const adminId = req.employee?._id;

  if (!roleType || !roleType.trim()) {
    return res.status(400).json({
      success: false,
      message: "Role Type is required",
    });
  }

  if (!Array.isArray(permissions) || permissions.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Permissions must be a non-empty array",
    });
  }

  const invalidPermissions = permissions.filter(
    (p) => !ALLOWED_PERMISSIONS.includes(p)
  );

  if (invalidPermissions.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Invalid permissions: ${invalidPermissions.join(", ")}`,
    });
  }

  try {
    const existingRole = await Role.findOne({ roleType: roleType.trim() });

    if (existingRole) {
      return res.status(409).json({
        success: false,
        message: "Role already exists",
      });
    }

    await Role.create({
      roleType: roleType.trim(),
      permissions,
      createdBy: adminId,
    });

    return res.status(201).json({
      success: true,
      message: "Role Added Successfully",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      success: false,
      message: "Failed to create role",
      error: message,
    });
  }
};

const updateRole = async (req: Request, res: Response) => {
  const { roleID } = req.params;
  const { roleType, permissions } = req.body || {};
  const adminId = req.employee?._id;

  if (!roleID) {
    return res.status(400).json({
      success: false,
      message: "Role ID is required",
    });
  }

  if (permissions) {
    if (!Array.isArray(permissions) || permissions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Permissions must be a non-empty array",
      });
    }

    const invalidPermissions = permissions.filter(
      (p) => !ALLOWED_PERMISSIONS.includes(p)
    );

    if (invalidPermissions.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid permissions: ${invalidPermissions.join(", ")}`,
      });
    }
  }

  try {
    const role = await Role.findById(roleID);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    if (roleType && roleType.trim()) {
      const existingRole = await Role.findOne({
        roleType: roleType.trim(),
        _id: { $ne: roleID },
      });

      if (existingRole) {
        return res.status(409).json({
          success: false,
          message: "Role Type already exists",
        });
      }

      role.roleType = roleType.trim();
    }

    if (permissions) {
      role.permissions = permissions;
    }

    role.modifiedBy = adminId;
    await role.save();

    return res.status(200).json({
      success: true,
      message: "Role Updated Successfully",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return res.status(500).json({
      success: false,
      message: "Failed to create role",
      error: message,
    });
  }
};

const deleteRole = async (req: Request, res: Response) => {
  const { roleID } = req.params;

  if (!roleID) {
    return res.status(400).json({
      success: false,
      message: "Role ID is required",
    });
  }

  try {
    const role = await Role.findById(roleID);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    await Role.findByIdAndDelete(roleID);

    return res.status(200).json({
      success: true,
      message: "Role Deleted Successfully",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return res.status(500).json({
      success: false,
      message: "Failed to create role",
      error: message,
    });
  }
};

const getAllRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Role.find({});
    return res.status(200).json({
      success: true,
      message: "Roles fetched Successfully",
      data: roles,
    });
  } catch (error: any) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return res.status(500).json({
      success: false,
      message: "Failed to create role",
      error: message,
    });
  }
};

export default getAllRoles;

export { createRole, updateRole, deleteRole, getAllRoles };
