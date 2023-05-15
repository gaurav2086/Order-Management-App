import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import LabelImportantIcon from "@mui/icons-material/LabelImportant";
import { Order } from "../../Interface/Order";
import { OrderProduct } from "../../Interface/OrderProduct";
import AppHelper from "../../Helper/AppHelper";

import LibraryAddRoundedIcon from "@mui/icons-material/LibraryAddRounded";
import { AppSettings } from "../../AppSettings";
import { Message } from "../../Interface/Message";
import AlertBox from "../CommonComponent/AlertBox";

const theme = createTheme();

export default function AddEditOrder() {
  const [openLoader, setOpenloader] = React.useState(false);
  const [pageName, setPageName] = React.useState("Add Order");
  const [alertBoxmsg, setAlertBoxmsg] = React.useState<Message>({
    Type: "",
    Text: "",
  });
  const [orderInfo, setOrderInfo] = React.useState<Order>({
    id: 0,
    orderCode: AppHelper.newOrderCode(),
    address: "",
    customer: "",
    contactPerson: "",
    contactPersonPhone: "",
    gst: "",
    builtNumber: "",
    city: "",
    state: "",
    zipCode: "",
    otherDetails: "",
    orderDueDate: "",
    orderStatus: "",
    amount: "",
    amountReceived: "",
    products: [{
      id: 0,
      productName: "",
      quantity: 0,
      price: 0
    }],
    isActive: true,
    createDate: "",
    createOrUpdateBy: "",
    updateDate: ""
  });
  
  const [products, setProducts] = React.useState([

    { id:0 ,productName: "", quantity: 0, price: 0 },

  ]);

  
  const addProduct = () => {

    setProducts([...products, { id:0 ,productName: "", quantity: 0, price: 0 }]);

  };

  
  const handleProductChange = (
    index: number,
    event: { target: { name: any; value: any } }
  ) => {
    const updatedProducts = [...products];
   if(event.target.name == "Price")
    updatedProducts[index] = { ...updatedProducts[index], price: +event.target.value };
   
    if(event.target.name == "Quantity")
    updatedProducts[index] = { ...updatedProducts[index], quantity: +event.target.value };

    setProducts(updatedProducts);
    debugger;
   
    var amount =0;
    for (let i = 0; i < products.length; i++) {
      let quantity = products[i].quantity;
      let price = products[i].price;
      if(index == i){
        if(event.target.name == "Price") 
        price = event.target.value;
        if(event.target.name == "Quantity") 
        quantity = event.target.value;
      
      }
      amount = amount + (quantity*price);
    }


  let  ordervalue = orderInfo;
  ordervalue.amount = amount.toString(); //event.target.value;
  setOrderInfo(ordervalue)  
};


  const [isChecked, setIsChecked] = React.useState(true);

  const [formValidation, setformValidation] = React.useState({
    customer: false,
    address: false,
    details: false,
    contactPersonName: false,
    contactPersonPhone: false,
    orderStatus: false,
    amount: false,
    orderDueDate: false,
    city: false,
    state: false,
    zipCode: false,
  });

  const handleCheckboxChange = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setIsChecked(event.target.checked);
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | (Event & { target: { value: string; id: string } })
  ) => {
    const { id, value } = e.target;

    setOrderInfo({ ...orderInfo, [id]: value });
    isValidForm(id, value);
  };

  function isValidForm(itemID: string, value: string) {
    let validate = {
      customer: AppHelper.isNullorEmpty(orderInfo.customer),
      address: AppHelper.isNullorEmpty(orderInfo.address),
      details: AppHelper.isNullorEmpty(orderInfo.otherDetails),
      contactPersonName: AppHelper.isNullorEmpty(orderInfo.contactPerson),
      contactPersonPhone: AppHelper.isNullorEmpty(orderInfo.contactPersonPhone),
      amount: AppHelper.isNullorEmpty(orderInfo.amount),
      orderDueDate: AppHelper.isNullorEmpty(orderInfo.orderDueDate),
      orderStatus: AppHelper.isNullorEmpty(orderInfo.orderStatus),
      city: AppHelper.isNullorEmpty(orderInfo.city),
      state: AppHelper.isNullorEmpty(orderInfo.state),
      zipCode: AppHelper.isNullorEmpty(orderInfo.zipCode),
    };

    if (itemID === "orderStatus") {
      if (value.trim() === "") {
        validate.orderStatus = true;
      } else {
        validate.orderStatus = false;
      }
    }

    setformValidation(validate);

    if (
      validate.customer ||
      validate.address ||
      validate.details ||
      validate.contactPersonName ||
      validate.contactPersonPhone ||
      validate.orderStatus ||
      validate.city ||
      validate.state ||
      validate.zipCode ||
      validate.orderDueDate
    ) {
      return false;
    }

    return true;
  }
  const handleSubmit = () => {
   debugger;
    setOpenloader(true);

    if (!isValidForm("", "")) {
      setOpenloader(false);
      return false;
    }

    let apiUrl = "";
    if (pageName === "Add Order") {
      apiUrl = AppSettings.API_URL + "Order/AddOrder";
    } else {
      apiUrl = AppSettings.API_URL + "Order/UpdateOrder";
    }   

        
    if(products == null || products[0].productName == ''){
      let msg: Message = {
        Text: "kindly add the product details.",
        Type: "Error",
      };
      setAlertBoxmsg(msg);
      return;
    }

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + AppHelper.getUser().token,
      },
      body: JSON.stringify({  
        orderCode: orderInfo.orderCode, 
        customer : orderInfo.customer,
        contactPerson : orderInfo.contactPerson,
        contactPersonPhone: orderInfo.contactPersonPhone,
        gst: orderInfo.gst,
        builtNumber: orderInfo.builtNumber,
        address: orderInfo.address,
        city: orderInfo.city,
        state: orderInfo.state,
        zipCode: orderInfo.zipCode,
        otherDetails: orderInfo.otherDetails,
        orderDueDate: orderInfo.orderDueDate,
        orderStatus: orderInfo.orderStatus,
        amount: orderInfo.amount,
        amountReceived: orderInfo.amountReceived,
        isActive: isChecked,
        createOrUpdateBy: AppHelper.getUser().username,
        createDate: "2023-05-15T13:09:41.168Z",        
        products : products
      }),};
   
      fetch(apiUrl, requestOptions)
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error(
            `API Error, This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then(
        (data) => {
          debugger;
          if(data.successes.length>0){
          let msg: Message = {
            Text: "Order Added Successfully!",
            Type: "Success",
          };
          setAlertBoxmsg(msg);}
          else{ let msg: Message = {
            Text: "Something went wrong please try again.",
            Type: "Error",
          }; setAlertBoxmsg(msg);}      
          
          window.scrollTo(0, 0);
 
        },
        (error) => {
          setOpenloader(false);
          let msg: Message = {
            Text: "Something went wrong please try again.",
            Type: "Error",
          };
          setAlertBoxmsg(msg);
          console.log("API Error: " + apiUrl + " " + error);
        }
       
      )
      .catch((err) => {
        if (err.message === "Failed to fetch") {
          navigate("/SessionExpired");
        } else {
          //API Error.
          let msgError: Message = {
            Text: err.message,
            Type: "Error",
          };
          setAlertBoxmsg(msgError);
        }
      })
      .finally(() => {
        setOpenloader(false);
      });   
    };

  const navigate = useNavigate();

  const handleSelectChange = (event: SelectChangeEvent) => {
    setOrderInfo({ ...orderInfo, ["orderStatus"]: event.target.value });
    isValidForm("orderStatus", event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        {alertBoxmsg.Text !== "" && (
          <div className="msgDivNew">
            <AlertBox value={alertBoxmsg}></AlertBox>{" "}
          </div>
        )}
        <Box
          sx={{
            marginTop: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            {pageName}
          </Typography>         
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="orderCode"
                  required
                  fullWidth
                  id="orderCode"
                  label="orderCode"
                  value={orderInfo.orderCode}
                  onChange={(e) => handleInputChange(e)}
                  disabled
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="customer"
                  name="customer"
                  label="Customer"
                  onChange={(e) => handleInputChange(e)}
                  error={formValidation.customer}
                  helperText={
                    formValidation.customer
                      ? orderInfo.customer === ""
                        ? "Error : Field is required"
                        : "Error : Invalid email address."
                      : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="contactPerson"
                  required
                  fullWidth
                  id="contactPerson"
                  label="Contact Person Name"
                  value={orderInfo.contactPerson}
                  error={formValidation.contactPersonName}
                  onChange={(e) => handleInputChange(e)}
                  helperText={
                    formValidation.contactPersonName
                      ? "Error : Field is required"
                      : ""
                  }
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="contactPersonPhone"
                  label="Contact Person Phone"
                  onChange={(e) => handleInputChange(e)}
                  name="contactPersonPhone"
                  error={formValidation.contactPersonPhone}
                  helperText={
                    formValidation.contactPersonPhone
                      ? "Error : Field is required"
                      : ""
                  }
                  autoComplete="family-name"
                />
              </Grid>            
              <Grid item xs={12}>
                <TextField
                  name="address"
                  required
                  fullWidth
                  id="address"
                  label="Address"
                  multiline
                  rows={2}
                  value={orderInfo.address}
                  error={formValidation.address}
                  onChange={(e) => handleInputChange(e)}
                  helperText={
                    formValidation.address ? "Error : Field is required" : ""
                  }
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  id="city"
                  label="City"
                  value={orderInfo.city}
                  error={formValidation.city}
                  onChange={(e) => handleInputChange(e)}
                  helperText={
                    formValidation.city
                      ? "Error : Field is required"
                      : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  name="state"
                  required
                  fullWidth
                  id="state"
                  label="State"                 
                  value={orderInfo.state}
                  error={formValidation.state}
                  onChange={(e) => handleInputChange(e)}
                  helperText={
                    formValidation.state
                      ? "Error : Field is required"
                      : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  name="zipCode"
                  required
                  fullWidth
                  id="zipCode"
                  label="Zip Code"                 
                  value={orderInfo.zipCode}
                  error={formValidation.zipCode}
                  onChange={(e) => handleInputChange(e)}
                  helperText={
                    formValidation.zipCode
                      ? "Error : Field is required"
                      : ""
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="otherDetails"
                  multiline
                  rows={2}
                  label="Product Details"
                  value={orderInfo.otherDetails}
                  onChange={(e) => handleInputChange(e)}
                  name="details"
                  error={formValidation.details}
                  helperText={
                    formValidation.details ? "Error : Field is required" : ""
                  }
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12} sm={12}   className="productAddCls">  <LibraryAddRoundedIcon
                onClick={() => addProduct()}
              ></LibraryAddRoundedIcon> </Grid> 
{/* Start */}
 {products.map((product, index) => (
     <Box
     component="div"
     sx={{
       "& > :not(style)": { m: 1, width: "30ch"  },
     }}
      className="productCls"  
     key={index}
   >
                <TextField                             
                  id="product"
                  label="Product"
                  value={product.productName || ""}
                  onChange={(e) =>
                    setProducts([
                      ...products.slice(0, index),
                      { ...product, productName: e.target.value },
                      ...products.slice(index + 1),
                    ])
                  }
                  autoComplete="family-name"                
                /> 
                
                <TextField                 
                  id="quantity"
                  label="Quantity"
                  name="Quantity"
                  value={product.quantity}
                  onChange={(event) => handleProductChange(index, event)}
                  // onChange={(e) =>
                  //   setProducts([
                  //     ...products.slice(0, index),
                  //     { ...product, quantity: +e.target.value },
                  //     ...products.slice(index + 1),
                  //   ])
                  // }
                  autoComplete="family-name"                 
                /> 
              <TextField
                                required
                                fullWidth                              
                                id="price"
                                label="Price"
                                name="Price"
                                value={product.price}
                                onChange={(event) => handleProductChange(index, event)}
                                autoComplete="family-name"
                              
                              />      </Box>             
 
))}           
            
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  id="gst"
                  label="GST"
                  onChange={(e) => handleInputChange(e)}
                  name="GST"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  name="BuiltNumber"
                  required
                  fullWidth
                  id="build_number"
                  label="Built Number"                 
                  onChange={(e) => handleInputChange(e)}                
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  name="amount"
                  required
                  fullWidth
                  id="amount"
                  label="Billable Amount "
                  value={orderInfo.amount}
                  error={formValidation.amount}
                  onChange={(e) => handleInputChange(e)}
                  helperText={
                    formValidation.amount ? "Error : Field is required" : ""
                  }
                  autoFocus
                />      </Grid>
 <Grid item xs={12} sm={6}>
            <TextField
                  name="amountReceived"
                  required
                  fullWidth
                  id="amountReceived"
                  label="Amount Received"
                  value={orderInfo.amountReceived}
                  error={formValidation.amount}
                  onChange={(e) => handleInputChange(e)}             
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-helper-label">
                    Status*
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="userType"
                    label="Type"
                    value={orderInfo.orderStatus}
                    required
                    fullWidth
                    error={formValidation.orderStatus}
                    onChange={(e) => handleSelectChange(e)}
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    <MenuItem value="1">New</MenuItem>
                    <MenuItem value="2">Submit For Inventory Approval</MenuItem>
                    <MenuItem value="3">Inventory Approved</MenuItem>
                    <MenuItem value="4">In progress</MenuItem>
                    <MenuItem value="5">Delivered</MenuItem>
                    <MenuItem value="6">Payment Awaited</MenuItem>
                    <MenuItem value="7">Close</MenuItem>
                  </Select>
                  {formValidation.orderStatus ? (
                    <FormHelperText style={{ color: "#d32f2f" }}>
                      Error : Field is required
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="orderDueDate"
                  name="orderDueDate"
                  type="Date"
                  value={orderInfo.orderDueDate}
                  onChange={(e) => handleInputChange(e)}
                  error={formValidation.orderDueDate}
                  helperText={
                    formValidation.orderDueDate
                      ? "Error : Field is required"
                      : ""
                  }
                />
              </Grid>
              <Grid item xs={2}>
                <FormControlLabel
                  control={
                    <Checkbox color="primary" checked={isChecked} onChange={handleCheckboxChange} name="isActive"  id="isActive" />
                  }
                  label="Enable"
                />
              </Grid>
            </Grid>
            <Stack spacing={2} padding={2} direction="row">
              <Button
                variant="outlined"
                onClick={() => handleSubmit()}
                startIcon={
                  <LabelImportantIcon
                    color="primary"
                    style={{ fontSize: "30" }}
                  />
                }
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleSubmit()}
                startIcon={
                  <LabelImportantIcon
                    color="primary"
                    style={{ fontSize: "30" }}
                  />
                }
              >
                Aubmit For Approval
              </Button>
              <Button variant="outlined" onClick={() => navigate("/OrderList")}>
                Cancel
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
