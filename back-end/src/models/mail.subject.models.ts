import mongoose, { Document, Model, Schema } from "mongoose";

export interface IMailSubject extends Document {
  subject: string;
  slug: string;
  createdBy?: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
}

const mailSubjectSchema: Schema<IMailSubject> = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
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
  {
    timestamps: true, 
  }
);

const MailSubject: Model<IMailSubject> = mongoose.model<IMailSubject>(
  "MailSubject",
  mailSubjectSchema
);

export default MailSubject;