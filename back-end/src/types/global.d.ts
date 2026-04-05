interface RegisterTemplateProps {
  fullName: string;
  email: string;
  password: string;
  role: string;
  title: string;
  logo: string;
  websiteUrl: string;
  supportEmail: string;
  socialLinks: { name: string; link: string }[];
  employeeID: string;
}

interface OTPTemplate {
  fullName: string;
  email: string;
  title: string;
  logo: string;
  websiteUrl: string;
  supportEmail: string;
  socialLinks: Array<{ name: string; link: string }>;
  otpCode: string;
  expiryMinutes?: number;
}

interface AddTaskTemplate {
  fullName: string;
  email: string;
  taskID: string;
  taskName: string;
  startDate: string;
  completedDate: string;
  assignedBy: string;
  title: string;
  logo: string;
  websiteUrl: string;
  supportEmail: string;
  socialLinks: Array<{ name: string; link: string }>;
}
