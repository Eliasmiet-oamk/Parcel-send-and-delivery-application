import React, { useState } from "react";
import { useLogin } from "../Context/LoginProvider";
import "./css/login.css";

const Send = () => {
  const { profile,  token } = useLogin();
  // Recipient
  const [recipient_name, setRecipient_name] = useState("");
  const [recipient_address, setRecipient_address] = useState("");
  const [recipient_phonenumber, setRecipient_phonenumber] = useState("");
  // Recipient error message
  const [recipient_name_error, setRecipient_name_error] = useState("");
  const [recipient_address_error, setRecipient_address_error] = useState("");
  const [recipient_phonenumber_error, setRecipient_phonenumber_error] =
    useState("");
  //Sender
  const [sender_name, setSender_name] = useState("");
  const [sender_address, setSender_address] = useState("");
  const [sender_phonenumber, setSender_phonenumber] = useState("");
  // Sender error message
  const [sender_name_error, setSender_name_error] = useState("");
  const [sender_address_error, setSender_address_error] = useState("");
  const [sender_phonenumber_error, setSender_phonenumber_error] = useState("");
  // Parcel
  const [parcel_height, setParcel_height] = useState("");
  const [parcel_width, setParcel_width] = useState("");
  const [parcel_depth, setParcel_depth] = useState("");
  const [parcel_weight, setParcel_weight] = useState("");
  // Parcel error message
  const [parcel_height_error, setParcel_height_error] = useState("");
  const [parcel_width_error, setParcel_width_error] = useState("");
  const [parcel_depth_error, setParcel_depth_error] = useState("");
  const [parcel_weight_error, setParcel_weight_error] = useState("");
  // Drop off location
  const [drop_off_location, setLocation] = useState("");

  const createParcel = () => {
    const user_id = profile.id,
      parcel_status = "sent";
    const payload = {
      user_id,
      drop_off_location,
      recipient_name,
      recipient_address,
      recipient_phonenumber,
      sender_name,
      sender_address,
      sender_phonenumber,
      parcel_height,
      parcel_width,
      parcel_depth,
      parcel_weight,
      parcel_status,
    };
    fetch(`${process.env.REACT_APP_BASE_URL}/api/parcel/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
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
  };

  const onButtonClick = () => {
    // Set initial error values to empty
    // Recipient errors
    setRecipient_name_error("");
    setRecipient_address_error("");
    setRecipient_phonenumber_error("");
    // sender errors
    setSender_name_error("");
    setSender_address_error("");
    setSender_phonenumber_error("");
    // Parcel errors
    setParcel_height_error("");
    setParcel_width_error("");
    setParcel_depth_error("");
    setParcel_weight_error("");

    // Check if the user has entered fields correctly
    if ("" === recipient_name) {
      setRecipient_name_error("Please enter recipient name ");
      return;
    }

    if ("" === recipient_address) {
      setRecipient_address_error("Please enter recipient address ");
      return;
    }

    if ("" === recipient_phonenumber) {
      setRecipient_phonenumber_error("Please enter recipient phonenumber ");
      return;
    }

    if ("" === sender_name) {
      setSender_name_error("Please enter sender name ");
      return;
    }

    if ("" === sender_address) {
      setRecipient_address_error("Please enter sender address ");
      return;
    }

    if ("" === sender_phonenumber) {
      setSender_phonenumber_error("Please enter sender phonenumber ");
      return;
    }

    if ("" === parcel_height) {
      setParcel_height_error("Please enter parcel height  ");
      return;
    }

    if ("" === parcel_width) {
      setParcel_width_error("Please enter parcel width ");
      return;
    }

    if ("" === parcel_depth) {
      setParcel_depth_error("Please enter parcel depth");
      return;
    }

    if ("" === parcel_weight) {
      setParcel_weight_error("Please enter parcel weight ");
      return;
    }

    createParcel();
  };

  return (
    <div className={"mainContainer"}>
      <br />
      <div className="side-by-side">
        <div>
          <div >
            <input
              value={recipient_name}
              placeholder="Enter recipient name"
              onChange={(ev) => setRecipient_name(ev.target.value)}
              className={"inputBox"}
            />
            <label className="errorLabel">{recipient_name_error}</label>
          </div>
          <br />
          <div >
            <input
              value={recipient_address}
              placeholder="Enter recipient address"
              onChange={(ev) => setRecipient_address(ev.target.value)}
              className={"inputBox"}
            />
            <label className="errorLabel">{recipient_address_error}</label>
          </div>
          <br />
          <div>
            <input
              type="number"
              value={recipient_phonenumber}
              placeholder="Enter recipient phonenumber"
              onChange={(ev) => setRecipient_phonenumber(ev.target.value)}
              className={"inputBox"}
            />
            <label className="errorLabel">{recipient_phonenumber_error}</label>
          </div>
        </div>
        <div>
          <div >
            <input
              value={sender_name}
              placeholder="Enter sender name"
              onChange={(ev) => setSender_name(ev.target.value)}
              className={"inputBox"}
            />
            <label className="errorLabel">{sender_name_error}</label>
          </div>
          <br />
          <div >
            <input
              value={sender_address}
              placeholder="Enter sender address"
              onChange={(ev) => setSender_address(ev.target.value)}
              className={"inputBox"}
            />
            <label className="errorLabel">{sender_address_error}</label>
          </div>
          <br />
          <div>
            <input
              type="number"
              value={sender_phonenumber}
              placeholder="Enter sender phonenumber"
              onChange={(ev) => setSender_phonenumber(ev.target.value)}
              className={"inputBox"}
            />
            <label className="errorLabel">{sender_phonenumber_error}</label>
          </div>
        </div>
        <br />
      </div>
      <br />
      <div className="margin1px">
        <input
          type="number"
          value={parcel_height}
          placeholder="Enter parcel height"
          onChange={(ev) => setParcel_height(ev.target.value)}
        />
        <label className="errorLabel">{parcel_height_error}</label>
        <br />
        <input
          type="number"
          value={parcel_width}
          placeholder="Enter parcel width"
          onChange={(ev) => setParcel_width(ev.target.value)}
        />
        <label className="errorLabel">{parcel_width_error}</label>
        <br />
        <input
          type="number"
          value={parcel_depth}
          placeholder="Enter parcel depth"
          onChange={(ev) => setParcel_depth(ev.target.value)}
        />
        <label className="errorLabel">{parcel_depth_error}</label>
        <br />
        <input
          type="number"
          value={parcel_weight}
          placeholder="Enter parcel weight"
          onChange={(ev) => setParcel_weight(ev.target.value)}
        />
        <label className="errorLabel">{parcel_weight_error}</label>
        <br />
      </div>
      <br />
      <div>
        Choose drop off location: <br />
        <select onChange={(ev) => setLocation(ev.target.value)}>
          <option value="Location_1">Location_1</option>
          <option value="Location_2">Location_2</option>
          <option value="Location_3">Location_3</option>
          <option value="Location_4">Location_4</option>
          <option value="Location_5">Location_5</option>
        </select>
      </div>
      <br />
      <div className={"inputContainer"}>
        <input
          className={"inputButton"}
          type="button"
          onClick={onButtonClick}
          value={"Send"}
        />
      </div>
    </div>
  );
};

export default Send;