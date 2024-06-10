import React from 'react'
import Notification from '../components/notification.js';
import { useLogin } from "../Context/LoginProvider";

function Home() {

  const { isLoggedIn } = useLogin();
  return (
    <div>
      {isLoggedIn ? <Notification />: "not logged in"}
    </div>
  );
}

export default Home;
