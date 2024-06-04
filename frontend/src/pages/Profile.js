import React, { useState } from "react";
import { useLogin } from "../Context/LoginProvider";

const Profile = (props) => {
  const { setIsLoggedIn, profile, setProfile, onLoginReceiveTOKEN, token } =
    useLogin();

  const deleteUser = () => {
    const value = token
    fetch(`http://localhost:8000/api/users/deleteUser/${profile.id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${value}`,
          },
    }).then(async res => { 
        try {
            const jsonRes = await res.json();
    
            if (res.status !== 201) {
                console.log("error")
                
            } else {
               console.log(jsonRes)
                ;
            }
        } catch (err) {
            console.log(err);
        };
    })
    
    }
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
      <br />
      <div>
      <button
        onClick={() => {
          deleteUser()
          setIsLoggedIn(false);
          onLoginReceiveTOKEN(null);
          setProfile("");
          localStorage.removeItem("token");
        }}
      >
        {" "}
        Delete account
      </button>
      </div>
    </div>
  );
};

export default Profile;
