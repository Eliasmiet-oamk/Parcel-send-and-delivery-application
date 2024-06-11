import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { useLogin } from "../Context/LoginProvider";
import "./css/header.css";

const Header = () => {
  const { profile, isLoggedIn } = useLogin();
  return (
    <>
      <nav>
        <ul className={"navContainer"}>
          <li className={"navlist"}>
            <Link to="/">Home</Link>
          </li>
          <li className={"navlist"}>
            <Link to="/"> Role: {profile.roles} </Link>
          </li>
          <li className={"navlist"}>
            {isLoggedIn && profile.roles === "user"
              ? [
                  <ul className={"navContainer"} key={"login_user"}>
                    {" "}
                    <li className={"navlist"}>
                      {" "}
                      <Link to="/profile">Hi! {profile.username}</Link>
                    </li>
                    ,
                    <li className={"navlist"}>
                      <Link to="/send"> Send </Link>
                    </li>
                    ,
                    <li className={"navlist"}>
                      <Link to="/parcelsim"> parcelboxsimulator </Link>
                    </li>
                  </ul>,
                ]
              : null}
            {isLoggedIn && profile.roles === "driver"
              ? [
                  <ul className={"navContainer"} key={"login_driver"}>
                    {" "}
                    <li className={"navlist"}>
                      {" "}
                      <Link to="/profile">Hi! {profile.username}</Link>
                    </li>
                    ,
                    <li className={"navlist"}>
                      <Link to="/pickup"> Pickup </Link>
                    </li>{" "}
                  </ul>,
                ]
              : null}
            {isLoggedIn
              ? null
              : [
                  <ul className={"navContainer"} key={"logout"}>
                    <li className={"navlist"}>
                      <Link to="/login">Login</Link>
                    </li>
                    ,{" "}
                    <li className={"navlist"}>
                      <Link to="/register">Register</Link>
                    </li>
                  </ul>,
                ]}
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  );
};

export default Header;