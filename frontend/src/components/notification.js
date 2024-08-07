import React, { useEffect, useReducer } from "react";
import { useLogin } from "../Context/LoginProvider";
import { actionCreators, initialState, reducer } from "./reducer";
import Parcel from "./parcel";

const Notification = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { profile, token } = useLogin();
  const { result, loading, error } = state;

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    dispatch(actionCreators.loading());

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

  if (loading) {
    return <div>loadingg</div>;
  }

  if (error) {
    return <div>error</div>;
  }

  const ready_parcels = result.map((result) =>
    result.parcel_status == "ready" ? (
      <Parcel
        parcel_status={result.parcel_status}
        sender_name={result.sender_name}
        recipient_name={result.recipient_name}
        drop_off_location={result.drop_off_location}
        parcel_locker={result.parcel_locker}
        codeText={"Locker code: "}
        code={result.code}
        key={result._id}
      />
    ) : null,
  );

  return (
    <div>
      <h1>Notifications:</h1>
      <div>{ready_parcels}</div>
    </div>
  );
};

export default Notification;