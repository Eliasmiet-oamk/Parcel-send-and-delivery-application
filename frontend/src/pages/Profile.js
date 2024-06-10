import React, { useEffect, useReducer } from "react";
import { useLogin } from "../Context/LoginProvider";
import { actionCreators, initialState, reducer } from "../components/reducer";
import Parcel from "../components/parcel";

const Profile = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { setIsLoggedIn, profile, setProfile, onLoginReceiveTOKEN, token } =
    useLogin();
  const { result, loading, error } = state;

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    dispatch(actionCreators.loading());

    try {
      const user_id = profile.id;
      const payload = { user_id };
      const response = await fetch(
        `http://localhost:8000/api/parcel/getUserparcels`,
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

  async function deleteUser() {
    const value = token;
    fetch(`http://localhost:8000/api/users/deleteUser/${profile.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${value}`,
      },
    }).then(async (res) => {
      try {
        const jsonRes = await res.json();

        if (res.status !== 201) {
          console.log("error");
        } else {
          console.log(jsonRes);
        }
      } catch (err) {
        console.log(err);
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
      key={result._id}
    />
  ));
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
      <br />
      <div>
        <ul>{sent_parcels}</ul>
      </div>
      <br />
    </div>
  );
};

export default Profile;