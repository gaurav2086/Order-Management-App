import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import Login from "../Login";
import AddForm from "./AddForm";
import ListUser from "./DataList";
import Home from "./Home";
import LogoReview from "./LogoReview";
import AddEditOrder from "./Orders/AddEditOrder";
import OrderList from "./Orders/OrderList";
import ViewOrder from "./Orders/ViewOrder";
import AddEditUser from "./User Management/AddEditUser";
import UserList from "./User Management/UserList";

function MainContainer() {
  let rounts = (
    <Routes>
      <Route path="/" element={<Home></Home>}></Route>
      <Route path="/Login" element={<Login></Login>}></Route>
      <Route path="/UserList" element={<UserList></UserList>}></Route>
      <Route path="/AddEditUser" element={<AddEditUser></AddEditUser>}></Route>
      <Route path="/OrderList" element={<OrderList></OrderList>}></Route>
      <Route path="/ViewOrder" element={<ViewOrder></ViewOrder>}></Route>
      <Route path="/LogoReview" element={<LogoReview></LogoReview>}></Route>

      <Route
        path="/AddEditOrder"
        element={<AddEditOrder></AddEditOrder>}
      ></Route>

      <Route
        path="/*"
        element={
          <div>
            <h1>404 - Not Found!</h1>
            <Link to="/">Go Home</Link>
          </div>
        }
      ></Route>
    </Routes>
  );

  // function dd() {
  //   rounts.add(
  //     <Route path="/LogoReview" element={<LogoReview></LogoReview>}></Route>
  //   );
  // }
  return <div>{rounts}</div>;
}

export default MainContainer;
