import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const api = "http://localhost:8080/auth/founder/login";
// const api = "https://ourstores.onrender.com/auth/login";

const initialState = {
  data: {},
  state: "",
  error: null,
  status: null,
  loading: false,
};

export const FounderLogin = createAsyncThunk(
  "FounderData/FounderLogin",
  async (arg) => {
    try {
      const response = await axios.post(api, {
        email: arg.email,
        password: arg.password,
        phone: arg.phone,
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

const FounderSlice = createSlice({
  name: "FounderData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(FounderLogin.fulfilled, (state, action) => {
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
    builder.addCase(FounderLogin.pending, (state) => {
      state.loading = true;
      state.data = {};
      state.state = "Pending";
      state.status = null;
      state.error = null;
    });
    builder.addCase(FounderLogin.rejected, (state) => {
      state.error = "Server Error";
      state.state = "Rejected";
      state.data = {};
      state.status = 500;
      state.loading = false;
    });
  },
});

export default FounderSlice.reducer;
