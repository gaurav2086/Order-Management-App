import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Alert, Button, Stack, styled, Typography } from "@mui/material";

import BorderColorIcon from "@mui/icons-material/BorderColor";

import { useNavigate } from "react-router-dom";


const rows = [
  { id: 1, orderCode: "ORD_602_242023", customer: "Wipro", contactName: "Raj",contactPhone:"+91-8445785425", address: "Wipro pune ",details:"xyz", amount:"100000",status:"Delivered"},
  { id: 2, orderCode: "ORD_602_242024", customer: "Wipro", contactName: "Raj",contactPhone:"+91-8445785425", address: "Wipro pune ",details:"xyz", amount:"150000",status:"Payment Awaited"},  
  { id: 3, orderCode: "ORD_602_242025", customer: "Ghadi detergent", contactName: "Varun",contactPhone:"+91-8995874558", address: "Ghadi",details:"xyz", amount:"350000",status:"Submit For Approval"},  
  { id: 4, orderCode: "ORD_602_242026", customer: "Ghadi detergent", contactName: "Varun",contactPhone:"+91-8995874558", address: "Ghadi",details:"xyz", amount:"450000",status:"In Transit"},
  
];

export default function OrderList() {
  const navigate = useNavigate();
  
const columns: GridColDef[] = [
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
        navigate("/ViewOrder?id=" + params.row["id"]);
        return;
      };

      return (
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            color="warning"
            size="small"
            onClick={onClick}
          >
            View
          </Button>
        </Stack>
      );
    },
  },
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "orderCode",
    headerName: "Order Code",
    width: 150,
    editable: true,
  },
  {
    field: "customer",
    headerName: "Customer",
    width: 150,
    editable: true,
  },
  {
    field: "contactName",
    headerName: "Contact Name",
    width: 110,
    editable: true,
  },
  {
    field: "contactPhone",
    headerName: "Contact Phone",
    width: 110,
    editable: true,
  },
  {
    field: "address",
    headerName: "address",
    width: 110,
    editable: true,
  },
  {
    field: "details",
    headerName: "Details",
    width: 110,
    editable: true,
  },
  {
    field: "amount",
    headerName: "Amount",
    width: 110,
    editable: true,
  },
  {
    field: "status",
    headerName: "status",
    width: 110,
    editable: true,
  },
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
        Order Management
      </Typography>
      <Stack spacing={2} padding={2} direction="row">
        {" "}
        <BorderColorIcon color="primary" sx={{ fontSize: 40 }} />
        <Button variant="contained" onClick={() => navigate("/AddEditOrder")}>
          Add New Order
        </Button>
      </Stack>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </>
  );
}
