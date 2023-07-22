import {
  Box,
  IconButton,
  TextField,
  Button,
  Link,
  Backdrop,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { ColorModeContext, tokens } from "./../../theme";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import GTranslateIcon from "@mui/icons-material/GTranslate";
import TranslateIcon from "@mui/icons-material/Translate";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import { AdminLogin } from "./../../apis/Auth/StoreOwner/Login";
import jwt from "jwt-decode";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { color, motion } from "framer-motion";
import { LanguageContext } from "../../language";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
const Login = () => {
  // Variables.
  const context = useContext(LanguageContext);
  const theme = useTheme();
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const [email, setEmail] = useState();
  // const [phone, setPhone] = useState();
  const [storeName, setStoreName] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const [hidden, setHidden] = useState(false);
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const AdminData = useSelector((state) => state.AdminLogin);
  // Functions.

  const handleFormSubmit = () => {
    dispatch(AdminLogin({ email, password, storeName }));
  };

  const handleLanguageChange = (newLanguage) => {
    context.setLanguage(newLanguage);
  };

  const handleLogin = () => {
    if (AdminData.status === 200) {
      switch (AdminData.data.role) {
        case "Store":
          const decoded = jwt(AdminData.data.token);
          cookies.set("_auth_token", AdminData.data.token, {
            expires: new Date(decoded.exp * 1000),
            secure: false,
          });
          cookies.set("_auth_username", AdminData.data.storeName, {
            expires: new Date(decoded.exp * 1000),
          });
          cookies.set("_auth_verify", AdminData.data.storeName, {
            expires: new Date(decoded.exp * 1000),
          });
          cookies.set("_auth_id", AdminData.data._id, {
            expires: new Date(decoded.exp * 1000),
          });
          cookies.set(
            "_auth_role",
            AdminData.data.role === "Store" && "83116111114101",
            {
              expires: new Date(decoded.exp * 1000),
            }
          );
          localStorage.setItem("store_logo", AdminData.data.logo);
          window.location.pathname = "/";
          break;
        case "Founder":
          cookies.set("_auth_token", AdminData.data.token, {
            expires: new Date(decoded.exp * 1000),
            secure: false,
          });
          cookies.set("_auth_username", AdminData.data.storeName, {
            expires: new Date(decoded.exp * 1000),
          });
          cookies.set("_auth_verify", AdminData.data.storeName, {
            expires: new Date(decoded.exp * 1000),
          });
          cookies.set("_auth_id", AdminData.data._id, {
            expires: new Date(decoded.exp * 1000),
          });
          cookies.set(
            "_auth_role",
            AdminData.data.role === "Founder" && "70111117110100101114",
            {
              expires: new Date(decoded.exp * 1000),
            }
          );
          window.location.pathname = "/";
          break;
        case "User":
          setError(
            context.language === "ar"
              ? "لا تملك الصلاحيه لتسجيل الدخول"
              : "Access denied"
          );

          break;
        default:
          setError("");
          break;
      }
    } else if (AdminData.status === 404) {
      setError(
        context.language === "ar"
          ? "لا يوجد مستخدم بهذه المعلومات"
          : "There is no assigned account with this info."
      );
    } else if (AdminData.status === 403) {
      setError(
        context.language === "ar" ? "كلمه المرور غير صحيحه" : "Wrong Password."
      );
    } else {
      setError("");
    }
  };

  useEffect(() => {
    handleLogin();
  }, [AdminData.status]);

  return (
    <Box
      display="flex"
      alignItems="center"
      height="100vh"
      width="100vw"
      justifyContent="center"
    >
      <Box
        backgroundColor={colors.whiteAccent[900]}
        p="10px 10px 10px 10px"
        width="30%"
        textAlign={context.language === "en" ? "right" : "left"}
      >
        <Box>
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon sx={{ color: "#804fdf" }} />
            )}
          </IconButton>
          <IconButton
            onClick={() =>
              handleLanguageChange(context.language === "en" ? "ar" : "en")
            }
          >
            {context.language === "en" ? (
              <TranslateIcon
                sx={{
                  color: theme.palette.mode === "dark" ? "white" : "#804fdf",
                }}
              />
            ) : (
              <GTranslateIcon
                sx={{
                  color: theme.palette.mode === "dark" ? "white" : "#804fdf",
                }}
              />
            )}
          </IconButton>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <Box width="100%" height="auto" textAlign="center">
            <img
              src={
                theme.palette.mode === "dark"
                  ? "/assets/LogoDark.jpg"
                  : "/assets/LogoLight.jpg"
              }
              width="50%"
              alt="Logo"
            />
          </Box>
          {/* Container */}
          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={Uschema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <motion.form
                initial={{ opacity: 0, transition: { duration: 0.5 } }}
                animate={{ opacity: 1, transition: { duration: 0.5 } }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
                onSubmit={handleSubmit}
                style={{ margin: "0 0 15% 0", width: "100%" }}
              >
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                  gap="20px"
                >
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder={
                      context.language === "en" ? "Store Name" : "اسم المتجر"
                    }
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onChangeCapture={(e) => setStoreName(e.target.value)}
                    value={values.storeName}
                    required
                    name="storeName"
                    error={!!touched.storeName && !!errors.storeName}
                    helperText={touched.storeName && errors.storeName}
                    sx={{
                      width: "70%",
                    }}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="email"
                    placeholder={
                      context.language === "en" ? "Email" : "البريد الالكتروني"
                    }
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onChangeCapture={(e) => setEmail(e.target.value)}
                    value={values.email}
                    required
                    name="email"
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    sx={{
                      width: "70%",
                    }}
                  />
                  {/* <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder={
                      context.language === "en" ? "Phone" : "رقم الهاتف"
                    }
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onChangeCapture={(e) => setPhone(e.target.value)}
                    value={values.phone}
                    name="phone"
                    required
                    error={!!touched.phone && !!errors.phone}
                    helperText={touched.phone && errors.phone}
                    sx={{ width: "70%" }}
                  /> */}
                  <TextField
                    fullWidth
                    variant="outlined"
                    type={!hidden ? "password" : "text"}
                    placeholder={
                      context.language === "en" ? "Password" : "كلمه المرور"
                    }
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onChangeCapture={(e) => setPassword(e.target.value)}
                    value={values.password}
                    name="password"
                    required
                    error={!!touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                    sx={{ width: "70%" }}
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => setHidden(!hidden)}>
                          {hidden ? (
                            <VisibilityOutlinedIcon
                              sx={{ color: colors.primary[500] }}
                            />
                          ) : (
                            <VisibilityOffOutlinedIcon
                              sx={{ color: colors.primary[500] }}
                            />
                          )}
                        </IconButton>
                      ),
                    }}
                  />
                  <Button
                    type="submit"
                    sx={{
                      width: "70%",
                      backgroundColor: colors.primary[500],
                      padding: "10px",
                      color: "white",
                    }}
                    variant="filled"
                  >
                    {context.language === "en" ? "Sign In" : "تسجيل الدخول"}
                  </Button>
                  <Button
                    type="submit"
                    sx={{
                      width: "70%",
                      backgroundColor: colors.primary[500],
                      padding: "10px",
                      color: "white",
                    }}
                    variant="filled"
                    onClick={() => navigator("/register")}
                  >
                    {context.language === "en" ? "Sign up" : "انشاء حساب"}
                  </Button>
                  {AdminData.loading && (
                    <Backdrop
                      sx={{
                        color: "#fff",
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                      }}
                      open={AdminData.loading ? true : false}
                    >
                      <CircularProgress color="inherit" />
                    </Backdrop>
                  )}

                  <Link
                    sx={{ cursor: "pointer", color: colors.primary[500] }}
                    onClick={() => navigator("/forgot")}
                    underline="hover"
                  >
                    {context.language === "en"
                      ? "Forgot Password ?"
                      : "نسيت كلمه المرور؟"}
                  </Link>
                  <Typography display={"flex"} gap={1}>
                    {context.language === "en"
                      ? "Are you the Founder?"
                      : " هل انت المسؤول ؟ "}
                    <Link
                      onClick={() => navigator("/founder")}
                      underline="hover"
                      sx={{ cursor: "pointer", color: colors.primary[500] }}
                    >
                      {context.language === "en"
                        ? "Login Here!"
                        : "ادخل من هنا!"}
                    </Link>
                  </Typography>
                  <Typography variant="h3">{error}</Typography>
                </Box>
              </motion.form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
};

const initialValues = {
  email: "",
  phone: "",
  storeName: "",
  password: "",
};

const Uschema = yup.object().shape({
  storeName: yup.string().required("Store Name Required"),
  email: yup.string().email().required("Your Email is required."),
  // phone: yup
  //   .number()
  //   .positive()
  //   .integer()
  //   .required("Phone Required")
  //   .typeError("Invalid Phone Number.")
  //   .test(
  //     "12345678910",
  //     "Invalid Number",
  //     (val) => val.toString().length === 10
  //   ),
  password: yup.string().required("Password is Required.").min(5),
});

export default Login;
