import mongoose, { Document, Model } from "mongoose";

type Permission = "Read" | "Create" | "Update" | "Delete" | "Others";

export interface IRole extends Document {
  roleType: string;
  permissions: Permission[];
  createdBy?: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
}

const roleSchema = new mongoose.Schema(
  {
    roleType: {
      type: String,
      required: true,
    },
    permissions: {
      type: [
        {
          type: String,
          enum: ["Read", "Create", "Update", "Delete", "Others"],
        },
      ],
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
  },
  { timestamps: true }
);

const Role: Model<IRole> = mongoose.model<IRole>("Roles", roleSchema);

export default Role;