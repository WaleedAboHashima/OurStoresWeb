import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const api = "https://ourstores.onrender.com/store/product/";
const initialState = {
  data: {},
  loading: false,
  error: null,
  status: null,
  state: "",
};

export const deleteProduct = createAsyncThunk(
  "deleteProductData/deleteProduct",
  async (arg) => {
    try {
      const response = await axios.delete(api + arg._id, {
        headers: { authorization: `Bearer ${cookies.get("_auth_token")}` },
      });
      return response.data;
    } catch (err) {
      return {
        status: err.response.status,
        message: err.response.data.message,
      };
    }
  }
);

const deleteProductSlice = createSlice({
  name: "deleteProductData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.loading = true;
      if (action.payload.status === 200) {
        state.data = action.payload;
        state.status = 200;
        state.state = "Deleted."
        state.loading = false;
      } else {
        state.data = {};
        state.loading = false;
        state.status = action.payload.status;
        state.error = action.payload.message;
      }
    });
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.status = action.payload;
      state.state = "rejected";
      state.loading = false;
    });
    builder.addCase(deleteProduct.pending, (state) => {
      state.state = "pending";
      state.loading = true;
    });
  },
});

export default deleteProductSlice.reducer;
