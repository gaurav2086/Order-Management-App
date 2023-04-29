import * as React from "react";
import { Alert, AlertTitle } from "@mui/material";
import { Message } from "../../Interface/Message";

const AlertBox = (props: { value: Message }) => {

  const details = props.value;
  return (
    <>
      {details &&
        (details.Type === "Error" ? (
          <Alert sx={{ width: "100%" }} severity={"error"}>
            <AlertTitle>Error</AlertTitle>
            {details.Text} — <strong>check it out!</strong>
          </Alert>
        ) : (
          <Alert sx={{ width: "100%" }} severity="success">
            <AlertTitle>Success</AlertTitle>
            {details.Text}
          </Alert>
        ))}
    </>
  );
};
export default AlertBox;
