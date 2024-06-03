import React, { useState } from "react";
import { Buffer } from "buffer";
import "./css/login.css";
import { useLogin } from "../Context/LoginProvider";

const Login = (props) => {
  const { onLoginReceiveTOKEN, setProfile, setIsLoggedIn } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { profile, isLoggedIn } = useLogin();

  const onButtonClick = () => {
    // Set initial error values to empty
    setEmailError("");
    setPasswordError("");

    // Check if the user has entered both fields correctly
    if ("" === email) {
      setEmailError("Please enter your email");
      return;
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError("Please enter a valid email");
      return;
    }

    if ("" === password) {
      setPasswordError("Please enter a password");
      return;
    }

    if (password.length < 2) {
      setPasswordError("The password must be 8 characters or longer");
      return;
    }

    logIn();
  };

  // Log in a user using email and password
  const logIn = () => {
    const payload = { email, password };
    var base64encodedData = Buffer.from(email + ":" + password).toString(
      "base64",
    );
    fetch("http://localhost:8000/api/users/Login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${base64encodedData}`,
      },
      body: JSON.stringify(payload),
    }).then(async (res) => {
      try {
        const jsonRes = await res.json();

        if (res.status !== 200) {
          console.log("error");
        } else {
          setIsLoggedIn(true);
          localStorage.setItem("token", jsonRes.token);
          onLoginReceiveTOKEN(jsonRes.token);
          setProfile(jsonRes.body);
        }
      } catch (err) {
        console.log(err);
      }
    });
  };

  return (
    <div className={"mainContainer"}>
      <div className={"titleContainer"}>
        <div> {isLoggedIn ? "yeslogin" : "notlogin"}</div>
      </div>
      <br />
      <div className={"inputContainer"}>
        <input
          value={email}
          placeholder="Enter your email here"
          onChange={(ev) => setEmail(ev.target.value)}
          className={"inputBox"}
        />
        <label className="errorLabel">{emailError}</label>
      </div>
      <br />
      <div className={"inputContainer"}>
        <input
          value={password}
          placeholder="Enter your password here"
          onChange={(ev) => setPassword(ev.target.value)}
          className={"inputBox"}
        />
        <label className="errorLabel">{passwordError}</label>
      </div>
      <br />
      <div className={"inputContainer"}>
        <input
          className={"inputButton"}
          type="button"
          onClick={onButtonClick}
          value={"Log in"}
        />
      </div>
    </div>
  );
};

export default Login;
