import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Login from "./Login";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Login></Login>
      </div>
    </BrowserRouter>
  );
}

export default App;
