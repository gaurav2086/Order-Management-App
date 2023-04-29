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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import LabelImportantIcon from "@mui/icons-material/LabelImportant";
import { Order } from "../../Interface/Order";
import AppHelper from "../../Helper/AppHelper";

const theme = createTheme();

export default function AddEditOrder() {
  const [pageName, setPageName] = React.useState("Add Order");
  const [orderInfo, setOrderInfo] = React.useState<Order>({
    id: 0,
    orderCode: AppHelper.newOrderCode(),
    address: "",
    details: "",
    customer: "",
    contactPersonName: "",
    contactPersonPhone: "",
    orderStatus: "",
    amount: "",
    isActive: true,
    tentativeDate: "",
    createdBy: "",
  });
  const [isChecked, setIsChecked] = React.useState(true);

  const [formValidation, setformValidation] = React.useState({
    customer: false,
    address: false,
    details: false,
    contactPersonName: false,
    contactPersonPhone: false,
    orderStatus: false,
    amount: false,
    tentativeDate: false,
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
      details: AppHelper.isNullorEmpty(orderInfo.details),
      contactPersonName: AppHelper.isNullorEmpty(orderInfo.contactPersonName),
      contactPersonPhone: AppHelper.isNullorEmpty(orderInfo.contactPersonPhone),
      amount: AppHelper.isNullorEmpty(orderInfo.amount),
      tentativeDate: AppHelper.isNullorEmpty(orderInfo.tentativeDate),
      orderStatus: AppHelper.isNullorEmpty(orderInfo.orderStatus),
    };

    if (itemID == "orderStatus") {
      if (value.trim() == "") {
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
      validate.tentativeDate
    ) {
      return false;
    }

    return true;
  }
  const handleSubmit = () => {
    if (isValidForm("", "")) {
      alert(orderInfo.tentativeDate);
    }
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
                  name="contactPersonName"
                  required
                  fullWidth
                  id="contactPersonName"
                  label="Contact Person Name"
                  value={orderInfo.contactPersonName}
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
              <Grid item xs={12} sm={6}>
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

              <Grid item xs={12} sm={6}>
                <TextField
                  name="BuildNumber"
                  required
                  fullWidth
                  id="build_number"
                  label="Build Number"                 
                  onChange={(e) => handleInputChange(e)}                
                  autoFocus
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
                  rows={4}
                  value={orderInfo.address}
                  error={formValidation.address}
                  onChange={(e) => handleInputChange(e)}
                  helperText={
                    formValidation.address ? "Error : Field is required" : ""
                  }
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="details"
                  multiline
                  rows={4}
                  label="Details"
                  onChange={(e) => handleInputChange(e)}
                  name="details"
                  error={formValidation.details}
                  helperText={
                    formValidation.details ? "Error : Field is required" : ""
                  }
                  autoComplete="family-name"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="amount"
                  required
                  fullWidth
                  id="amount"
                  label="Amount"
                  value={orderInfo.amount}
                  error={formValidation.amount}
                  onChange={(e) => handleInputChange(e)}
                  helperText={
                    formValidation.amount ? "Error : Field is required" : ""
                  }
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
                    <MenuItem value="1">Open For Review</MenuItem>
                    <MenuItem value="2">Submit For Approval</MenuItem>
                    <MenuItem value="3">Open</MenuItem>
                    <MenuItem value="4">Tender Accepted</MenuItem>
                    <MenuItem value="5">Payment Awaited</MenuItem>
                    <MenuItem value="6">In Transit</MenuItem>
                    <MenuItem value="7">Delivered</MenuItem>
                    <MenuItem value="8">Close</MenuItem>
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
                  id="tentativeDate"
                  name="tentativeDate"
                  type="Date"
                  value={orderInfo.tentativeDate}
                  onChange={(e) => handleInputChange(e)}
                  error={formValidation.tentativeDate}
                  helperText={
                    formValidation.tentativeDate
                      ? "Error : Field is required"
                      : ""
                  }
                />
              </Grid>
              <Grid item xs={2}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
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
