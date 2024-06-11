import React from 'react'
import Notification from '../components/notification.js';
import { useLogin } from "../Context/LoginProvider";

function Home() {

  const { profile, isLoggedIn } = useLogin();
  return (
    <div>
      {isLoggedIn && profile.roles === "user" ? <Notification />: null}
    </div>
  );
}

export default Home;
