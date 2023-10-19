import {
  Box,
  IconButton,
  TextField,
  Button,
  Link,
  Backdrop,
  CircularProgress,
  Typography,
  Select,
  MenuItem,
  Dialog,
  useMediaQuery,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { ColorModeContext, tokens } from "./../../theme";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import GTranslateIcon from "@mui/icons-material/GTranslate";
import TranslateIcon from "@mui/icons-material/Translate";
import { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LanguageContext } from "../../language";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { AdminRegister } from "./../../apis/Auth/StoreOwner/Register";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
const SignUp = () => {
  // Variables.
  const context = useContext(LanguageContext);
  const theme = useTheme();
  const dispatch = useDispatch();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [storeName, setStoreName] = useState();
  const [password, setPassword] = useState();
  const [city, setCity] = useState();
  const [government, setGovernment] = useState();
  const [logoError, setLogoError] = useState("");
  const [currentLocation, setCurrentLocation] = useState();
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 0,
    lng: 0,
  });
  const [error, setError] = useState();
  const [hidden, setHidden] = useState(false);
  const [logo, setLogo] = useState();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const AdminData = useSelector((state) => state.AdminRegister);
  const state = useSelector((state) => state.AdminRegister);
  const governments = [
    {
      name: "Maskat",
      states: [
        { name: "Mutrah" },
        { name: "Bausher" },
        { name: "Seeb" },
        { name: "Al Amerat" },
        { name: "Quriyat" },
      ],
    },
    {
      name: "Zofar",
      states: [
        { name: "Salalah" },
        { name: "Thumrait" },
        { name: "Taqa" },
        { name: "Mirbat" },
        { name: "Rakhiot" },
        { name: "Dhalkut" },
        { name: "Sadh" },
        { name: "Shalim and the Hallaniyat Islands" },
        { name: "Mqshin" },
        { name: "Almazyona" },
      ],
    },
    {
      name: "Aldakhiliyah",
      states: [
        { name: "Nuzwa" },
        { name: "Bahla" },
        { name: "Manh" },
        { name: "Al Hamraa" },
        { name: "Adam" },
        { name: "Ezky" },
        { name: "Samael" },
        { name: "Baddbd" },
        { name: "Al Gabal Al Akhdar" },
      ],
    },
    {
      name: "Al-Dhahirah",
      states: [{ name: "Ibri" }, { name: "Yanqul" }, { name: "Dhank" }],
    },
    {
      name: "Al Batinah North",
      states: [
        { name: "Sohar" },
        { name: "Shinas" },
        { name: "Liwa" },
        { name: "Saham" },
        { name: "Al Khaboura" },
        { name: "Suwayq" },
      ],
    },
    {
      name: "Albatinah South",
      states: [
        { name: "Rustaq" },
        { name: "Al Awabi" },
        { name: "Nakhal" },
        { name: "Wadi Al Maawil" },
        { name: "Barka" },
        { name: "Al-Musannah" },
      ],
    },
    {
      name: "Al Buraimi",
      states: [
        { name: "Al Buraimi State" },
        { name: "Mahdah" },
        { name: "As-Sunaynah" },
      ],
    },
    {
      name: "Al Wusta",
      states: [
        { name: "Haima" },
        { name: "Duqm" },
        { name: "Mahout" },
        { name: "Al Jazer" },
        { name: "Ibra" },
        { name: "Wadi Bani Khalid" },
      ],
    },
    {
      name: "Ash-Sharqiyah North",
      states: [
        { name: "Al-Qabi" },
        { name: "Al-Mudhaibi" },
        { name: "Bidiya" },
        { name: "Dema Wa Thaieen" },
        { name: "Ibra" },
        { name: "Wadi Bani Khalid" },
      ],
    },
    {
      name: "Ash-Sharqiyah South",
      states: [
        { name: "Sur" },
        { name: "Al-Kamil and Al-Wafi" },
        { name: "Jalan Bani Bu Hassan" },
        { name: "Jalan Bani Bu Ali" },
        { name: "Masirah" },
      ],
    },
    {
      name: "Musandam",
      states: [
        { name: "Khasab" },
        { name: "Bukha" },
        { name: "Dibba Al-Bay'ah" },
        { name: "Madha" },
      ],
    },
  ];

  const states = government
    ? governments.find((gover) => gover.name === government && gover.states)
    : "";
  // Functions.

  const handleFileChange = (event) => {
    setLogo(event.target.files[0]);
  };

  const handleFormSubmit = () => {
    const formdata = new FormData();
    formdata.append("email", email);
    formdata.append("password", password);
    formdata.append("phone", phone);
    formdata.append("storeName", storeName);
    formdata.append("government", government);
    formdata.append("location[lat]", selectedLocation.lat);
    formdata.append("location[lng]", selectedLocation.lng);
    formdata.append("city", city);
    formdata.append("logo", logo);
    dispatch(AdminRegister(formdata));
  };

  const handleLanguageChange = (newLanguage) => {
    context.setLanguage(newLanguage);
  };

  const handleRegister = useCallback(() => {
    if (AdminData.status) {
      switch (AdminData.status) {
        case 201:
          window.location.pathname = "/login";
          break;
        case 404:
          setError(
            context.language === "en"
              ? "All Fields Are Required"
              : "يوجد خطأ في البيانات"
          );
          break;
        case 403:
          setLogoError(
            context.language === "en" ? "Logo Required" : "لوجو المتجر مطلوب"
          );
          break;
        case 409: {
          setError(
            context.language === "en"
              ? "Admin already exists."
              : "يوجد مستخدم بهذه البيانات"
          );
          break;
        }
        default:
          setError("");
          break;
      }
    }
  }, [AdminData.status, context.language]);

  const handleMapClick = (event) => {
    const { latLng } = event;
    const lat = latLng.lat();
    const lng = latLng.lng();
    setSelectedLocation({ lat, lng });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          setLoading(false);
        },
        (error) => {
          console.log("Error getting current location:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
    handleRegister();
  }, [AdminData.status, handleRegister]);

  return (
    <Box
      display="flex"
      alignItems="center"
      height="100vh"
      width="100vw"
      justifyContent="center"
    >
      {state.loading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={state.loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}

      <Box
        backgroundColor={colors.whiteAccent[900]}
        p="10px 10px 10px 10px"
        width="70%"
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
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          {logo ? (
            <Box
              sx={{
                width: "40%",
                mx: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                overflow: "hidden",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <img
                width={"250px"}
                height={"250px"}
                src={URL.createObjectURL(logo)}
                alt="uploaded image"
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  borderRadius: 200,
                }}
              />
              <Button
                onClick={() => setLogo("")}
                color="error"
                variant="contained"
              >
                Remove
              </Button>
            </Box>
          ) : (
            <Box
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems={"center"}
              gap={2}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  backgroundColor: "transparent",
                  padding: 5,
                  mx: "auto",
                  width: "300px",
                  height: "200px",
                  border: `2px dashed ${colors.primary[500]}`,
                  borderRadius: 1,
                  "&:hover": {
                    cursor: "pointer",
                    backgroundColor: "#e0e0e010",
                  },
                }}
              >
                <input
                  style={{ display: "none" }}
                  accept="image/*"
                  sx={{ display: "none" }}
                  id="upload-image"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="upload-image">
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <CloudUploadIcon sx={{ fontSize: 48, marginBottom: 1 }} />
                    <Typography variant="h6">
                      {context.language === "en"
                        ? "Upload Store Logo"
                        : "رفع صوره المتجر"}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      {context.language === "en"
                        ? " Click or drag and drop image file here"
                        : " انقر او اسحب الصوره هنا لرفعها"}
                    </Typography>
                  </Box>
                </label>
              </Box>
              <Box color={"red"}>{logoError}</Box>
            </Box>
          )}

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
                style={{ width: "60%" }}
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
                    type="email"
                    placeholder={
                      context.language === "en" ? "Email" : "الايميل الالكتروني"
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
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="number"
                    placeholder={
                      context.language === "en" ? "Phone" : "رقم الهاتف"
                    }
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onChangeCapture={(e) => setPhone(e.target.value)}
                    value={values.phone}
                    required
                    name="phone"
                    error={!!touched.phone && !!errors.phone}
                    helperText={touched.phone && errors.phone}
                    sx={{
                      width: "70%",
                    }}
                  />
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
                  <Select
                    fullWidth
                    variant="outlined"
                    type="text"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      setGovernment(e.target.value);
                    }}
                    name="government"
                    value={values.government}
                    required
                    error={!!touched.government && !!errors.government}
                    helperText={touched.government && errors.government}
                    sx={
                      context.language === "en"
                        ? { textAlign: "left" }
                        : { textAlign: "right" }
                    }
                    style={{ width: "70%" }}
                  >
                    <MenuItem
                      dir={context.language === "en" ? "ltr" : "rtl"}
                      disabled
                      value="Government"
                    >
                      {context.language === "en" ? "Government" : "المحافظه"}
                    </MenuItem>
                    {governments.map((gover) => (
                      <MenuItem
                        dir={context.language === "en" ? "ltr" : "rtl"}
                        key={gover.name}
                        value={gover.name}
                      >
                        {gover.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <Select
                    fullWidth
                    variant="outlined"
                    type="text"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      setCity(e.target.value);
                    }}
                    name="city"
                    value={values.city}
                    required
                    error={!!touched.city && !!errors.city}
                    helperText={touched.city && errors.city}
                    sx={
                      context.language === "en"
                        ? { textAlign: "left" }
                        : { textAlign: "right" }
                    }
                    style={{ width: "70%" }}
                  >
                    <MenuItem
                      dir={context.language === "en" ? "ltr" : "rtl"}
                      disabled
                      value="City"
                    >
                      {context.language === "en" ? "City" : "المدينه"}
                    </MenuItem>
                    {states
                      ? states.states.map((state) => (
                          <MenuItem
                            dir={context.language === "en" ? "ltr" : "rtl"}
                            value={state.name}
                            key={state.name}
                          >
                            {state.name}
                          </MenuItem>
                        ))
                      : ""}
                  </Select>

                  <Button
                    type="button"
                    sx={{
                      width: "70%",
                      backgroundColor: "red",
                      padding: "10px",
                      color: "white",
                    }}
                    variant="filled"
                    onClick={() => setOpen(true)}
                  >
                    {context.language === "en" ? "Location" : "الموقع"}
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
                  >
                    {context.language === "en" ? "Sign Up" : "انشاء حساب"}
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
                  <Typography display={"flex"} gap={1}>
                    {context.language === "en"
                      ? "Are you the Founder?"
                      : " هل انت المسؤول ؟ "}
                    <Link
                      onClick={() => navigate("/founder")}
                      underline="hover"
                      sx={{ cursor: "pointer", color: colors.primary[500] }}
                    >
                      {context.language === "en"
                        ? "Login Here!"
                        : "ادخل من هنا!"}
                    </Link>
                  </Typography>
                  <Typography display={"flex"} gap={1}>
                    {context.language === "en"
                      ? "Already have an account?"
                      : "لديك حساب بالفعل؟"}
                    <Link
                      onClick={() => navigate("/")}
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
          <Dialog fullScreen open={open} onClose={() => setOpen(false)}>
            <DialogTitle sx={{width: '100%', textAlign: 'right'}}>
              <IconButton onClick={() => setOpen(false)}>
                <CloseOutlinedIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ width: "100%" }}>
              <LoadScript googleMapsApiKey="AIzaSyBwEhSP-_BoKEr72cwKFGJc7sZZSlkU7fQ">
                {loading ? (
                  <CircularProgress />
                ) : (
                  <GoogleMap
                    onClick={handleMapClick}
                    mapContainerStyle={{
                      height: "100%",
                      width: "100%",
                      borderRadius: 20,
                    }}
                    zoom={15}
                    center={currentLocation}
                  >
                    <Marker
                      position={{
                        lat: selectedLocation.lat,
                        lng: selectedLocation.lng,
                      }}
                    />
                  </GoogleMap>
                )}
              </LoadScript>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)} variant="contained" fullWidth disabled={selectedLocation.lat && selectedLocation.lng ? false : true}>
                Submit
              </Button>
            </DialogActions>
          </Dialog>
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
  city: "City",
  government: "Government",
};

const Uschema = yup.object().shape({
  email: yup.string().email().required("Your Email is required."),
  phone: yup
    .number()
    .positive()
    .integer()
    .required("Phone Required")
    .typeError("Invalid Phone Number.")
    .test(
      "12345678910",
      "Invalid Number",
      (val) => val.toString().length === 10
    ),
  storeName: yup.string().required("Store Name Required"),
  password: yup.string().required("Password is Required.").min(5),
  city: yup.string().required("City is Required."),
  government: yup.string().required("Government is Required."),
});

export default SignUp;
