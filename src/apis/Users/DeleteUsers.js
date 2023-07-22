import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const api = "http://localhost:8080/founder/user/"
const initialState = {
  data: {},
  loading: false,
  error: null,
  status: null,
  state: ''
};

export const deleteUser = createAsyncThunk(
  "userInfo/deleteUser",
  async (arg) => {
    try {
      const response = await axios.delete(api + arg._id, {
        headers: { authorization: `Bearer ${cookies.get("_auth_token")}` },
      });
      return {
        data: response.data,
        status: response.status
      }
    } catch (err) {
      return {
        message: err.response.data.message,
        status: err.response.status
      }
    }
  }
);

const deleteUserSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.loading = true;
      if (action.payload.status === 200) {
        state.data = action.payload.data;
        state.loading = false;
        state.state = "Success";
        state.status = action.payload.status;
        state.error = '';
      } else {
        state.state = "Error";
        state.data = {};
        state.status = action.payload.status;
        state.loading = false;
        state.error = action.payload.message;
      }
    });
    builder.addCase(deleteUser.rejected, (state) => {
      state.status = 500;
      state.state = "Rejected";
      state.loading = false;
      state.data = {};
      state.error = "";
    });
    builder.addCase(deleteUser.pending, (state) => {
      state.state = "Pending";
      state.loading = true;
      state.data = {}; 
      state.error = "";
      state.status = "";
    });
  },
});

export default deleteUserSlice.reducer;