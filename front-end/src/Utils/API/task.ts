import axios from "axios";

const URL = `${process.env.NEXT_PUBLIC_BASE_URL}/task`;

const getTasks = async (
  token: string,
  role: string,
  search?: string,
  startDate?: Date,
  completedDate?: Date,
  status?: string,
  page: number = 1,
  limit: number = 10,
) => {
  try {
    const response = await axios.get(URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        role,
        search,
        status,
        startDate: startDate ? startDate.toISOString() : undefined,
        completedDate: completedDate ? completedDate.toISOString() : undefined,
        page,
        limit,
      },
    });

    if (response.data.success) {
      return response.data;
    }
    return { success: false, message: response.data.message };
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || "No response from the server";

    return { success: false, message: errorMessage };
  }
};

const addTask = async (token: string, taskData: any) => {
  try {
    const response = await axios.post(`${URL}`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    if (response.data.success) {
      return response.data;
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || "No response from the server";
    return { success: false, message: errorMessage };
  }
};

const getTaskByID = async (
  token: string,
  taskID: string
) => {
  try {
    const response = await axios.get(`${URL}/${taskID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      return response.data;
    }
    return { success: false, message: response.data.message };
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || "No response from the server";

    return { success: false, message: errorMessage };
  }
};

const updateTask = async (token: string, taskId: string, payload: any) => {
  try {
    const response = await axios.put(`${URL}/${taskId}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Failed to update task" };
  }
};

const deleteTaskPemrmanent = async (token: string, taskId: string) => {
  try {
    const response = await axios.delete(`${URL}/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Failed to update task" };
  }
};

export { getTasks, addTask, getTaskByID, updateTask, deleteTaskPemrmanent };
