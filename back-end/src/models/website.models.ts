import mongoose, { Document } from "mongoose";

interface IWebsite extends Document {
  title?: string;
  copyright?: string;
  websiteUrl?: string;
  supportNumber: number;
  logo?: string;
  supportEmail: string;
  otpTimer?: number;
  socialLinks?: {
    name: string;
    link: string;
  }[];
  createdBy?: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
}

const websiteSchema = new mongoose.Schema<IWebsite>({
  title: {
    type: String,
  },
  copyright: {
    type: String,
  },
  websiteUrl: {
    type: String,
  },
  supportNumber: {
    type: Number,
    required: true,
  },
  logo: { type: String },
  supportEmail: {
    type: String,
    required: true,
  },
  otpTimer: {
    type: Number,
  },
  socialLinks: [
    {
      name: {
        type: String,
        default: "",
      },
      link: {
        type: String,
        default: "",
      },
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
});

const Website = mongoose.model("Website", websiteSchema);

export default Website;
