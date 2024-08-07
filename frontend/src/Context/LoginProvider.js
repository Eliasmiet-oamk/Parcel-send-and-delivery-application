import React, { createContext, useContext, useState, useEffect } from "react";

const LoginContext = createContext();

const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState({});
  const [token, onLoginReceiveTOKEN] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const value = localStorage.getItem("token");
      if (value !== null) {
        fetch(`${process.env.REACT_APP_BASE_URL}/api/users/haveToken`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${value}`,
          },
        }).then(async (res) => {
          try {
            const jsonRes = await res.json();
            if (res.status === 401) {
              setIsLoggedIn(false);
            }  
            if ( res.status === 200) {
              setIsLoggedIn(true);
              console.log("Login successful");
              setProfile(jsonRes.body);
              onLoginReceiveTOKEN(value);
            }
          } catch (err) {
            console.log(err);
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <LoginContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        profile,
        setProfile,
        token,
        onLoginReceiveTOKEN,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);

export default LoginProvider;
