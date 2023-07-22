import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const api = "http://localhost:8080/auth/store/register";
// const api = "https://ourstores.onrender.com/auth/login";

const initialState = {
  data: {},
  state: "",
  error: null,
  status: null,
  loading: false,
};

export const AdminRegister = createAsyncThunk(
  "RegisterData/AdminRegister",
  async (arg) => {
    try {
      const response = await axios.post(api, arg);
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
const RegisterSlice = createSlice({
  name: "RegisterData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(AdminRegister.fulfilled, (state, action) => {
      state.loading = true;
      switch (action.payload.status) {
        case 201:
          state.loading = false;
          state.error = "";
          state.data = action.payload.data;
          state.state = "Success";
          state.status = action.payload.status;
          break;
        case 409:
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
        case 403:
          state.data = {};
          state.loading = false;
          state.state = "Error in logo";
          state.status = action.payload.status;
          state.error = action.payload.message;
          break;
        default:
          state.data = {};
          state.loading = false;
          state.state = "Error";
          state.error = action.payload.message
          state.status = action.payload.status;
      }
    });
    builder.addCase(AdminRegister.pending, (state) => {
      state.loading = true;
      state.data = {};
      state.state = "Pending";
      state.status = null;
      state.error = null;
    });
    builder.addCase(AdminRegister.rejected, (state) => {
      state.error = "Server Error";
      state.state = "Rejected";
      state.data = {};
      state.status = 500;
      state.loading = false;
    });
  },
});

export default RegisterSlice.reducer;
