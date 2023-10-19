import { Box, Button, CircularProgress, TextField } from "@mui/material";
import Header from "../../../components/Header";
import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../../../language";
import { Formik } from "formik";
import * as yup from "yup";
import { fetchAddTerms } from "./../../../apis/Rules/TermsAndConditions";
const Terms = () => {
  // Variables.
  const context = useContext(LanguageContext);
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const [terms, setTerms] = useState("");
  const [error, setError] = useState("");
  const state = useSelector((state) => state.addTerms);
  console.log(state)
  const Uschema = yup.object().shape({
    terms: yup
      .string()
      .required(context.language === "ar" ? "مطلوب" : "Required"),
  });
  // Functions

  const handleSubmit = () => {
    dispatch(fetchAddTerms({ terms })).then((res) => {
      if (res.payload === 200) {
        setError(context.language === "en" ? "Changed Successfully" : "تم التغيير بنجاح");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setError(context.language === "en" ? "Error" : "هناك خطأ");
      }
    });
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title={
            context.language === "en"
              ? "Terms And Conditions"
              : "الشروط و الأحكام"
          }
          subtitle={
            context.language === "en" ? "Manage Terms" : "التحكم في الاحكام"
          }
        />
      </Box>
      <Box
        alignItems={"center"}
        flexDirection={"column"}
        gap={5}
        mt="10px"
        p={2}
      >
        <Formik
          validationSchema={Uschema}
          onSubmit={handleSubmit}
          initialValues={{ terms: "" }}
        >
          {({
            values,
            touched,
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form
              onSubmit={handleSubmit}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                gap: 25,
                justifyContent: "center",
              }}
            >
              <TextField
                name="terms"
                value={values.terms}
                error={!!touched.terms && !!errors.terms}
                helperText={touched.terms && errors.terms}
                onBlur={handleBlur}
                onChange={handleChange}
                onChangeCapture={(e) => setTerms(e.target.value)}
                placeholder={
                  context.language === "en"
                    ? "Please enter the terms and conditions"
                    : "برجاء ادخال الشروط و الأحكام"
                }
                multiline
                rows={20}
                sx={{ height: "100%", width: "100%" }}
              />
              <Box>
                {error}
              </Box>
              <Button
                type="submit"
                variant="contained"
                sx={{ fontSize: "14px" }}
              >
                {state.loading ? (
                  <CircularProgress size={25} color="secondary" />
                ) : context.language === "en" ? (
                  "Save Changes"
                ) : (
                  "حفظ التغييرات"
                )}
              </Button>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default Terms;
