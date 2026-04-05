import mongoose, { Document, Model } from "mongoose";

export interface IModule extends Document {
  moduleName: string;
  slug: string;
  iconName: string;
  order: number;
  deleted: Boolean;
}

const moduleSchema = new mongoose.Schema<IModule>(
  {
    moduleName: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    iconName: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Module: Model<IModule> = mongoose.model<IModule>(
  "Module",
  moduleSchema
);

export default Module;

