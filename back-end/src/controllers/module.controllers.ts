import express from "express";
import type { Request, Response } from "express";
import Module from "../models/module.models.ts";

const getModules = async (req: Request, res: Response) => {
  try {
    const modules = await Module.find({ deleted: false }).sort({ order: 1 });
    if(!modules) {
      return res.status(404).json({
        success: false,
        message: "No modules found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Modules fetched Successfully",
      data: modules,
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

export { getModules };
