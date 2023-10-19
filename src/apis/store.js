import { configureStore } from "@reduxjs/toolkit";

// Authentication
import AdminLoginReducer from "./Auth/StoreOwner/Login";
import AdminRegisterReducer from "./Auth/StoreOwner/Register";
import FounderLoginReducer from "./Auth/Login";
import forgetReducer from "./Auth/ForgetPassword";
import resetReducer from "./Auth/OtpValidation";
import updateReducer from "./Auth/UpdatePassword";
//Founder
import AllUsersReducer from "./Users/AllUsers";
import AllStoresReducer from "./Stores/AllStores";
// User
import deleteUserReducer from "./Users/DeleteUsers";
import addUserReducer from "./Users/AddUser";
// Product
import getProductReducer from "./Products/GetProduct";
import AllProductsReducer from "./Products/AllProducts";
import deleteProductReducer from "./Products/DeleteProduct";
import addProductReducer from "./Products/AddProduct";
import updateProductReducer from "./Products/UpdateProduct";
// Orders
import allOrdersReducer from "./Orders/AllOrders";
import archiveOrderReducer from "./Orders/ArchiveOrders";
// Sr Orders
import allSrOrdersReducer from "./Orders/SrOrders"
// Settings
import settingsReducer from "./Info/AdminSettings";
// Report
import getReportReducer from "./Report/GetReports";
import deleteReportReducer from "./Report/DeleteReport";
//Rules
import addTermsReducer from "./Rules/TermsAndConditions"
export default configureStore({
  reducer: {
    // Authorization
    AdminLogin: AdminLoginReducer,
    AdminRegister: AdminRegisterReducer,
    FounderLogin: FounderLoginReducer,
    forget: forgetReducer,
    reset: resetReducer,
    update: updateReducer,
    // Users
    addUser : addUserReducer,
    GetAllUsers: AllUsersReducer,
    GetAllStores: AllStoresReducer, 
    deleteUser: deleteUserReducer,
    // Products
    getProduct: getProductReducer,
    GetAllProducts: AllProductsReducer,
    deleteProduct: deleteProductReducer,
    addProduct: addProductReducer,
    updateProduct: updateProductReducer,
    // Orders
    allOrders: allOrdersReducer,
    archiveOrder: archiveOrderReducer,
    //Sr Orders
    allSrOrders: allSrOrdersReducer,
    // Settings
    settings: settingsReducer,
    // Report
    getReport: getReportReducer,
    deleteReport: deleteReportReducer,
    //Rules
    addTerms : addTermsReducer,
  },
});
