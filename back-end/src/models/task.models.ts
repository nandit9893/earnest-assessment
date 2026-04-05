import mongoose, { Model } from "mongoose";

interface ITask extends Document {
  taskID: string;
  taskName: string;
  slug: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed";
  startDate: Date;
  completedDate: Date;
  assignedTo: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy: mongoose.Types.ObjectId;
}

const taskSchema = new mongoose.Schema<ITask>(
  {
    taskID: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    taskName: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Draft"],
      default: "Pending",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    completedDate: {
      type: Date,
      default: Date.now,
    },
    assignedTo: {
      type: mongoose.Types.ObjectId,
      ref: "Employee",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "Employee",
    },
    modifiedBy: {
      type: mongoose.Types.ObjectId,
      ref: "Employee",
    },
  },
  { timestamps: true }
);

const Task: Model<ITask> = mongoose.model<ITask>("Task", taskSchema);

export default Task;
