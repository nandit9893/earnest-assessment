import express from "express";
import type { Request, Response, NextFunction } from "express";
import Website from "../models/website.models.ts";

const updateWebsite = (req: Request, res: Response, next: NextFunction) => {
  try {
    res
      .status(200)
      .json({ success: true, message: "Website updated successfully" });
  } catch (error) {
    next(error);
  }
};

const getWebsiteData = async (req: Request, res: Response) => {
  try {
    const website = await Website.findOne();
    if(!website) {
      return res.status(409).json({
        success: false,
        message: "Website data not found",
      })
    }
    return res.status(201).json({
      success: true,
      message: "Website fetched successfully",
      data: website,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
      error: message,
    });
  }
};

export { updateWebsite, getWebsiteData };
