import React, { useState, useEffect, useReducer } from "react";
import { useLogin } from "../Context/LoginProvider";
import { actionCreators, initialState, reducer } from "../components/reducer";
import Parcel from "../components/parcel";
import "./css/driverView.css";

const Pickup = () => {
  const { token } = useLogin();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [drop_off_location, setLocation] = useState("Location_1");
  const [available_lockers, setAvailable_lockers] = useState([]);
  const [locker_info, setLocker_info] = useState([{}]);
  const [choose_driver_parcel, setChoose_driver_parcel] = useState([{}]);
  const [chosen, setChosen] = useState([{}]);
  const [chosen2, setChosen2] = useState(false);
  const [chosen_locker, setChosen_locker] = useState("");
  const [chosen3, setchosen3] = useState(false);
  const { result, loading, error } = state;

  useEffect(() => {
    fetchParcel();
  }, []);

  async function fetchParcel() {
    dispatch(actionCreators.loading());

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/parcel/drivers`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const result = await response.json();
      dispatch(actionCreators.success(result));
    } catch (e) {
      dispatch(actionCreators.failure());
    }
  }

  async function get_available_lockers() {
    const payload = { drop_off_location };
    fetch(`${process.env.REACT_APP_BASE_URL}/api/parcel/getlockers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }).then(async (res) => {
      try {
        const jsonRes = await res.json();

        if (res.status === 201) {
          console.log(res.status);
          setAvailable_lockers(jsonRes.available_lockers.available_lockers);

          setLocker_info(jsonRes.available_lockers.locker_info);
        } else {
          setAvailable_lockers([]);
          setLocker_info([{}]);
        }
      } catch (err) {
        console.log(err);
      }
    });
  }

  async function driver() {
    console.log(chosen.locker);
    const parcel_locker = chosen.locker;
    const payload = { drop_off_location, parcel_locker };
    fetch(`${process.env.REACT_APP_BASE_URL}/api/parcel/driverParcel`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }).then(async (res) => {
      try {
        const jsonRes = await res.json();

        if (res.status === 200) {
          console.log(res.status);
          console.log(jsonRes);
          setChosen2(false);
          setAvailable_lockers([]);
          setLocker_info([{}]);
          fetchParcel();
        } else {
          console.log(jsonRes);
        }
      } catch (err) {
        console.log(err);
      }
    });
  }

  async function driver_deliver() {
    const _id = choose_driver_parcel._id;
    const parcel_locker = chosen_locker;
    const payload = { _id, drop_off_location, parcel_locker };
    fetch(`${process.env.REACT_APP_BASE_URL}/api/parcel/deliverParcel`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }).then(async (res) => {
      try {
        const jsonRes = await res.json();

        if (res.status === 200) {
          console.log(res.status);
          console.log(jsonRes);
          setAvailable_lockers([]);
          setLocker_info([{}]);
          setLocation("")
          setChosen_locker("")
          fetchParcel();
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

  const drivers_parcels = result.map((result) => (
    <li className={"side-by-side"}>
      <input
        type="button"
        value={"Choose Parcel"}
        onClick={() => {
          setchosen3(true);
          setChoose_driver_parcel(result);
        }}
      />
      <Parcel
        parcel_status={result.parcel_status}
        sender_name={result.sender_name}
        recipient_name={result.recipient_name}
        key={result._id}
      />
    </li>
  ));

  const sent = locker_info.map((result) => (
    <div>
      locker: {result.locker} status: {result.status}{" "}
      {result.status == "sent" ? (
        <input
          type="button"
          value={"Choose locker"}
          onClick={() => {
            setChosen2(true);
            setChosen(result);
          }}
        />
      ) : null}{" "}
    </div>
  ));

  const aLockers = available_lockers.map((result) => (
    <div>
      locker: {result}{" "}
      <input
        type="button"
        value={"Choose "}
        onClick={() => setChosen_locker(result)}
      />
    </div>
  ));

  return (
    <div className={"mainContainerp"}>
      <div>
        <div>
          Choose drop off location:
          <select onChange={(ev) => setLocation(ev.target.value)}>
            <option value="Location_1">Location_1</option>
            <option value="Location_2">Location_2</option>
            <option value="Location_3">Location_3</option>
            <option value="Location_4">Location_4</option>
            <option value="Location_5">Location_5</option>
          </select>
          <br />
          Current location: {drop_off_location}
        </div>
        <div>
          <input
            type="button"
            onClick={get_available_lockers}
            value={"Pick Location"}
          />
        </div>
        <div>
          available lockers:
          <ul>{aLockers}</ul>
          <br />
          Chosen Locker: {chosen_locker}
          <br />
          <br />
          <div>
            <div>
              Lockers That have parcel:
              <ul>{sent}</ul>
            </div>
          </div>
        </div>
        {chosen2 ? (
          <input
            type="button"
            value={`Pickup parcel in locker ${chosen.locker}`}
            onClick={() => {
              driver();
            }}
          />
        ) : null}
      </div>
      <div>
      Parcels that driver has picked:
      <nav>
        <ul className={"parcelList"}>{drivers_parcels}</ul>
      </nav>
      <div>
        {chosen3 ? (
          <>
            <h5>Chosen Parcel</h5>
            <Parcel
              parcel_status={choose_driver_parcel.parcel_status}
              sender_name={choose_driver_parcel.sender_name}
              recipient_name={choose_driver_parcel.recipient_name}
              key={choose_driver_parcel._id}
            />
            <input
              type="button"
              onClick={() => {
                driver_deliver();
                fetchParcel();
                setchosen3(false);
              }}
              value={"Deliver Parcel"}
            />
          </>
        ) : null}
      </div>
      </div>
    </div>
  );
};

export default Pickup;