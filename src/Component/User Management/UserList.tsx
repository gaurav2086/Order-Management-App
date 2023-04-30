import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Button, Stack, Typography,IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import { User } from "../../Interface/User";
import { AppSettings } from "../../AppSettings";
import AppHelper from "../../Helper/AppHelper";
import LockResetIcon from "@mui/icons-material/LockReset";
import BorderColorIcon from "@mui/icons-material/BorderColor";
 

export default function ListUser() {
  const navigate = useNavigate();
  const [userList, setUsersList] = React.useState<User[]>([]);
  const [openLoader, setOpenloader] = React.useState(false);

  const useEffectCount = React.useRef(true);
  React.useEffect(() => {
    if (useEffectCount.current) {
      useEffectCount.current = false;
      getUsers();
    }
  }, []);

  function getUsers() {
    setOpenloader(true);
    let apiUrl = AppSettings.API_URL + "User/GetUsers";
    const response = fetch(apiUrl, AppHelper.requestOptions("Get"))
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
        setUsersList(data);
      })
      .catch((err) => {
        if (err.message === "Failed to fetch") {
          navigate("/SessionExpired");
        } else {
          console.log(err.message);
        }
      })
      .finally(() => {
        setOpenloader(false);
      });
  }

  

const columns: GridColDef[] = [
  // { field: "id", headerName: "ID", width: 90 ,},
  {
    field: "action",
    headerName: "Action",
    width: 110,
    sortable: false,
    disableExport: false,
    filterable: false,
    disableReorder: false,
    editable: false,

    renderCell: (params) => {
      const onClick = () => {
        navigate("/AddEditUser?id=" + params.row["id"]);
        return;
      };

      const onClickResetPws = () => {
        navigate("/ResetPassword?id=" + params.row["id"]);
        return;
      };

      return (
        <Stack direction="row" spacing={2}>
          {/* <Button
            variant="outlined"
            color="warning"
            size="small"
            onClick={onClick}
          >
            Edit
          </Button> */}
               <IconButton color="primary" title="Edit" size="small">
                <BorderColorIcon onClick={onClick} />
              </IconButton>
          <IconButton color="primary" title="Reset password">
                <LockResetIcon onClick={onClickResetPws} />
              </IconButton>
        </Stack>
      );
    },
  },
  {
    field: "username",
    headerName: "Username",
    width: 150,
    editable: true,
  },
  {
    field: "firstName",
    headerName: "First name",
    width: 150,
    editable: true,
  },
  {
    field: "lastName",
    headerName: "Last name",
    width: 150,
    editable: true,
  },
  {
    field: "phoneNumber",
    headerName: "Phone Number",
    width: 180,
    editable: true,
  },
  {
    field: "userType",
    headerName: "User Type",
    type: "number",
    width: 110,
    editable: true,
  },
  {
    field: "isActive",
    headerName: "Active",
    width: 110,
    editable: true,
  },
  {
    field: "createdBy",
    headerName: "CreatedBy",
    type: "number",
    width: 110,
    editable: true,
  },

  
  // {
  //   field: "Email",
  //   headerName: "Email",
  //   description: "This column has a value getter and is not sortable.",
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (params: GridValueGetterParams) =>
  //     `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  // },
];

  return (
    <>
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h5"
        padding={2}
        id="tableTitle"
        component="div"
      >
        User Management
      </Typography>
      <Stack spacing={2} padding={1} direction="row">
        {" "}
        <GroupAddRoundedIcon color="primary" sx={{ fontSize: 40 }} />
        <Button variant="contained" onClick={() => navigate("/AddEditUser")}>
          Add New User
        </Button>
      </Stack>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={userList}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
        />
      </Box>
    </>
  );
}
