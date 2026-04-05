import axios from "axios";

const URL = `${process.env.NEXT_PUBLIC_BASE_URL}/employee`;

const getEmployees = async (
  token: string,
  search?: string,
  role?: string,
  deleted?: string,
  page: number = 1,
  limit: number = 10
) => {
  try {
    const response = await axios.get(`${URL}/getAllEmployees`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        search,
        role,
        deleted,
        page,
        limit
      }
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

const registerEmployee = async (token: string, employeeData: any) => {
  try {
    const response = await axios.post(`${URL}/register`, employeeData, {
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

export { getEmployees, registerEmployee };