import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const initialState = {
  data: {},
  loading: false,
  status: null,
  error: null,
  state: "",
};
const api = "https://ourstores.onrender.com/store/getallproducts"
export const fetchAllProducts = createAsyncThunk(
  "ProductsData/fetchAllProducts",
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
      return {
        message: err.response.data.message,
        status: err.response.status
      };
    }
  }
);

const ProductsSlice = createSlice({
  name: "ProductsData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
      state.loading = true;
      if (action.payload.status === 401) {
        state.error = action.payload;
        state.data = {};
        state.status = 401;
        state.loading = false;
      } else if (action.payload.status === 200){
        state.data = action.payload.data;
        state.status = 200;
        state.error = null;
        state.loading = false;
      }
      else {
        state.error = action.payload.message;
        state.data = {};
        state.status = action.payload.status;
        state.loading = false;
      }
    });
    builder.addCase(fetchAllProducts.pending, (state) => {
      state.state = "pending";
      state.loading = true;
    });
    builder.addCase(fetchAllProducts.rejected, (state, action) => {
      state.loading = false;
      state.status = action.payload;
      state.state = "rejected";
    });
  },
});

export default ProductsSlice.reducer;
