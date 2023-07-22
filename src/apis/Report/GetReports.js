import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies  from 'universal-cookie';

const initialState = {
    data: {},
    state: "",
    error: "",
    status: null,
    loading: false,
}

const api = "http://localhost:8080/founder/reports"
// const api = "http://192.168.1.2:8080/admin/reports"

const cookies = new Cookies();


export const fetchGetReports = createAsyncThunk("GetReportsData/fetchGetReports", async () => {
    try {
        const response = await axios.get(api, { headers: { authorization: `Bearer ${cookies.get("_auth_token")}` } })
        return {
            data: response.data,
            status: response.status
        }
    }
    catch (error) {
        return {
            message: error.response.data.message,
            status: error.response.status
        }
    }
    
})


const GetReportSlice = createSlice({
    name: "GetReportsData",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchGetReports.fulfilled, (state, action) => {
            state.loading = true;
            switch (action.payload.status) {
                case 200:
                    state.data = action.payload.data;
                    state.state = "Success";
                    state.status = action.payload.status;
                    state.loading = false;
                    state.error = "";
                    break;
                case 403:
                    state.data = {};
                    state.state = "Success but with error";
                    state.error = action.payload.message;
                    state.status = action.payload.status;
                    state.loading = false;
                    break;
                default:
                    state.data = {};
                    state.state = "Error";
                    state.error = action.payload.message;
                    state.status = action.payload.status;
                    state.loading = false;
                    break;
            }
        })
        builder.addCase(fetchGetReports.rejected, (state) => {
            state.loading = false;
            state.data = {};
            state.state = "Rejected";
            state.error = "Server Denied Access";
            state.status = 500;
        })
        builder.addCase(fetchGetReports.pending, (state) => {
            state.data = {};
            state.loading = true;
            state.state = "Pending";
            state.status = null;
            state.error = "";
        })
    }
})

export default GetReportSlice.reducer;