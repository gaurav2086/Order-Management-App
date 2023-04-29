import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Home from "./Component/Home";
import { useNavigate } from "react-router-dom";
import { Message } from "./Interface/Message";
import { AppSettings } from "./AppSettings";
import { User } from "./Interface/User";
import Backdrop from "@mui/material/Backdrop"; 
import CircularProgress from "@mui/material/CircularProgress";
import AlertBox from "./Component/CommonComponent/AlertBox";


function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="#">
        Camlay chemicals
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}


const theme = createTheme();

export default function Login() {
  const [isLogin, setLogin] = React.useState(false);
  const [alertBoxmsg, setAlertBoxmsg] = React.useState<Message>({
    Type: "",
    Text: "",
  });
  const [openLoader, setOpenloader] = React.useState(false);

  const [userInfo, setUserInfo] = React.useState<User>({
    id: 0,
    username: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    password: "",
    email: "",
    createdBy: "",
    isActive: true,
    userType: "",
    token: "", 
  });
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let msg: Message = { Text: "", Type: "" };
    let username = data.get("email");
    let password = data.get("password");

    if (
      (username === "" || username == null) &&
      (password === "" || password == null)
    ) {
      msg = { Text: "Username & Password are required!", Type: "Error" };
      setAlertBoxmsg(msg);
      return;
    }

    if (username === "" || username == null) {
      msg = { Text: "Username is required!", Type: "Error" };
      setAlertBoxmsg(msg);
      return;
    }
    if (password === "" || password == null) {
      msg = { Text: "Password is required!", Type: "Error" };
      setAlertBoxmsg(msg);
      return;
    }

     let apiUrl = AppSettings.API_URL + "User/Login";
    setOpenloader(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName: username,
        password: password,
      }),
    };
    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        debugger;
        if (data.errors === undefined) {
          localStorage.setItem("user-info", JSON.stringify(data));
          SaveUserInfo();
          navigate("/UserList");
        } else {
          msg = { Text: data.errors[0], Type: "Error" };
          setAlertBoxmsg(msg);
        }
        setOpenloader(false);
        //navigate("/");
      })
      .catch((err) => {
        let msgError: Message = {
          Text: `API Error, ${err.message}`,
          Type: "Error",
        };
        setAlertBoxmsg(msgError);
      })
      .finally(() => {
        setOpenloader(false);
      });

  };

  
  function SaveUserInfo() {
    if (localStorage.getItem("user-info") !== null) {
      var currentUser = JSON.parse(localStorage.getItem("user-info") || " ");
      if (currentUser !== " ") {
        setUserInfo(currentUser);
        setLogin(true);
        setOpenloader(false);
      }
    }
  }

  const useEffectCount = React.useRef(true);
  React.useEffect(() => {
    debugger;
    if (useEffectCount.current) {
      useEffectCount.current = false;
      if (localStorage.getItem("user-info") !== null) {
        var currentUser = JSON.parse(localStorage.getItem("user-info") || " ");
        if (currentUser !== " ") {
         setUserInfo(currentUser);
         setLogin(true);
         //navigate("/UserList");
        }
    }      
    }} , []);

  return (
    <>
        <Backdrop
                      sx={{
                        color: "#fff",
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                      }}
                      open={openLoader}
                    >
                      <CircularProgress color="inherit" />
                    </Backdrop> 
      {isLogin === false ? (
        <ThemeProvider theme={theme}>
          <Grid container component="main" sx={{ height: "100vh" }}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className="LoginImageSection" />
            <Grid
              item
              xs={12}
              sm={8}
              md={5}
              component={Paper}
              elevation={6}
              square
            >
              <Box
                sx={{
                  my: 8,
                  mx: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>
                {alertBoxmsg.Text !== "" && (
                          <div className="errorMsgDiv">
                            <AlertBox value={alertBoxmsg}></AlertBox>{" "}
                          </div>
                        )}
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 1 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>
                  <Copyright sx={{ mt: 5 }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </ThemeProvider>
      ) : (
        <Home></Home>
      )}
    </>
  );
}
