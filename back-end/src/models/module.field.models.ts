import mongoose, { Document, Model } from "mongoose";

export interface IModuleField extends Document {
  moduleId: mongoose.Schema.Types.ObjectId;
  fieldName: string;
  fieldLabel: string;
  sequence: number;
  show: boolean;
}

const moduleFieldSchema = new mongoose.Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    fieldName: {
      type: String,
      required: true,
    },
    fieldLabel: {
      type: String,
      required: true,
    },
    sequence: {
      type: Number,
      default: 0,
    },
    show: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const ModuleField: Model<IModuleField> = mongoose.model<IModuleField>(
  "ModuleField",
  moduleFieldSchema
);

export default ModuleField;

