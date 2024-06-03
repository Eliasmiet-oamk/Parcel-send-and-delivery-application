import React, { useState } from "react";
import "./css/login.css";


const Register = (props) => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");
    const [roles, setRole] = useState("")
    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
  
    const onButtonClick = () => {
      // Set initial error values to empty
      setEmailError("");
      setUsernameError("");
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

      if ("" === username) {
        setUsernameError("Please enter your Username");
        return;
      }

      if (username.length < 2) {
        setUsernameError("The Username must be 2 characters or longer");
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

      if (password != verifyPassword)  {
        setPasswordError("The Password has to match");
        return;
      }
  
      register();
    };
  
    const register = () => {
        const payload = {username,email,password,roles};
        fetch(`http://localhost:8000/api/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                
                
            },
            body: JSON.stringify(payload),
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
        <div className={"mainContainer"}>
      <div className={"titleContainer"}>
        <div> Register </div>
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
          value={username}
          placeholder="Enter your username here"
          onChange={(ev) => setUsername(ev.target.value)}
          className={"inputBox"}
        />
        <label className="errorLabel">{usernameError}</label>
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
          value={verifyPassword}
          placeholder="Verify password"
          onChange={(ev) => setVerifyPassword(ev.target.value)}
          className={"inputBox"}
        />
        <label className="errorLabel">{passwordError}</label>
      </div>
      <br />
      <div className={"inputContainer"}>
      <input type="radio" id="roleUser" name="fav_language" value="user"  onChange={(ev) => setRole(ev.target.value) }/>
      <label for="roleUser">User</label>
      <br />
      <input type="radio" id="roleDriver" name="fav_language" value="driver" onChange={(ev) => setRole(ev.target.value) }/>
      <label for="roleDriver">Driver</label>
      </div>
      <br />
      <div className={"inputContainer"}>
        <input
          className={"inputButton"}
          type="button"
          onClick={onButtonClick}
          value={"Register"}
        />
      </div>
    </div>
    );
  }
  
  export default Register;
  