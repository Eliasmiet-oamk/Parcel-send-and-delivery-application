import React, { useEffect, useReducer, useState } from "react";
import { useLogin } from "../Context/LoginProvider";
import { actionCreators, initialState, reducer } from "../components/reducer";
import Parcel from "../components/parcel";
import "./css/profile.css"

const Profile = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [toogle_parcel_history, setToogle_parcel_history] = useState(false)
  const { setIsLoggedIn, profile, setProfile, onLoginReceiveTOKEN, token } =
    useLogin();
  const { result, loading, error } = state;


  useEffect(() => {
    if (profile.roles === "user"){
      fetchPosts();
    }
  }, [toogle_parcel_history]);

  async function fetchPosts() {
    dispatch(actionCreators.loading());
    if (toogle_parcel_history) {
    try {
      const user_id = profile.id;
      const payload = { user_id };
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/parcel/getUserparcels`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );
      const result = await response.json();
      dispatch(actionCreators.success(result));
    } catch (e) {
      dispatch(actionCreators.failure());
    }
  } else {
    try {
      const username = profile.username;
      const payload = { username };
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/parcel/getParcelbyrecipient`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );
      const result = await response.json();
      dispatch(actionCreators.success(result));
    } catch (e) {
      dispatch(actionCreators.failure());
    }
  }
  }

  async function deleteUser() {
    dispatch(actionCreators.loading());
    const value = token;
    fetch(`${process.env.REACT_APP_BASE_URL}/api/users/deleteUser/${profile.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${value}`,
      },
    }).then(async (res) => {
      try {
        const jsonRes = await res.json();
        if (res.status !== 201) {
          console.log(jsonRes);
        } else {
          dispatch(actionCreators.success());
        }
      } catch (err) {
        dispatch(actionCreators.failure());
      }
    });
  }

  if (loading) {
    return <div>loading</div>;
  }

  if (error) {
    return <div>error</div>;
  }

  const sent_parcels = result.map((result) => (
    <Parcel
      parcel_status={result.parcel_status}
      recipient_name={result.recipient_name}
      sender_name={result.sender_name}
      parcel_ready={result.parcel_ready}
      parcel_picked={result.parcel_picked}
      key={result._id}
    />
  ));

  const received_parcels = result.map((result) => (
    <Parcel
      parcel_status={result.parcel_status}
      recipient_name={result.recipient_name}
      sender_name={result.sender_name}
      parcel_ready={result.parcel_ready}
      parcel_picked={result.parcel_picked}
      key={result._id}
    />
  ));

  function toogle() {
    setToogle_parcel_history(toogle_parcel_history => !toogle_parcel_history);
  }

  return (
    <div className={"center"}>
      <div className={"left"}>
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
            deleteUser();
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
      <div>
        
      {profile.roles === "user" ?   <button
          onClick={() => {toogle()
          }}
        >
          {" "}
          Toogle sent and recieved Parcels
        </button> : null}
        <br />
        <br />
        {profile.roles === "user" ?  <div>{toogle_parcel_history ? "Sent Parcels": "Received Parcels"}</div> : null }
      </div>
      <br />
      {profile.roles === "user"  && toogle_parcel_history ?  <div> <ul>{sent_parcels}</ul> </div> : <div> <ul>{received_parcels}</ul> </div>}
      <br />
    </div>
  );
};

export default Profile;