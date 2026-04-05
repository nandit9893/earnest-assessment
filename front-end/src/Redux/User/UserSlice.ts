import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: false,
  loading: false,
  message: null,
  accessToken: null,
  currentModule: null,
  isOTPVerified: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = false;
      state.message = null;
    },
    signInSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload.currentUser;
      state.accessToken = action.payload.accessToken;
      state.error = false;
      state.message = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = true;
      state.message = action.payload;
    },
    forgotPasswordStart: (state) => {
      state.loading = true;
      state.error = false;
      state.message = null;
    },
    forgotPasswordSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.error = false;
      state.message = null;
    },
    forgotPasswordFailure: (state, action) => {
      state.loading = false;
      state.error = true;
      state.message = action.payload;
    },
    logoutStart: (state) => {
      state.loading = true;
      state.error = false;
      state.message = null;
    },
    logoutSuccess: (state) => {
      state.currentUser = null;
      state.accessToken = null;
      state.loading = false;
      state.error = false;
      state.message = null;
      state.accessToken = null;
      state.currentModule = null;
    },
    logoutFailure: (state, action) => {
      state.error = true;
      state.loading = false;
      state.message = action.payload;
    },
    verifyOTPStart: (state) => {
      state.loading = true;
      state.error = false;
      state.message = null;
    },
    verifyOTPSuccess: (state, action) => {
      state.loading = false;
      state.message = null;
      state.error = false;
      state.currentUser = action.payload;
      state.isOTPVerified = true;
    },
    verifyOTPFailure: (state, action) => {
      state.loading = false;
      state.error = true;
      state.message = action.payload;
    },
    createTaskStart: (state) => {
      state.loading = true;
      state.error = false;
      state.message = null;
    },
    createTaskSuccess: (state) => {
      state.loading = false;
      state.error = false;
      state.message = null;
    },
    createTaskFailure: (state) => {
      state.loading = false;
      state.error = true;
      state.message = null;
    },
    updateTaskStart: (state) => {
      state.loading = true;
      state.error = false;
      state.message = null;
    },
    updateTaskSuccess: (state) => {
      state.loading = false;
      state.error = false;
      state.message = null;
    },
    updateTaskFailure: (state) => {
      state.loading = false;
      state.error = true;
      state.message = null;
    },
    updatePasswordStart: (state) => {
      state.loading = true;
      state.error = false;
      state.message = null;
    },
    updatePasswordSuccess: (state) => {
      state.loading = false;
      state.error = false;
      state.message = null;
    },
    updatePasswordFailure: (state, action) => {
      state.loading = false;
      state.error = true;
      state.message = action.payload;
    },
    deleteTaskStart: (state) => {
      state.loading = true;
      state.error = false;
      state.message = null;
    },
    deleteTaskSuccess: (state) => {
      state.loading = false;
      state.error = false;
      state.message = null;
    },
    deleteTaskFailure: (state, action) => {
      state.loading = false;
      state.error = true;
      state.message = action.payload;
    },
    registerEmployeeStart: (state) => {
      state.loading = true;
      state.error = false;
      state.message = null;
    },
    registerEmployeeSuccess: (state) => {
      state.loading = false;
      state.error = false;
      state.message = null;
    },
    registerEmployeeFailure: (state) => {
      state.loading = false;
      state.error = true;
      state.message = null;
    },
    resetUserState: (state) => {
      state.loading = false;
      state.error = false;
      state.message = null;
    },
    setModuleID: (state, action) => {
      state.currentModule = action.payload;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  forgotPasswordFailure,
  forgotPasswordStart,
  forgotPasswordSuccess,
  logoutStart,
  logoutSuccess,
  logoutFailure,
  verifyOTPFailure,
  verifyOTPStart,
  verifyOTPSuccess,
  createTaskFailure,
  createTaskStart,
  createTaskSuccess,
  registerEmployeeFailure,
  registerEmployeeStart,
  registerEmployeeSuccess,
  updatePasswordFailure,
  updatePasswordSuccess,
  updatePasswordStart,
  updateTaskFailure,
  updateTaskStart,
  updateTaskSuccess,
  deleteTaskStart,
  deleteTaskFailure,
  deleteTaskSuccess,
  resetUserState,
  setModuleID,
} = userSlice.actions;

export default userSlice.reducer;
