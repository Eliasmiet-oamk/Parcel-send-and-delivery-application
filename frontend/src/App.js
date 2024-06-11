import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/register";
import Layout from "./pages/Layout";
import Send from "./pages/Send";
import Parcel_locker_sim from "./pages/Parcel_locker";
import { useLogin } from "./Context/LoginProvider";
import Profile from "./pages/Profile";

const App = () => {
  const { profile, isLoggedIn } = useLogin();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {isLoggedIn && profile.roles === "user"
            ? [
                <Route
                  path={"/profile"}
                  element={<Profile />}
                  key={"profile"}
                />,
                <Route path={"/send"} element={<Send />} key={"send"} />,
                <Route
                  path={"/parcelsim"}
                  element={<Parcel_locker_sim />}
                  key={"Parcel_locker_sim"}
                />,
              ]
            : null}
          {isLoggedIn && profile.roles === "driver"
            ? [
                <Route
                  path={"/profile"}
                  element={<Profile />}
                  key={"profile"}
                />,
                <Route path={"/pickup"} element={<Home />} key={"send"} />,
              ]
            : null}
          {isLoggedIn
            ? null
            : [
                <Route path={"/login"} element={<Login />} key={"login"} />,
                <Route
                  path={"/register"}
                  element={<Register />}
                  key={"register"}
                />,
              ]}
          <Route path={"*"} element={<Navigate replace to={"/"} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;