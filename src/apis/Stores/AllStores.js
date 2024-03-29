import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

const api = "https://ourstores.onrender.com/founder/allstores";
// const api = "https://ourstores.onrender.com/admin/users";
const cookies = new Cookies();
const initialState = {
  data: [],
  loading: false,
  error: null,
  status: null,
  state: "",
};

export const fetchAllStores = createAsyncThunk(
  "StoresData/fetchAllStores",
  async () => {
    try {
      const response = await axios.get(api, {
        headers: { authorization: `Bearer ${cookies.get("_auth_token")}` },
      });
      return {
        data: response.data,
        status : response.status
      };
    } catch (err) {
      return { message : err.response.data.message, status: err.response.status };
    }
  }
);

const StoresSlice = createSlice({
  name: "StoresData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllStores.fulfilled, (state, action) => {
      state.loading = true;
      if (action.payload.status === 401) {
        state.status = 401;
        state.data = {};
        state.loading = false;
        state.error = action.payload.message;
        state.state = "UnAuth"
      } else if (action.payload.status === 200) {
        state.data = action.payload.data;
        state.status = action.payload.status;
        state.loading = false;
        state.error = "";
        state.state = "Success";
      }
      else {
        state.status = action.payload.status;
        state.data = {};
        state.loading = false;
        state.error = action.payload.message;
        state.state = "Error"
      }
    });
    builder.addCase(fetchAllStores.rejected, (state) => {
      state.status = 500;
      state.data = {};
      state.error = "Server rejected the connection."
      state.state = "Rejected";
      state.loading = false;
    });
    builder.addCase(fetchAllStores.pending, (state) => {
      state.state = "Pending";
      state.loading = true;
      state.data = {};
      state.error = "";
      state.status = "";
    });
  },
});

export default StoresSlice.reducer;
