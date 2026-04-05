import express from "express";
import type { Request, Response } from "express";
import ModuleField from "../models/module.field.models.ts";

const getModuleFields = async (req: Request, res: Response) => {
  const moduleId = req.query.moduleId as string;
  const showQuery = req.query.show as string | undefined;

  // Validate moduleId
  if (!moduleId) {
    return res.status(400).json({
      success: false,
      message: "Module ID is required",
    });
  }

  const filter: any = { moduleId };

  if (showQuery === "true") filter.show = true;
  else if (showQuery === "false") filter.show = false;

  try {
    const moduleFields = await ModuleField.find(filter).sort({ sequence: 1 });

    if (!moduleFields || moduleFields.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No module fields found for the given module ID",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Module fields fetched successfully",
      data: moduleFields,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return res.status(500).json({
      success: false,
      message: "Failed to fetch module fields",
      error: message,
    });
  }
};

export { getModuleFields };
