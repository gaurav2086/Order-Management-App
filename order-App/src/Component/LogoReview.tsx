import * as React from "react";
import Box from "@mui/material/Box";
import logo1 from "../Images/logo/l1.png";
import logo2 from "../Images/logo/l2.png";
import logo3 from "../Images/logo/l3.png";

export default function LogoReview() {
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <img src={logo1}></img>
      <img src={logo2}></img>
      <img src={logo3}></img>
    </Box>
  );
}
