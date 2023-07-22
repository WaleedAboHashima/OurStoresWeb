import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

// const api = "http://192.168.1.2:8000/admin/orders";
const api = "http://localhost:8080/main/orders";

const initialState = {
  data: {},
  state: "",
  status: null,
  error: null,
  loading: false,
};

export const fetchAllOrders = createAsyncThunk(
  "OrdersData/fetchAllOrders",
  async () => {
    try {
      const response = await axios.get(api, {
        headers: { authorization: `Bearer ${cookies.get("_auth_token")}` },
      });
      return response.data;
    } catch (err) {
      return err.response.status;
    }
  }
);

const OrdersSlice = createSlice({
  name: "OrdersData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllOrders.fulfilled, (state, action) => {
      state.loading = true;
      if (action.payload === 403) {
        state.data = {};
        state.status = 403;
        state.state = "Success But With Errors";
        state.loading = false;
        state.error = action.payload;
      } else {
        state.data = action.payload;
        state.error = null;
        state.status = 200;
        state.loading = false;
        state.state = "Success";
      }
    });
    builder.addCase(fetchAllOrders.pending, (state, action) => {
      state.status = null;
      state.error = null;
      state.state = "Pending";
      state.data = {};
      state.loading = true;
    });
  },
});

export default OrdersSlice.reducer;
