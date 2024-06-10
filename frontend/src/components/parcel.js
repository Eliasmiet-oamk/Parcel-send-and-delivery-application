import React from "react";
import "./css/parcel.css";

const Parcel = (props) => {
  return (
    <div className={"container"}>
      <div>
        recipient: {props.recipient_name}
        <br />
        parcel status: {props.parcel_status}
      </div>
    </div>
  );
};

export default Parcel;