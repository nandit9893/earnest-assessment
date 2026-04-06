import nodemailer from "nodemailer";
import registerEmployeeTemplate from "./templates/resgister.employee.templates.ts";
import MailSubject from "../models/mail.subject.models.ts";
import Website from "../models/website.models.ts";
import otpTemplate from "./templates/otp.employee.templates.ts";
import addTaskTemplate from "./templates/add.task.templates.ts";``

const sendMail = async (
  email: string,
  subject: string,
  html: string,
  title: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: process.env.NODE_MAILER_USER,
        pass: process.env.NODE_MAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"${title}" <${process.env.NODE_MAILER_USER}>`,
      to: email,
      subject,
      html,
    };

  const info=  await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully");
    console.log("📧 To:", email);
    console.log("📌 Subject:", subject);
    console.log("🆔 Message ID:", info.messageId);
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, message };
  }
};

const accountRegistrationEmail = async (employeeDetails: {
  fullName: string;
  email: string;
  password: string;
  role: string;
  employeeID: string;
}) => {
  const subjectData = await MailSubject.findOne({ slug: "register" }).select(
    "subject"
  );
  const subject = subjectData?.subject || "Account Registration";
  const websiteData = await Website.findOne().select(
    "-createdAt -updatedAt -__v -id -createdBy -modifiedBy"
  );
  const html = registerEmployeeTemplate({
    fullName: employeeDetails.fullName,
    email: employeeDetails.email,
    password: employeeDetails.password,
    role: employeeDetails.role,
    title: websiteData?.title || "Company",
    logo: websiteData?.logo || "",
    websiteUrl: websiteData?.websiteUrl || "#",
    supportEmail: websiteData?.supportEmail || "support@example.com",
    socialLinks: websiteData?.socialLinks || [],
    employeeID: employeeDetails.employeeID,
  });
  await sendMail(
    employeeDetails.email,
    subject,
    html,
    websiteData?.title || "Company"
  );
};

const sendOTPEmail = async (
  employeeDetails: { fullName: string; email: string; otp: string },
  otpTimer: number
) => {
  const subjectData = await MailSubject.findOne({
    slug: "forgot-password",
  }).select("subject");
  const subject =
    `${subjectData?.subject} (${employeeDetails.otp})` || "Your OTP CCode";
  const websiteData = await Website.findOne().select(
    "-createdAt -updatedAt -__v -id -createdBy -modifiedBy"
  );
  const html = otpTemplate({
    fullName: employeeDetails.fullName,
    email: employeeDetails.email,
    otpCode: employeeDetails.otp,
    expiryMinutes: otpTimer,
    title: websiteData?.title || "Company",
    logo: websiteData?.logo || "",
    websiteUrl: websiteData?.websiteUrl || "#",
    supportEmail: websiteData?.supportEmail || "support@example.com",
    socialLinks: websiteData?.socialLinks || [],
  });
  await sendMail(
    employeeDetails.email,
    subject,
    html,
    websiteData?.title || "Company"
  );
};

const sendTaskMail = async (taskDetails: {
  taskID: string;
  taskName: string;
  startDate: string;
  completedDate: string;
  assignedBy: string;
  fullName: string;
  email: string;
}) => {
  const subjectData = await MailSubject.findOne({ slug: "new-task" }).select(
    "subject"
  );
  const subject = `${subjectData?.subject || "New Task Assigned"} (${taskDetails.taskID})`;
  const websiteData = await Website.findOne().select(
    "-createdAt -updatedAt -__v -id -createdBy -modifiedBy"
  );

  const html = addTaskTemplate({
    fullName: taskDetails.fullName,
    email: taskDetails.email,
    taskID: taskDetails.taskID,
    taskName: taskDetails.taskName,
    startDate: taskDetails.startDate,
    completedDate: taskDetails.completedDate,
    assignedBy: taskDetails.assignedBy,
    title: websiteData?.title || "Company",
    logo: websiteData?.logo || "",
    websiteUrl: websiteData?.websiteUrl || "#",
    supportEmail: websiteData?.supportEmail || "support@example.com",
    socialLinks: websiteData?.socialLinks || [],
  });

  await sendMail(
    taskDetails.email,
    subject,
    html,
    websiteData?.title || "Company"
  );
};

export { accountRegistrationEmail, sendOTPEmail, sendTaskMail };
