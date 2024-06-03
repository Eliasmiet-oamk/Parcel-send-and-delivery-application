import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/register";
import Layout from "./pages/Layout";
import { useLogin } from "./Context/LoginProvider";
import Profile from "./pages/Profile";

const App = (props) => {
  const { profile, isLoggedIn } = useLogin();
  return (
    <BrowserRouter>
      <Routes >
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {isLoggedIn ? 
            [
            // add as many as you'd like here
            <Route path={"/profile"} element={<Profile />} />
            ]
           : [
            <Route path={"/login"} element={<Login />} />,
            <Route path={"/register"} element={<Register />} />
            ]
          }
          <Route path={"*"} element={<Navigate replace to={"/"} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
