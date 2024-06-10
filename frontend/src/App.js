import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/register";
import Layout from "./pages/Layout";
import Send from "./pages/Send";
import { useLogin } from "./Context/LoginProvider";
import Profile from "./pages/Profile";

const App = () => {
  const { isLoggedIn } = useLogin();
  return (
    <BrowserRouter>
      <Routes >
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {isLoggedIn  ? 
            [
            <Route path={"/profile"} element={<Profile />} key={"profile"} />,
            <Route path={"/send"} element={<Send />}  key={"send"}/>
            ]
           : [
            <Route path={"/login"} element={<Login />} key={"login"}/>,
            <Route path={"/register"} element={<Register />} key={"register"} />
            ]
          } 
          <Route path={"*"} element={<Navigate replace to={"/"} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
