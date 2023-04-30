import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";
import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import LabelImportantIcon from "@mui/icons-material/LabelImportant";
import { User } from "../../Interface/User";
import AppHelper from "../../Helper/AppHelper";
import { AppSettings } from "../../AppSettings";
import { Message } from "../../Interface/Message";
import AlertBox from "../CommonComponent/AlertBox";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
const theme = createTheme();

export default function ResetPassword() {

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setconfirmPassword] = React.useState("");
  const [userInfo, setUserInfo] = React.useState<User>({
    id: 0,
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    userType: "",
    isActive: true,
    token: "",
    createdBy: "",
  });

  
  const [formValidation, setformValidation] = React.useState({
    password: false,
    confirmPassword: false,
  });
  
  const [alertBoxmsg, setAlertBoxmsg] = React.useState<Message>({
    Type: "",
    Text: "",
  });

  const [openLoader, setOpenloader] = React.useState(false);
 
  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | (Event & { target: { value: string; id: string } })
  ) => {
    const { id, value } = e.target;
    if (id === "password") setPassword(value);

    if (id === "confirmPassword") setconfirmPassword(value);

    isValidPassword(id, value);
  };

  function isValidPassword(itemID: string, value: string) {
    let validate = {
      password: AppHelper.isNullorEmpty(password),
      confirmPassword: AppHelper.isNullorEmpty(confirmPassword),
    };

    // if (itemID === "password") {
    //   if (!AppHelper.validatePassword(value || "")) {
    //     validate.password = true;
    //   }
    // } else {
    //   if (!AppHelper.validatePassword(password || "")) {
    //     validate.password = true;
    //   }
    // }

    if (itemID === "confirmPassword") {
      if (password !== value) {
        validate.confirmPassword = true;
      }
    } else {
      if (value !== confirmPassword) {
        validate.confirmPassword = true;
      }
    }

    if (itemID === "") {
      if (password !== confirmPassword) {
        validate.confirmPassword = true;
      } else {
        if (confirmPassword !== "") validate.confirmPassword = false;
      }
    }

    if (validate.password || validate.confirmPassword) {
      setformValidation(validate);
      return false;
    }
    setformValidation(validate);
    return true;
  }


  function getQueryValue() {
    return new URLSearchParams(window.location.search);
  }

  const handleSubmit = () => {
    let msg: Message = { Text: "", Type: "" };

    if (!isValidPassword("", "")) {
      return false;
    }

    let apiUrl = AppSettings.API_URL + "User/ResetPassword";
    setOpenloader(true);
     

   const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + AppHelper.getUser().token,
    },
    body: JSON.stringify({
      id: userInfo.id || "",
      password: password,
    }),
  };

  fetch(apiUrl, requestOptions)
    .then((response) => {
      console.log(response);
      if (!response.ok) {
        if (response.status === 401) navigate("/SessionExpired");
        else
          throw new Error(
            `API Error, This is an HTTP error: The status is ${response.status}`
          );
      }
      return response.json();
    })
    .then((data) => {
      if (data) {
        if (data.successes.length > 0) {
          //on success
          msg = { Text: data.successes[0], Type: "Success" };
          if (AppHelper.getUser().userType === "Admin") {
            //If password was reset by the admin then only show success message.
            setPassword("");
            setconfirmPassword("");
            setAlertBoxmsg(msg);
          } else {
            //If password was reset by the External User then reload the app to refresh the session.
            // var userID = userInfo.id?.toString();
            // var userData = AppHelper.getUser();
            // localStorage.setItem("user-info-lpa", JSON.stringify(userData));
            window.location.href = "/UserList?msg=" + msg.Text;
          }
        } else {
          msg = { Text: data.errors[0], Type: "Error" };
          setAlertBoxmsg(msg);
        }
      }
      setOpenloader(false);
    })
    .catch((err) => {
      if (err.message === "Failed to fetch") {
        navigate("/SessionExpired");
      } else {
        //API Error.
        msg = { Text: err.message, Type: "Error" };
        setAlertBoxmsg(msg);
      }
    })
    .finally(() => {
      setOpenloader(false);
    });

  };


  function showResult(data: any) {
    setOpenloader(false);
    if (data !== undefined) {
      if (data.errors.length > 0) {
        let msg: Message = { Text: data.errors[0], Type: "Error" };
        setAlertBoxmsg(msg);
        return;
      }
      if (data.successes.length > 0) {
        navigate("/UserList");
      }
    }
  }
  const navigate = useNavigate();

  const useEffectCount = React.useRef(true);
  React.useEffect(() => {
    if (useEffectCount.current) {
      useEffectCount.current = false;
      let queryMsg = getQueryValue().get("msg");
      if (!AppHelper.isNullorEmpty(queryMsg)) {
        let msg: Message = { Text: queryMsg || "", Type: "Success" };
        setAlertBoxmsg(msg);
      }
      let query = getQueryValue().get("id");
      let userId = AppHelper.getUser().id.toString();
      if (!AppHelper.isNullorEmpty(query)) {
        userId = query;
      }

      if (!AppHelper.isNullorEmpty(userId)) {
        //reset password by Admin for Keycloak Users.
        GetUserDetails(userId || "", false);
      }
    }
  }, []);

  
  function GetUserDetails(id: string, resetSession: boolean) {
    let msg: Message = { Text: "", Type: "" };

    setOpenloader(true);
    let apiUrl = AppSettings.API_URL + "User/GetUserDetails?id=" + id;

    fetch(apiUrl, AppHelper.requestOptions("POST"))
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          if (response.status == 401) navigate("/SessionExpired");
          else
            throw new Error(
              `API Error, This is an HTTP error: The status is ${response.status}`
            );
        }
        return response.json();
      })
      .then((data) => {
        if (data !== undefined) {
          if (resetSession) {
            localStorage.setItem("user-info-lpa", JSON.stringify(data));
          }
          setUserInfo(data);
        }
      })
      .catch((err) => {
        if (err.message === "Failed to fetch") {
          navigate("/SessionExpired");
        } else {
          msg = { Text: err.message, Type: "Error" };
          setAlertBoxmsg(msg);
        }
      })
      .finally(() => {
        setOpenloader(false);
      });
  }

  return (
    <ThemeProvider theme={theme}>
       <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={openLoader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
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
           <Box
              sx={{
                marginTop: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                component="h1"
                variant="h5"
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <ManageAccountsIcon
                  sx={{ fontSize: 30, marginRight: 1 }}
                ></ManageAccountsIcon>{" "}
                <b>Reset Password</b>
              </Typography>
              {alertBoxmsg.Text !== "" && (
                <AlertBox value={alertBoxmsg}></AlertBox>
              )}
           
              <Box component="form" noValidate sx={{ mt: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      id="username"
                      label="User"
                      placeholder="Placeholder"
                      multiline
                      fullWidth
                      value={userInfo.username}
                      disabled={true}
                      variant="filled"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      id="password"
                      label="Password"
                      placeholder="Placeholder"
                      type="password"
                      fullWidth
                      value={password}
                      required
                      error={formValidation.password}
                      helperText={
                        formValidation.password
                          ? password === ""
                            ? "Error : Field is required."
                            : "Error : Invalid password.it must contain at least one letter, one number and one special character, Minimum eight characters."
                          : ""
                      }
                      onChange={(e) => handleInputChange(e)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      id="confirmPassword"
                      label="Confirm Password"
                      placeholder="Placeholder"
                      type="password"
                      required
                      fullWidth
                      value={confirmPassword}
                      onChange={(e) => handleInputChange(e)}
                      error={formValidation.confirmPassword}
                      helperText={
                        formValidation.confirmPassword
                          ? confirmPassword == ""
                            ? "Error : Field is required"
                            : "Error : Confirm password does not match...."
                          : ""
                      }
                    />
                  </Grid>
                  <Stack spacing={2} padding={4} direction="row">
                
                      <Button
                        variant="outlined"
                        onClick={() => navigate("/UserList")}
                      >
                        Cancel
                      </Button>
                 
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<LabelImportantIcon />}
                      onClick={() => handleSubmit()}
                    >
                      Submit
                    </Button>
                  </Stack>
                </Grid>
              </Box>{" "}
            </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
