"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getEmployees } from "@/Utils/API/employee";
import { getRoles } from "@/Utils/API/role";
import { getTasks } from "@/Utils/API/task";
import { Users, ClipboardList, CheckCircle, Clock, UserPlus, Shield, Eye, Edit, Trash2 } from "lucide-react";

// Color palette
const COLORS = ["#7b57e0", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#8b5cf6"];

interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  deletedEmployees: number;
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  draftTasks: number;
  employeesThisMonth: number;
  tasksThisMonth: number;
  totalRoles: number;
}

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

interface MonthlyData {
  month: string;
  employees: number;
  tasks: number;
}

const Dashboard = () => {
  const user = useSelector((state: { user: any }) => state.user);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    activeEmployees: 0,
    deletedEmployees: 0,
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
    draftTasks: 0,
    employeesThisMonth: 0,
    tasksThisMonth: 0,
    totalRoles: 0,
  });
  const [employeeStatusData, setEmployeeStatusData] = useState<ChartData[]>([]);
  const [taskStatusData, setTaskStatusData] = useState<ChartData[]>([]);
  const [permissionData, setPermissionData] = useState<ChartData[]>([]);
  const [monthlyTrendData, setMonthlyTrendData] = useState<MonthlyData[]>([]);
  const [roles, setRoles] = useState<any[]>([]);

  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  const getCurrentMonthRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { start, end };
  };

  const getLast6Months = () => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: date.toLocaleString("default", { month: "short" }),
        year: date.getFullYear(),
        start: date,
        end: new Date(date.getFullYear(), date.getMonth() + 1, 0),
      });
    }
    return months;
  };

  const fetchData = useCallback(async () => {
    if (!user?.accessToken) return;

    setLoading(true);
    try {
      const { start: monthStart, end: monthEnd } = getCurrentMonthRange();
      const last6Months = getLast6Months();

      // Fetch employees
      const activeEmployeesRes = await getEmployees(
        user.accessToken,
        "",
        "",
        "false",
        1,
        1000
      );
      const deletedEmployeesRes = await getEmployees(
        user.accessToken,
        "",
        "",
        "true",
        1,
        1000
      );
      const allEmployeesRes = await getEmployees(
        user.accessToken,
        "",
        "",
        "",
        1,
        1000
      );

      // Fetch tasks
      const pendingTasksRes = await getTasks(
        user.accessToken,
        "",
        "",
        undefined,
        undefined,
        "Pending",
        1,
        1000
      );
      const completedTasksRes = await getTasks(
        user.accessToken,
        "",
        "",
        undefined,
        undefined,
        "Completed",
        1,
        1000
      );
      const draftTasksRes = await getTasks(
        user.accessToken,
        "",
        "",
        undefined,
        undefined,
        "Draft",
        1,
        1000
      );
      const allTasksRes = await getTasks(
        user.accessToken,
        "",
        "",
        undefined,
        undefined,
        "",
        1,
        1000
      );

      // Fetch roles
      const rolesRes = await getRoles(user.accessToken);

      // Calculate employees created this month
      let employeesThisMonth = 0;
      let tasksThisMonth = 0;
      const monthlyData: { [key: string]: { employees: number; tasks: number } } = {};

      // Initialize monthly data
      last6Months.forEach((month) => {
        monthlyData[month.month] = { employees: 0, tasks: 0 };
      });

      // Process employees for monthly trends
      if (allEmployeesRes?.success && allEmployeesRes.data) {
        allEmployeesRes.data.forEach((emp: any) => {
          const createdAt = new Date(emp.createdAt);
          if (createdAt >= monthStart && createdAt <= monthEnd) {
            employeesThisMonth++;
          }
          // Group by month for trend
          const monthName = createdAt.toLocaleString("default", { month: "short" });
          if (monthlyData[monthName]) {
            monthlyData[monthName].employees++;
          }
        });
      }

      // Process tasks for monthly trends
      if (allTasksRes?.success && allTasksRes.data) {
        allTasksRes.data.forEach((task: any) => {
          const createdAt = new Date(task.createdAt);
          if (createdAt >= monthStart && createdAt <= monthEnd) {
            tasksThisMonth++;
          }
          const monthName = createdAt.toLocaleString("default", { month: "short" });
          if (monthlyData[monthName]) {
            monthlyData[monthName].tasks++;
          }
        });
      }

      // Prepare monthly trend data
      const trendData = last6Months.map((month) => ({
        month: month.month,
        employees: monthlyData[month.month]?.employees || 0,
        tasks: monthlyData[month.month]?.tasks || 0,
      }));

      setMonthlyTrendData(trendData);

      // Set stats
      setStats({
        totalEmployees: allEmployeesRes?.pagination?.totalCount || 0,
        activeEmployees: activeEmployeesRes?.pagination?.totalCount || 0,
        deletedEmployees: deletedEmployeesRes?.pagination?.totalCount || 0,
        totalTasks: allTasksRes?.pagination?.totalCount || 0,
        pendingTasks: pendingTasksRes?.pagination?.totalCount || 0,
        completedTasks: completedTasksRes?.pagination?.totalCount || 0,
        draftTasks: draftTasksRes?.pagination?.totalCount || 0,
        employeesThisMonth,
        tasksThisMonth,
        totalRoles: rolesRes?.data?.length || 0,
      });

      // Set employee status chart data
      setEmployeeStatusData([
        { name: "Active", value: activeEmployeesRes?.pagination?.totalCount || 0, color: COLORS[0] },
        { name: "Deleted", value: deletedEmployeesRes?.pagination?.totalCount || 0, color: COLORS[2] },
      ]);

      // Set task status chart data
      setTaskStatusData([
        { name: "Pending", value: pendingTasksRes?.pagination?.totalCount || 0, color: COLORS[2] },
        { name: "Completed", value: completedTasksRes?.pagination?.totalCount || 0, color: COLORS[1] },
        { name: "Draft", value: draftTasksRes?.pagination?.totalCount || 0, color: COLORS[4] },
      ]);

      // Set roles and permission data
      if (rolesRes?.success && rolesRes.data) {
        setRoles(rolesRes.data);
        const readCount = rolesRes.data.filter((r: any) => r.permissions?.includes("Read")).length;
        const createCount = rolesRes.data.filter((r: any) => r.permissions?.includes("Create")).length;
        const updateCount = rolesRes.data.filter((r: any) => r.permissions?.includes("Update")).length;
        const deleteCount = rolesRes.data.filter((r: any) => r.permissions?.includes("Delete")).length;

        setPermissionData([
          { name: "Read", value: readCount, color: COLORS[0] },
          { name: "Create", value: createCount, color: COLORS[1] },
          { name: "Update", value: updateCount, color: COLORS[4] },
          { name: "Delete", value: deleteCount, color: COLORS[2] },
        ]);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.accessToken]);
  

  useEffect(() => {
    if (user?.accessToken) {
      fetchData();
    }
  }, [user?.accessToken, fetchData]);

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white dark:bg-[#0b1739] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100 dark:bg-${color}-900/20`}>
          <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-2 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#0b1739] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Don't render charts until after component has mounted to avoid dimension issues
  if (!mounted) {
    return (
      <div className="p-2 md:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#0b1739] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 mdp-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-6 space-y-6 overflow-hidden">
      {/* Header */}
      <div className="flex md:flex-row flex-col justify-start md:justify-between items-start md:items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total Employees" value={stats.totalEmployees} icon={Users} color="purple" />
        <StatCard title="Active Employees" value={stats.activeEmployees} icon={UserPlus} color="green" />
        <StatCard title="Total Tasks" value={stats.totalTasks} icon={ClipboardList} color="blue" />
        <StatCard title="Total Roles" value={stats.totalRoles} icon={Shield} color="indigo" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Pending Tasks" value={stats.pendingTasks} icon={Clock} color="orange" />
        <StatCard title="Completed Tasks" value={stats.completedTasks} icon={CheckCircle} color="green" />
        <StatCard title="New Employees (This Month)" value={stats.employeesThisMonth} icon={UserPlus} color="purple" />
        <StatCard title="New Tasks (This Month)" value={stats.tasksThisMonth} icon={ClipboardList} color="blue" />
      </div>

      {/* Charts Grid - Fixed with proper dimensions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Status Pie Chart */}
        <div className="bg-white dark:bg-[#0b1739] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Employee Status</h2>
          <div className="w-full" style={{ minHeight: "300px", height: "auto" }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={employeeStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {employeeStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Status Pie Chart */}
        <div className="bg-white dark:bg-[#0b1739] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Task Status Distribution</h2>
          <div className="w-full" style={{ minHeight: "300px", height: "auto" }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend Line Chart */}
        <div className="bg-white dark:bg-[#0b1739] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Trends (Last 6 Months)</h2>
          <div className="w-full" style={{ minHeight: "350px", height: "auto" }}>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={monthlyTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="employees"
                  stroke="#7b57e0"
                  strokeWidth={2}
                  name="Employees"
                  dot={{ fill: "#7b57e0", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="tasks"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Tasks"
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Permission Distribution Bar Chart */}
        <div className="bg-white dark:bg-[#0b1739] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Permissions Distribution</h2>
          <div className="w-full" style={{ minHeight: "300px", height: "auto" }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={permissionData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="value" name="Number of Roles" fill="#7b57e0">
                  {permissionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Roles Table */}
        <div className="bg-white dark:bg-[#0b1739] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 overflow-auto">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Roles & Permissions</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Permissions</th>
                </tr>
              </thead>
              <tbody>
                {roles.slice(0, 5).map((role, index) => (
                  <tr key={role._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{role.roleType}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 flex-wrap">
                        {role.permissions?.map((perm: string) => (
                          <span
                            key={perm}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              perm === "Read" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
                              perm === "Create" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                              perm === "Update" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                              "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                          >
                            {perm === "Read" && <Eye className="w-3 h-3" />}
                            {perm === "Create" && <UserPlus className="w-3 h-3" />}
                            {perm === "Update" && <Edit className="w-3 h-3" />}
                            {perm === "Delete" && <Trash2 className="w-3 h-3" />}
                            {perm}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {roles.length > 5 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
                +{roles.length - 5} more roles
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;