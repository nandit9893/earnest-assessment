import axios from "axios";

const URL = `${process.env.NEXT_PUBLIC_BASE_URL}/modules`;

const sideBarModules = async (token: string) => {
  try {
    const response = await axios.get(`${URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

const getModuleFields = async (token: string, moduleId: string, show: any) => {
  try {
    const response = await axios.get(`${URL}/list?moduleId=${moduleId}&show=${show}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

export { sideBarModules, getModuleFields };