export interface Social {
  _id: string;
  name: string;
  link: string;
}

interface WebsiteData {
  logo?: string;
  title?: string;
  copyright?: string;
  socialLinks?: Social[];
}

export interface GetWebsiteQueryResult {
  website: WebsiteData;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SideBarProps {
  isLeftSideBarOpen: boolean;
  setIsLeftSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export type Column = {
  _id: string;
  fieldName: string;
  fieldLabel: string;
};

export type Task = {
  _id: string;
  [key: string]: any;
};

export type TaskResponse = {
  data: Task[];
  pagination: {
    totalCount: number;
    page: number;
    limit: number;
  };
};

export type Employee = {
  _id: string;
  [key: string]: any;
};

export type EmployeeResponse = {
  data: Employee[];
  pagination: {
    totalCount: number;
    page: number;
    limit: number;
  };
};

export interface TaskData {
  taskName: string;
  status: string;
  startDate: string;
  completedDate: string;
  assignedTo: {
    firstName: string;
    lastName: string;
  };
  createdBy: {
    firstName: string;
    lastName: string;
  };
  description: string;
}

type Module = {
  _id: string;
  moduleName: string;
};
 
export type EmployeeData = {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  gender: string;
  role: string;
  modules: Module[];
};
