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

const theme = createTheme();

export default function AddEditUser() {
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
  const [isChecked, setIsChecked] = React.useState(true);
  const [isEdit, setIsEdit] = React.useState(false);
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [alertBoxmsg, setAlertBoxmsg] = React.useState<Message>({
    Type: "",
    Text: "",
  });
 
  const [formValidation, setformValidation] = React.useState({
    username: false,
    password: false,
    email: false,
    firstName: false,
    phoneNumber: false,
    userType: false,
    confirmPassword: false,
  });
  const [openLoader, setOpenloader] = React.useState(false);
  const [pageName, setPageName] = React.useState("Add User");
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
    if (id === "confirmPassword") {
      setConfirmPassword(value);
    }
    setUserInfo({ ...userInfo, [id]: value });
    isValidForm(id, value);
  };

  function isValidForm(itemID: string, value: string) {
    let validate = {
      username: AppHelper.isNullorEmpty(userInfo.username),
      email: false,
      phoneNumber: AppHelper.isNullorEmpty(userInfo.phoneNumber),
      userType: AppHelper.isNullorEmpty(userInfo.userType),
      firstName: AppHelper.isNullorEmpty(userInfo.firstName),
      password: AppHelper.isNullorEmpty(userInfo.password),
      confirmPassword: AppHelper.isNullorEmpty(confirmPassword),
    };

    if (!AppHelper.validateEmail(userInfo.email || "")) {
      validate.email = true;
    }

    if (itemID === "phoneNumber") {
      if (!AppHelper.validatePhone(value || "")) {
        validate.phoneNumber = true;
      }
    } else {
      if (!AppHelper.validatePhone(userInfo.phoneNumber || "")) {
        validate.phoneNumber = true;
      }
    }

    if (itemID === "userType") {
      if (value.trim() === "") {
        validate.userType = true;
      } else {
        validate.userType = false;
      }
    }

    // if (!AppHelper.validatePassword(userInfo.password || "")) {
    //   validate.password = true;
    // }

    if (pageName !== "Add User") {
      validate.password = false;
      validate.confirmPassword = false;
    } else {
      if (itemID === "confirmPassword") {
        if (userInfo.password !== value) {
          validate.confirmPassword = true;
        }
      } else {
        if (userInfo.password !== confirmPassword) {
          validate.confirmPassword = true;
        }
      }
    }

    setformValidation(validate);

    if (
      validate.username ||
      validate.email ||
      validate.phoneNumber ||
      validate.password ||
      validate.firstName ||
      validate.confirmPassword ||
      validate.userType
    ) {
      return false;
    }

    return true;
  }
  const handleSubmit = () => {
    setOpenloader(true);

    if (!isValidForm("", "")) {
       setOpenloader(false);
      return false;
    }

    let apiUrl = "";
    if (pageName === "Add User") {
      apiUrl = AppSettings.API_URL + "User/AddUser";
    } else {
      apiUrl = AppSettings.API_URL + "User/UpdateUser";
    }   
     

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + AppHelper.getUser().token,
      },
      body: JSON.stringify({
        id: userInfo.id,
        username: userInfo.username,
        email: userInfo.email,
        password: userInfo.password || "",
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        phoneNumber: userInfo.phoneNumber,
        userType: userInfo.userType,
        isActive: isChecked,
        createdBy: AppHelper.getUser().id.toString()        
      }),
    };

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
          showResult(data);
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

  const handleSelectChange = (event: SelectChangeEvent) => {
    setUserInfo({ ...userInfo, ["userType"]: event.target.value });
    isValidForm("userType", event.target.value);
  };


   
  
  const useEffectCount = React.useRef(true);
  React.useEffect(() => {
    if (useEffectCount.current) {
      useEffectCount.current = false;      
      let msg: Message = { Text: "", Type: "" };
      let apiUrl = "";

      let query = AppHelper.getQueryValue().get("id");      

      if (query === null) {
        setPageName("Add User");
        return;
      }

      if (query !== undefined || query !== "" || query != null) {
        setIsEdit(true)
        setPageName("Edit User");
        setOpenloader(true);
        apiUrl = AppSettings.API_URL + "User/GetUserDetails?id=" + query;
        fetch(apiUrl, AppHelper.requestOptions("POST"))
          .then((response) => {
            console.log(response);
            if (!response.ok) {
              throw new Error(
                `API Error, This is an HTTP error: The status is ${response.status}`
              );
            }
            return response.json();
          })
          .then((data) => {
            if (data !== undefined) {
              setUserInfo(data);
              let user: User = data || " ";              
              setIsChecked(user.isActive || false);  
            }
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
      }
    }
  }, []);


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
          <Typography component="h1" variant="h5">
            {pageName}
          </Typography>
          {alertBoxmsg.Text !== "" && (
          <div className="msgDivNew">
            <AlertBox value={alertBoxmsg}></AlertBox>{" "}
          </div>
        )}
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  value={userInfo.username}
                  error={formValidation.username}
                  onChange={(e) => handleInputChange(e)}
                  helperText={
                    formValidation.username ? "Error : Field is required" : ""
                  }
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  value={userInfo.email}
                  onChange={(e) => handleInputChange(e)}
                  error={formValidation.email}
                  helperText={ formValidation.email  ?   "Error : Invalid email address.": ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  value={userInfo.firstName}
                  error={formValidation.firstName}
                  onChange={(e) => handleInputChange(e)}
                  helperText={
                    formValidation.firstName ? "Error : Field is required" : ""
                  }
                  autoFocus
                />
              </Grid>            
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  value={userInfo.lastName}
                  onChange={(e) => handleInputChange(e)}
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="Phone Number"
                  required
                  fullWidth
                  id="phoneNumber"
                  label="Phone Number"
                  value={userInfo.phoneNumber}
                  error={formValidation.phoneNumber}
                  onChange={(e) => handleInputChange(e)}
                  helperText={
                    formValidation.phoneNumber
                      ? "Error : Maximum 25 characters are allowed in phone number."
                      : ""
                  }
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-helper-label">
                    Type*
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="userType"
                    label="Type"
                    value={userInfo.userType}
                    required
                    fullWidth
                    error={formValidation.userType}
                    onChange={(e) => handleSelectChange(e)}
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Sales">Sales Employee</MenuItem>
                    <MenuItem value="Operation">Operation</MenuItem>
                    <MenuItem value="Inventory Manager">
                      Inventory Manager
                    </MenuItem>
                  </Select>
                  {formValidation.userType ? (
                    <FormHelperText style={{ color: "#d32f2f" }}>
                      Error : Field is required
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              </Grid>
              { isEdit === false ? (<> 
              <Grid item xs={12} sm={6}>
                <TextField
                  name="password"
                  required
                  fullWidth
                  id="password"
                  label="password"
                  type="password"
                  value={userInfo.password}
                  error={formValidation.password}
                  onChange={(e) => handleInputChange(e)}
                  helperText={
                    formValidation.password
                      ? userInfo.password === ""
                        ? "Error : Field is required"
                        : "Error : Invalid password.it must contain at least one letter, one number and one special character,  Minimum eight characters."
                      : ""
                  }
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => handleInputChange(e)}
                  error={formValidation.confirmPassword}
                  helperText={
                    formValidation.confirmPassword
                      ? confirmPassword === ""
                        ? "Error : Field is required"
                        : "Error : Confirm password does not match...."
                      : ""
                  }
                />
              </Grid></>): (
        <></>
      )}
             

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

              <Button variant="outlined" onClick={() => navigate("/UserList")}>
                Cancel
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
