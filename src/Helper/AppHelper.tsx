import { User } from "../Interface/User";

class AppHelper {
  static isNullorEmpty = (value: any) => {
    if (value == undefined || value === "" || value.trim().length == 0) {
      return true;
    }
    return false;
  };

  static validateEmail = (email: string) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  static validatePhone = (Phone: string) => {
    if (Phone.trim().length < 26) {
      return true;
    } else {
      return false;
    }
  };

  static validatePassword = (password: string) => {
    return password.match(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    );
  };

  static getUser = () => {
    let user: User = {
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
    };

    if (localStorage.getItem("user-info") !== null) {
      var currentUser = JSON.parse(
        localStorage.getItem("user-info") || " "
      );
      console.log(currentUser);
      if (currentUser !== " ") {
        return currentUser;
      }
    }
    return user;
  };

  static requestOptions = (method: string) => {
    const requestOptions = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + AppHelper.getUser().token,
      },
    };
    return requestOptions;
  };

  static isUserLogin = () => {
    if (AppHelper.getUser().id === 0) {
      window.location.href = "/";
    }
    //return true;
  };

  
  static getQueryValue() {
    return new URLSearchParams(window.location.search);
  }
  

  static newOrderCode = () => {
    let _date = new Date();
    let _getMonth = new Date().getMonth() + 1;
    let orderNumber =
      "ORD_" +
      _date.getUTCMilliseconds() +
      "_" +
      _date.getUTCDate() +
      _getMonth +
      +_date.getFullYear();

    return orderNumber;
  };
}

export default AppHelper;
