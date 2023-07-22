import { useTheme } from "@emotion/react";
import { Box, Button, IconButton, Backdrop, CircularProgress, TextField } from "@mui/material";
import { tokens } from "../../theme";
import { useContext, useEffect, useState } from "react";
import { ColorModeContext } from "../../theme";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { Formik } from "formik";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { AdminReset } from "../../apis/Auth/OtpValidation";
import { AdminForget } from "../../apis/Auth/ForgetPassword";
const Reset = () => {
  // Variables
  const theme = useTheme();
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const navigator = useNavigate();
  const State = useSelector((state) => state.reset);
  const [Otp, setOtp] = useState();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  // Functions
  const handleForm = () => {
    dispatch(AdminReset({ Otp }));
  };

  const handleOTP = () => {
    if (State.status === 200) {
      cookies.remove("_reset_email");
      cookies.set("_update_userId", State.data.id);
      navigator("/update");
    }
  };

  const handleReset = () => {
    const email = cookies.get("_reset_email");
    dispatch(AdminForget({ email }));
  };

  useEffect(() => {
    handleOTP();
  }, [State.status]);
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
          <Formik onSubmit={handleForm} initialValues={{ otp: "" }}>
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
                    type="number"
                    placeholder="OTP"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onChangeCapture={(e) => setOtp(e.target.value)}
                    value={values.otp}
                    name="otp"
                    required
                    error={!!touched.otp && !!errors.otp}
                    helperText={touched.otp && errors.otp}
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
          {State.loading && (
            <Backdrop
              sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
              open={State.loading ? true : false}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Reset;
