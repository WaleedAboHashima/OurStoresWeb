import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Header from "./../../../components/Header";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAddProduct } from "./../../../apis/Products/AddProduct";
import { LanguageContext } from "../../../language";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
const AddProduct = () => {
  // Variables
  const [productName, setProductName] = useState();
  const [productNameAR, setProductNameAR] = useState();
  const [productPrice, setProductPrice] = useState();
  const [productQuantity, setProductQuantity] = useState();
  const [category, setCategory] = useState();
  const [error, setError] = useState("");
  const [categoryAR, setCategoryAR] = useState();
  const [sizes, setSizes] = useState();
  const [productImgPreview, setProductImgPreview] = useState([]);
  const [imgs, setImgs] = useState([]);
  const [description, setDescription] = useState("");
  // Other variables
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const context = useContext(LanguageContext);
  const State = useSelector((state) => state.addProduct);
  console.log(State)
  // Functions
  //Image
  const handleImagePreview = (event) => {
    if (event.target.files.length > 3) {
      setError("Please Select Only 3 images.");
    } else {
      const files = Array.from(event.target.files);
      const previews = files.map((file) => URL.createObjectURL(file));
      setProductImgPreview((prevPreviews) => [...prevPreviews, ...previews]);
      setImgs(files);
    }
  };

  const handleState = () => {
    if (State.status === 201) {
      window.location.pathname = "/products";
    } else if (State.status === 409) {
      console.log("Error");
    } else {
      console.log("Error v2");
    }
  };

  const handleFormSubmit = async () => {
    const formData = new FormData();
    imgs.map((i) => {
      formData.append("imgs", i);
    });
    formData.append("productName", productName);
    formData.append("productNameAR", productNameAR);
    formData.append("price", productPrice);
    formData.append("quantity", productQuantity);
    formData.append("sizes", sizes);
    formData.append("category", category);
    formData.append("categoryAR", categoryAR);
    formData.append("description", description);
    dispatch(fetchAddProduct(formData)).then(() => handleState());
  };

  const handleRemovePreview = (index) => {
    const newPreviews = [...productImgPreview];
    newPreviews.splice(index, 1);
    setProductImgPreview(newPreviews);
  };

  useEffect(() => {
    handleState();
  }, [State.status]);

  return (
    <Box m="20px">
      {State.loading ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={State.loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        ""
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Add Product" subtitle="Add Products Below." />
      </Box>
      <Box marginTop="10px" display="flex" flexDirection={"column"}>
        <Box>
          {productImgPreview.length > 0 ? (
            <Box
              sx={{
                width: "100%",
                mx: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                overflow: "hidden",
                gap: 2,
              }}
            >
              {productImgPreview.map((preview, index) => (
                <Box
                  key={index}
                  sx={{
                    width: "100%",
                    mx: "auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    overflow: "hidden",
                    gap: 2,
                  }}
                >
                  <img
                    width={"250px"}
                    height={"250px"}
                    src={preview}
                    alt="uploaded image"
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      borderRadius: 200,
                    }}
                  />
                  <Button
                    onClick={() => handleRemovePreview(index)}
                    color="error"
                    variant="contained"
                  >
                    Remove
                  </Button>
                </Box>
              ))}
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
                  border: `2px dashed #804fdf}`,
                  borderRadius: 1,
                }}
              >
                <input
                  multiple
                  style={{ display: "none" }}
                  accept="image/*"
                  sx={{ display: "none" }}
                  id="upload-image"
                  type="file"
                  onChange={handleImagePreview}
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
                    <CollectionsOutlinedIcon
                      sx={{ fontSize: 48, marginBottom: 1 }}
                    />
                    <Typography variant="h6">
                      {context.language === "en"
                        ? "Upload Product Images (Max: 3)"
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
              <Typography>{error}</Typography>
            </Box>
          )}
        </Box>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validateSchema={validateSchema}
        >
          {({
            values,
            errors,
            touched,
            handleReset,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit} onBlur={handleBlur}>
              <TextField
                required
                margin="dense"
                id="name"
                onChange={handleChange}
                onChangeCapture={(e) => setProductName(e.target.value)}
                label="Name"
                type="text"
                fullWidth
                variant="outlined"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                value={values.name}
              />
              <TextField
                required
                margin="dense"
                onChange={handleChange}
                id="nameAR"
                onChangeCapture={(e) => setProductNameAR(e.target.value)}
                label="Name AR"
                type="text"
                fullWidth
                variant="outlined"
                error={!!touched.nameAR && !!errors.nameAR}
                helperText={touched.nameAR && errors.nameAR}
                value={values.nameAR}
              />
              <TextField
                required
                onChange={handleChange}
                margin="dense"
                id="price"
                onChangeCapture={(e) => setProductPrice(e.target.value)}
                label="Price"
                type="number"
                fullWidth
                variant="outlined"
                error={!!touched.price && !!errors.price}
                helperText={touched.price && errors.price}
                value={values.price}
              />
              <TextField
                required
                onChange={handleChange}
                margin="dense"
                id="quantity"
                onChangeCapture={(e) => setProductQuantity(e.target.value)}
                label="Quantity"
                type="number"
                fullWidth
                variant="outlined"
                error={!!touched.quantity && !!errors.quantity}
                helperText={touched.quantity && errors.quantity}
                value={values.quantity}
              />
              <FormControl sx={{ width: "100%" }}>
                <InputLabel sx={{ margin: "8px 0px" }} id="size">
                  Sizes
                </InputLabel>
                <Select
                  label="Sizes"
                  labelId="size"
                  onBlur={handleBlur}
                  name="sizes"
                  id="demo-simple-select-disabled"
                  value={values.sizes}
                  placeholder="Sizes"
                  sx={{ width: "100%", margin: "8px 0px" }}
                  onChange={handleChange}
                >
                  <MenuItem
                    id="XL"
                    onClick={(e) => {
                      setSizes(e.currentTarget.textContent);
                    }}
                    value={"XL"}
                  >
                    XL
                  </MenuItem>
                  <MenuItem
                    id="L"
                    onClick={(e) => {
                      setSizes(e.currentTarget.textContent);
                    }}
                    value={"L"}
                  >
                    L
                  </MenuItem>
                  <MenuItem
                    id="M"
                    onClick={(e) => {
                      setSizes(e.currentTarget.textContent);
                    }}
                    value={"M"}
                  >
                    M
                  </MenuItem>
                  <MenuItem
                    id="S"
                    onClick={(e) => {
                      setSizes(e.currentTarget.textContent);
                    }}
                    value={"S"}
                  >
                    S
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ width: "100%" }}>
                <InputLabel sx={{ margin: "8px 0px" }} id="categoryAR">
                  Category
                </InputLabel>
                <Select
                  label="Category"
                  labelId="category"
                  onBlur={handleBlur}
                  name="category"
                  defaultValue="Chips"
                  id="category"
                  value={values.category}
                  placeholder="Category"
                  sx={{ width: "100%", margin: "8px 0px" }}
                  onChange={handleChange}
                >
                  <MenuItem
                    id="Shirts"
                    onClick={(e) => {
                      setCategory(e.currentTarget.textContent);
                    }}
                    value={"Shirts"}
                  >
                    Shirts
                  </MenuItem>
                  <MenuItem
                    id="Pants"
                    onClick={(e) => {
                      setCategory(e.currentTarget.textContent);
                    }}
                    value={"Pants"}
                  >
                    Pants
                  </MenuItem>
                  <MenuItem
                    id="Shoes"
                    onClick={(e) => {
                      setCategory(e.currentTarget.textContent);
                    }}
                    value={"Shoes"}
                  >
                    Shoes
                  </MenuItem>
                  <MenuItem
                    id="Shorts"
                    onClick={(e) => {
                      setCategory(e.currentTarget.textContent);
                    }}
                    value={"Shorts"}
                  >
                    Shorts
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ width: "100%" }}>
                <InputLabel sx={{ margin: "8px 0px" }} id="categoryAR">
                  Category AR
                </InputLabel>
                <Select
                  label="CategoryAR"
                  labelId="categoryAR"
                  onBlur={handleBlur}
                  name="categoryAR"
                  id="demo-simple-select-disabled"
                  value={values.categoryAR}
                  placeholder="Category"
                  sx={{ width: "100%", margin: "8px 0px" }}
                  onChange={handleChange}
                >
                  <MenuItem
                    id="تشيرتات"
                    onClick={(e) => {
                      setCategoryAR(e.currentTarget.textContent);
                    }}
                    value={"تشيرتات"}
                  >
                    تشيرتات
                  </MenuItem>
                  <MenuItem
                    id="بنطالونات"
                    onClick={(e) => {
                      setCategoryAR(e.currentTarget.textContent);
                    }}
                    value={"بنطالونات"}
                  >
                    بنطالونات
                  </MenuItem>
                  <MenuItem
                    id="احذيه"
                    onClick={(e) => {
                      setCategoryAR(e.currentTarget.textContent);
                    }}
                    value={"احذيه"}
                  >
                    احذيه
                  </MenuItem>
                  <MenuItem
                    id="شورتات"
                    onClick={(e) => {
                      setCategoryAR(e.currentTarget.textContent);
                    }}
                    value={"شورتات"}
                  >
                    شورتات
                  </MenuItem>
                </Select>
              </FormControl>
              <TextField
                name="description"
                onBlur={handleBlur}
                value={values.description}
                rows={4}
                sx={{ width: "100%" }}
                multiline
                placeholder="Description"
                onChange={handleChange}
                onChangeCapture={(e) => setDescription(e.target.value)}
              />
              <Box
                gap="20px"
                marginTop="20px"
                display="flex"
                justifyContent="right"
                alignItems="right"
              >
                <Button
                  variant="filled"
                  onClick={() => {
                    handleReset();
                    setProductImgPreview("");
                  }}
                >
                  Reset
                </Button>
                <Button variant="filled" onClick={() => navigator("/products")}>
                  Cancel
                </Button>
                <Button variant="filled" type="submit">
                  Add
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

const initialValues = {
  img: "",
  name: "",
  nameAR: "",
  sizes: "",
  price: "",
  quantity: "",
  category: "",
  categoryAR: "",
  description: "",
};

const validateSchema = yup.object().shape({
  name: yup.string().required("Required Field."),
  nameAR: yup.string().required("Required Field."),
  price: yup
    .number()
    .positive()
    .integer()
    .required("Required Field.")
    .typeError("Invalid Price."),
  quantity: yup
    .number()
    .positive()
    .integer()
    .required("Price Required")
    .typeError("Invalid Quantity."),
  description: yup.string().required("Description Required."),
});

export default AddProduct;
