import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { tokens } from "../../theme";
import { useContext, useEffect, useState } from "react";
import { ColorModeContext } from "./../../theme";
// Icons
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { Formik } from "formik";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AdminForget } from "./../../apis/Auth/ForgetPassword";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
const Forgot = () => {
  // Variables
  const theme = useTheme();
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const [email, setEmail] = useState();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const ForgetState = useSelector((state) => state.forget);
  // Functions
  const handleForm = () => {
    dispatch(AdminForget({ email }));
  };
  const handleForgetPassword = () => {
    if (ForgetState.status === 200) {
      cookies.set("_reset_email", email, {
        maxAge: 60 * 10,
      });
      navigator("/reset");
    } else {
      console.log(ForgetState.status);
      console.log(ForgetState.error);
    }
  };

  useEffect(() => {
    handleForgetPassword();
  }, [ForgetState.status]);
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
        height="668px"
        p="10px 10px 10px 10px"
        width="30%"
      >
        <Box textAlign="right">
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width="100%"
          padding="20px"
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
          <Formik onSubmit={handleForm} initialValues={{ email: "" }}>
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
                style={{ margin: "2% 0", width: "100%" }}
              >
                <Box
                  display="flex"
                  justifyContent="center"
                  flexDirection="column"
                  alignItems="center"
                  gap="20px"
                >
                  <TextField
                    autoFocus
                    variant="outlined"
                    type="email"
                    placeholder="Email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onChangeCapture={(e) => setEmail(e.target.value)}
                    value={values.email}
                    name="email"
                    required
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    sx={{ width: "75%" }}
                  />
                  <Button
                    type="submit"
                    variant="filled"
                    sx={{
                      backgroundColor: "#804fdf",
                      width: "75%",
                      padding: "10px",
                      color: "white",
                    }}
                    // onClick={() => console.log("Clicked")}
                  >
                    Submit
                  </Button>
                </Box>
              </motion.form>
            )}
          </Formik>
          {ForgetState.loading && (
            <Backdrop
              sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
              open={ForgetState.loading ? true : false}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Forgot;
