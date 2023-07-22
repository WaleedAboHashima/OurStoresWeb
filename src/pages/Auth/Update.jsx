import { useTheme } from "@emotion/react";
import { Box, Button, IconButton, TextField, Backdrop, CircularProgress } from "@mui/material";
import { tokens } from "../../theme";
import { useContext, useEffect, useState } from "react";
import { ColorModeContext } from "./../../theme";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { Formik } from "formik";
import { motion } from "framer-motion";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AdminUpdate } from "./../../apis/Auth/UpdatePassword";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
const Update = () => {
  // Variables
  const theme = useTheme();
  const navigator = useNavigate();
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const State = useSelector((state) => state.update);
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [newPassword, setnewPassword] = useState();
  const state = useSelector(state => state.update)
  // Functions
  const handleForm = () => {
    dispatch(AdminUpdate({ newPassword }));
  };

  const handleUpdate = () => {
    if (State.status === 200) {
      cookies.remove("_update_Id");
      navigator("/");
    } else if (State.status === 403) {
      console.log("Error");
    } else {
      console.log("Server Error");
    }
  };

  useEffect(() => {
    handleUpdate();
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
          <Formik validationSchema={AdminSchema} onSubmit={handleForm} initialValues={{ newPassword: "" , cofirmPassword: ""}}>
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
                    type="text"
                    placeholder="New Password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onChangeCapture={(e) => setnewPassword(e.target.value)}
                    value={values.newPassword}
                    name="newPassword"
                    required
                    error={!!touched.newPassword && !!errors.newPassword}
                    helperText={touched.newPassword && errors.newPassword}
                    sx={{ width: "75%" }}
                  />
                  <TextField
                    autoFocus
                    variant="outlined"
                    type="text"
                    placeholder="Confirm New Password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onChangeCapture={(e) => setnewPassword(e.target.value)}
                    value={values.cofirmPassword}
                    name="cofirmPassword"
                    required
                    error={!!touched.cofirmPassword && !!errors.cofirmPassword}
                    helperText={touched.cofirmPassword && errors.cofirmPassword}
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
          {state.loading && (
            <Backdrop
              sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
              open={state.loading ? true : false}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const AdminSchema = yup.object().shape({
  newPassword: yup.string().required("Your New Password is required."),
  cofirmPassword: yup
    .string()
    .required("Field Required")
    .oneOf([yup.ref("newPassword"), null], "Password Doesn't Match"),
});

export default Update;
