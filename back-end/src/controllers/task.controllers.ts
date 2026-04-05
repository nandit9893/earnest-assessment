import express from "express";
import type { Request, Response } from "express";
import Task from "../models/task.models.ts";
import { generateSlug } from "../utils/slugify.ts";
import { sendTaskMail } from "../utils/nodemailer.ts";
import Role from "../models/role.models.ts";

const createTask = async (req: Request, res: Response) => {
  const {
    taskName,
    description,
    status,
    startDate,
    completedDate,
    assignedTo,
  } = req.body || {};
  const employeeID = req.employee?._id;

  if (!taskName?.trim())
    return res
      .status(400)
      .json({ success: false, message: "Task Name is required" });

  if (!description?.trim())
    return res
      .status(400)
      .json({ success: false, message: "Description is required" });

  if (!startDate)
    return res
      .status(400)
      .json({ success: false, message: "Start Date is required" });

  if (!completedDate)
    return res
      .status(400)
      .json({ success: false, message: "Completed Date is required" });

  try {
    const slug = generateSlug(taskName);

    const isTaskExist = await Task.findOne({ slug });

    if (isTaskExist)
      return res.status(400).json({
        success: false,
        message: "Task with this name already exists",
      });

    let taskID = "TASK-1";

    const lastTask = await Task.findOne({
      taskID: { $regex: /^TASK-\d+$/ },
    })
      .sort({ taskID: -1 })
      .collation({ locale: "en", numericOrdering: true });

    if (lastTask && lastTask.taskID) {
      const lastNumber = parseInt(lastTask.taskID.split("-")[1]);
      taskID = `TASK-${lastNumber + 1}`;
    }

    const createdTask = await Task.create({
      taskID,
      taskName,
      slug,
      description,
      status: status || "Pending",
      startDate,
      completedDate,
      createdBy: employeeID,
      assignedTo,
    });

    const populatedTask = await Task.findById(createdTask._id)
      .populate({ path: "assignedTo", select: "firstName lastName email" })
      .populate({ path: "createdBy", select: "firstName lastName email" });

    if (
      !populatedTask ||
      !populatedTask.assignedTo ||
      !populatedTask.createdBy
    ) {
      return res.status(500).json({
        success: false,
        message: "Failed to populate task details",
      });
    }

    const taskDetails = {
      taskID,
      taskName,
      description,
      startDate,
      completedDate,
      email: (populatedTask.assignedTo as any).email,
      assignedBy: `${(populatedTask.createdBy as any).firstName} ${(populatedTask.createdBy as any).lastName}`,
      fullName: `${(populatedTask.assignedTo as any).firstName} ${(populatedTask.assignedTo as any).lastName}`,
    };

    if (status && status !== "Draft") {
      sendTaskMail(taskDetails);
    }
    return res.status(201).json({
      success: true,
      message: "Task Created Successfully",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if ((error as any).code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Task ID already exists. Please try again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create task",
      error: message,
    });
  }
};

const updateTask = async (req: Request, res: Response) => {
  const {
    taskName,
    description,
    status,
    startDate,
    completedDate,
    assignedTo,
  } = req.body || {};
  const employeeID = req.employee?._id;
  const taskID = req?.params?.taskID;

  if (!taskID)
    return res
      .status(400)
      .json({ success: false, message: "Task ID is required" });

  try {
    const isTaskExist = await Task.findOne({ _id: taskID });

    if (!isTaskExist)
      return res.status(404).json({
        success: false,
        message: "Task Not found",
      });

    if (taskName) {
      isTaskExist.taskName = taskName;
      isTaskExist.slug = generateSlug(taskName);
    }

    if (description) isTaskExist.description = description;
    if (status) isTaskExist.status = status;
    if (startDate) isTaskExist.startDate = startDate;
    if (completedDate) isTaskExist.completedDate = completedDate;
    if (assignedTo) isTaskExist.assignedTo = assignedTo;
    isTaskExist.modifiedBy = employeeID!;
    await isTaskExist.save();
    return res.status(200).json({
      success: true,
      message: "Task Updated Successfully",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      success: false,
      message: "Failed to update task",
      error: message,
    });
  }
};

const getTasks = async (req: Request, res: Response) => {
  try {
    const { search, startDate, completedDate, status, role } =
      req.query as {
        search?: string;
        startDate?: string;
        completedDate?: string;
        status?: string;
        role?: string;
      };

    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    let query: any = {};

    const userRole = await Role.findById(role || req.employee?.role);

    if (!userRole) {
      return res.status(403).json({
        success: false,
        message: "Role not found",
      });
    }

    const permissions = (userRole.permissions || []) as string[];

    const hasRead = permissions.includes("Read");
    const hasWrite = permissions.includes("Create");
    const hasUpdate = permissions.includes("Update");
    const hasDelete = permissions.includes("Delete");

    const hasFullAccess = hasRead && hasWrite && hasUpdate && hasDelete;

    if (hasFullAccess) {
    } else if (hasRead && hasUpdate && !hasWrite && !hasDelete) {
      query.assignedTo = req.employee?._id;
      query.status = { $ne: "Draft" };
    } else {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to read tasks",
      });
    }

    if (status && status !== "all") {
      query.status = status;
    }

    if (startDate && completedDate) {
      const start = new Date(startDate);
      const end = new Date(completedDate);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        query.startDate = { $lte: end };
        query.completedDate = { $gte: start };
      }
    }

    if (search && search.trim() !== "") {
      query.$or = [
        { taskName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { taskID: { $regex: search, $options: "i" } },
      ];
    }

    const [tasks, totalCount] = await Promise.all([
      Task.find(query)
        .populate("assignedTo", "firstName lastName email employeeID")
        .populate("createdBy", "firstName lastName email employeeID")
        .populate("modifiedBy", "firstName lastName email employeeID")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Task.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      data: tasks,
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
      message: "Failed to fetch tasks",
      error: message,
    });
  }
};

const getTaskByID = async (req: Request, res: Response) => {
  const taskID = req.params.taskID;
  if (!taskID)
    return res
      .status(400)
      .json({ success: false, message: "Task ID is required" });

  try {
    const query: any = { _id: taskID };
    const isTaskExist = await Task.findOne(query)
      .populate("assignedTo", "firstName lastName role")
      .populate("createdBy", "firstName lastName role")
      .populate("modifiedBy", "firstName lastName role");
    if (!isTaskExist)
      return res.status(404).json({
        success: false,
        message: "Task Not found",
      });

    return res.status(200).json({
      success: true,
      message: "Task fetched Successfully",
      data: isTaskExist,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      success: false,
      message: "Failed to fetch task",
      error: message,
    });
  }
};

const deleteTask = async (req: Request, res: Response) => {
  const taskID = req?.params?.taskID;

  if (!taskID) {
    return res.status(400).json({
      success: false,
      message: "Task ID is required",
    });
  }

  try {
    const isTaskExist = await Task.findById(taskID);

    if (!isTaskExist) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
    await Task.findByIdAndDelete(taskID);

    return res.status(200).json({
      success: true,
      message: "Task Deleted Successfully",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return res.status(500).json({
      success: false,
      message: "Failed to delete task",
      error: message,
    });
  }
};

export { createTask, updateTask, getTasks, getTaskByID, deleteTask };
