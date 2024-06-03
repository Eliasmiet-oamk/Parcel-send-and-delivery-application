import React from "react";
import { useLogin } from "../Context/LoginProvider";

const Profile = (props) => {
  const { setIsLoggedIn, profile, setProfile, onLoginReceiveTOKEN, token } =
    useLogin();
  return (
    <div>
      <button
        onClick={() => {
          setIsLoggedIn(false);
          onLoginReceiveTOKEN(null);
          setProfile("");
          localStorage.removeItem("token");
        }}
      >
        {" "}
        Log out
      </button>
    </div>
  );
};

export default Profile;
