import { createAsyncThunk } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import  Cookies  from 'universal-cookie';
import axios from 'axios';


const api = "https://ourstores.onrender.com/store/terms"
// const api = "https://ourstores.onrender.com/store/terms"
const cookie = new Cookies();
const initialState = {
    state: null,
    status: null,
    loading: false,
    error: null
}


export const fetchAddTerms = createAsyncThunk("AddTermsState/fetchAddTerms", async (arg) => {
    try {
        const response = await axios.post(api, {
            terms: arg.terms
        }, { headers: { authorization: `Bearer ${cookie.get("_auth_token")}` } })
        return response.status
    }
    catch (err) {
        return {
            message: err.response.data.message,
            status: err.response.status
        }
    }
})


const AddTermsSlice = createSlice({
    name: "AddTermsState",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAddTerms.fulfilled, (state, action) => {
            state.loading = true;
            if (action.payload === 200) {
                state.loading = false;
                state.state = "Success";
                state.status = action.payload;
            }
            else {
                state.loading = false;
                state.state = "Error";
                state.error = action.payload.message;
                state.status = action.payload.status;
            }
        })
        builder.addCase(fetchAddTerms.rejected, (state, action) => {
            state.loading = false;
            state.state = "Rejected";
            state.status = action.payload.status;
            state.error = action.payload.message;
        })
        builder.addCase(fetchAddTerms.pending, (state) => {
            state.loading = true;
            state.state = "Pending";
        })
    }
})


export default AddTermsSlice.reducer;