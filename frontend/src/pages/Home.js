import React from 'react'
import Notification from '../components/notification.js';
import { useLogin } from "../Context/LoginProvider";
import "./css/home.css"

function Home() {

  const { profile, isLoggedIn } = useLogin();
  return (
    <div className={"Container"}>
      {isLoggedIn && profile.roles === "user" ? <Notification />: null}
    </div>
  );
}

export default Home;
