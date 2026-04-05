import express from "express";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import MailSubject from "../models/mail.subject.models.ts";
import { generateSlug } from "../utils/slugify.ts";

interface CreateSubjectBody {
  subject: string;
  identifier: string;
}

const createSubject = async (req: Request, res: Response) => {
  const { subject, identifier } = req.body as CreateSubjectBody;
  const createdBy = (req as any).employee?._id;

  if (!subject || !subject.trim()) {
    return res.status(400).json({
      success: false,
      message: "Subject is required",
    });
  }
  if (!identifier || !identifier.trim()) {
    return res.status(400).json({
      success: false,
      message: "Identifier is required",
    });
  }

  try {
    const existing = await MailSubject.findOne({
      slug: generateSlug(identifier),
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A subject for this identifier already exists",
      });
    }

    await MailSubject.create({
      subject: subject.trim(),
      slug: generateSlug(identifier),
      createdBy: createdBy ? new mongoose.Types.ObjectId(createdBy) : undefined,
    });

    return res.status(201).json({
      success: true,
      message: "Mail Subject Created Successfully",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      success: false,
      message: "Failed to create mail subject",
      error: message,
    });
  }
};

const getAllSubjects = async (req: Request, res: Response) => {
  const deleted = req.query.deleted === "true";

  try {
    const filter = deleted ? { deleted: true } : { deleted: false };
    const subjects = await MailSubject.find(filter)
      .populate("createdBy", "firstName lastName slug")
      .populate("modifiedBy", "firstName lastName slug");
    if (subjects?.length === 0) {
      return res.status(409).json({
        success: false,
        message: "No Mail Subject found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Mail Subjects fetched successfully",
      data: subjects,
    });
  } catch (error: any) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return res.status(500).json({
      success: false,
      message: "Failed to fetch mail subjects",
      error: message,
    });
  }
};

export { createSubject, getAllSubjects };
