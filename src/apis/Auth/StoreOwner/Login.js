import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const api = "http://localhost:8080/auth/store/login";
// const api = "https://ourstores.onrender.com/auth/login";

const initialState = {
  data: {},
  state: "",
  error: null,
  status: null,
  loading: false,
};

export const AdminLogin = createAsyncThunk(
  "LoginData/AdminLogin",
  async (arg) => {
    try {
      const response = await axios.post(api, {
        email: arg.email,
        storeName: arg.storeName,
        password: arg.password,
      });
      return {
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.data.message,
      };
    }
  }
);

const LoginSlice = createSlice({
  name: "LoginData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(AdminLogin.fulfilled, (state, action) => {
      state.loading = true;
      switch (action.payload.status) {
        case 200:
          state.loading = false;
          state.error = "";
          state.data = action.payload.data;
          state.state = "Success";
          state.status = action.payload.status;
          break;
        case 403:
          state.data = {};
          state.loading = false;
          state.state = "Error";
          state.status = action.payload.status;
          state.error = action.payload.message;
          break;
        case 404:
          state.data = {};
          state.loading = false;
          state.state = "Error";
          state.status = action.payload.status;
          state.error = action.payload.message;
          break;
        default:
          state.data = {};
          state.loading = false;
          state.state = "";
          state.error = "";
          state.status = "";
      }
    });
    builder.addCase(AdminLogin.pending, (state) => {
      state.loading = true;
      state.data = {};
      state.state = "Pending";
      state.status = null;
      state.error = null;
    });
    builder.addCase(AdminLogin.rejected, (state) => {
      state.error = "Server Error";
      state.state = "Rejected";
      state.data = {};
      state.status = 500;
      state.loading = false;
    });
  },
});

export default LoginSlice.reducer;
