import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import MainContainer from "./MainContainer";
import { useNavigate } from "react-router-dom";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import LogoutIcon from '@mui/icons-material/Logout';
import AppHelper from "../Helper/AppHelper";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function Home() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [userName, setuserName] = React.useState("");
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();

function LogOut(){
  localStorage.removeItem("user-info");
  window.location.href = "/";
}


function PasswordReset(){
  var resetpage = "/ResetPassword?id=" +  AppHelper.getUser().id.toString();
  navigate(resetpage)
}
const useEffectCount = React.useRef(true);
React.useEffect(() => {
 
  if (useEffectCount.current) {
    useEffectCount.current = false;
    let username =  AppHelper.getUser().username; 
    setuserName(username);
        
  }} , []);


  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} className="AppBarStyle">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            className="companyName"
          >      
            Camlay Herbal & Cosmetics
          </Typography>
        </Toolbar>

        <Typography        
            component="div"
            align="right"
            className="userName"            
          >      
          Welcome :  {userName}
          </Typography>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {[
            { Name: "User Management", Link: "UserList" },
            { Name: "Sales Order", Link: "OrderLIst" },
            { Name: "Orders", Link: "OrderLIst" },
          ].map((obj, index) => (
            <ListItem key={obj.Name} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <BorderColorIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={obj.Name}
                  onClick={() => navigate(obj.Link)}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {[
            "Coming Soon",
            "Dashboard",
            "Inventory Management",
            "Important updates",
          ].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={() => navigate("/LogoReview")}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
            <ListItem key="logOut" disablePadding>
              <ListItemButton onClick={() => PasswordReset()}>
                <ListItemIcon>
                  <LogoutIcon></LogoutIcon>
                </ListItemIcon>
                <ListItemText primary="Reset Password" />
              </ListItemButton>
            </ListItem>
  <ListItem key="logOut" disablePadding>
              <ListItemButton onClick={() => LogOut()}>
                <ListItemIcon>
                  <LogoutIcon></LogoutIcon>
                </ListItemIcon>
                <ListItemText primary="LogOut" />
              </ListItemButton>
            </ListItem>

        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
       
        <MainContainer></MainContainer>
      </Main>
    </Box>
  );
}
