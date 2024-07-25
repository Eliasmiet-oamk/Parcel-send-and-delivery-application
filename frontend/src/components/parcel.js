import React from "react";
import "./css/parcel.css";

const Parcel = (props) => {
  return (
    <div className={"container"}>
      <h2>PARCEL</h2>
      <div>
        recipient: {props.recipient_name}
        <br />
        sender: {props.sender_name}
        <br />
        parcel status: {props.parcel_status}
        <br />
        {props.codeText}
        {props.code}
        <br />
        {props.parcel_ready}
        <br />
        {props.parcel_picked}
        <br />
        {props.drop_off_location}
        <br />
        {props.parcel_locker}
        <br />
      </div>
    </div>
  );
};

export default Parcel;