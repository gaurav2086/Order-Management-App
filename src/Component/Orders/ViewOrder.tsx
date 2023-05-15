import * as React from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

import LabelImportantIcon from "@mui/icons-material/LabelImportant";
import { Order } from "../../Interface/Order";
import AppHelper from "../../Helper/AppHelper";
import { Container, CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { OrderProduct } from "../../Interface/OrderProduct";

export default function ViewOrder() {
  const [pageName, setPageName] = React.useState("Add Order");
  const [orderInfo, setOrderInfo] = React.useState<Order>({
    id: 0,
    orderCode: "ORD_602_242023",
    address: "E 124, The Nest Assotch.",
    customer: "Wipro",
    contactPerson: "Raj",
    contactPersonPhone: "+91-8445785425",
    gst: "",
    builtNumber: "",
    city: "",
    state: "",
    zipCode: "",
    otherDetails: "Order for 1000 pieces of Rose Gold Soap",   
    orderDueDate: "",
    orderStatus: "Delivered",
    amount: "100000 Rs",
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
 


  const [isChecked, setIsChecked] = React.useState(true);

  const useEffectCount = React.useRef(true);
  React.useEffect(() => {
    if (useEffectCount.current) {
      useEffectCount.current = false;
    }
  }, []);
  const theme = createTheme();
  const navigate = useNavigate();

  return (
    <>
      {/* <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}> */}
      <Box component="form" noValidate sx={{ mt: 3 }}>
        <Box sx={{ my: 3, mx: 2 }}>
          <Grid container alignItems="center">
            <Grid item xs>
              <Typography gutterBottom variant="h4" component="div">
                Order {orderInfo.orderCode}
              </Typography>
            </Grid>
          </Grid>
          <Typography gutterBottom variant="h5" component="div">
            Status : {orderInfo.orderStatus}
          </Typography>
          <Typography gutterBottom variant="h6" component="div">
            Amount: {orderInfo.amount}
          </Typography>
          <Typography gutterBottom variant="h6" component="div">
            Customer : {orderInfo.customer}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Details: {orderInfo.otherDetails}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Address: {orderInfo.address}
          </Typography>
        </Box>
        <Divider variant="middle" />
        <Box sx={{ m: 2 }}>
          <Typography gutterBottom variant="body1">
            Contact Details:
          </Typography>
        </Box>
        <Box sx={{ mt: 3, ml: 1, mb: 1 }}>
          <Button>{orderInfo.contactPerson}</Button>
          <Button>{orderInfo.contactPersonPhone}</Button>
        </Box>
        <Button variant="outlined" onClick={() => navigate("/OrderList")}>
          Back
        </Button>
      </Box>
    </>
  );
}
