import axios from "axios";

const URL = `${process.env.NEXT_PUBLIC_BASE_URL}/subject`;

const getSubjects = async (token: string, deleted: Boolean) => {
  try {
    const response = await axios.get(`${URL}?deleted=${deleted}`, {
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

export { getSubjects };
