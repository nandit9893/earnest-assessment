import { LoginData } from "@/types";
import axios from "axios";

const URL = `${process.env.NEXT_PUBLIC_BASE_URL}/employee`;

const login = async (loginData: LoginData) => {
  try {
    const response = await axios.post(`${URL}/login`, loginData, {
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

const forgotPasswordRes = async (email: string) => {
  try {
    const response = await axios.post(`${URL}/forgotPassword`, {email}, {
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

const verifyOTP = async (email: string, otp: string) => {
  try {
    const response = await axios.post(`${URL}/verifyOTP`, {email, otp}, {
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

const updatePassword = async (newPassword: string, _id: string) => {
  try {
    const response = await axios.patch(`${URL}/updatePassword`, {newPassword, _id}, {
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

export { login, forgotPasswordRes, verifyOTP, updatePassword };
