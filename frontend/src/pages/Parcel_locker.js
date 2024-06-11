import React, { useState } from "react";

function Parcel_locker_sim() {
  const [drop_off_location, setLocation] = useState("Location_1");
  const [parcel_locker, setLocker] = useState("1");
  const [code, setCode] = useState("0");
  const [opendoormessage, setOpendoormessage] = useState("");
  const [opened, setOpened] = useState(false);

  async function pickparcel() {
    const payload = { drop_off_location, parcel_locker, code };
    fetch(`http://localhost:8000/api/parcel/openparcelbox`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then(async (res) => {
      try {
        const jsonRes = await res.json();

        if (res.status === 200) {
          console.log(res.status);
          setOpendoormessage(jsonRes.message);
          setOpened(true);
        } else {
          console.log(jsonRes);
        }
      } catch (err) {
        console.log(err);
      }
    });
  }

  async function updatestatus() {
    const payload = { drop_off_location, parcel_locker, code };
    fetch(`http://localhost:8000/api/parcel/updatestatus`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then(async (res) => {
      try {
        const jsonRes = await res.json();

        if (res.status === 200) {
          console.log(res.status);
          setOpendoormessage("");
          setOpened(false);
          setLocation("");
          setLocker("");
          setCode("");
        } else {
          console.log(jsonRes);
        }
      } catch (err) {
        console.log(err);
      }
    });
  }

  return (
    <div>
      {opened ? null : (
        <div>
          {" "}
          <div>
            Choose drop off location:
            <select onChange={(ev) => setLocation(ev.target.value)}>
              <option value="Location_1">Location_1</option>
              <option value="Location_2">Location_2</option>
              <option value="Location_3">Location_3</option>
              <option value="Location_4">Location_4</option>
              <option value="Location_5">Location_5</option>
            </select>
          </div>
          <div>Current location: {drop_off_location}</div>
          <div>
            Choose locker:
            <select onChange={(ev) => setLocker(ev.target.value)}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
              <option value="15">15</option>
            </select>
          </div>
          <div>Current locker: {parcel_locker}</div>
          <br />
          <div>
            <input
              value={code}
              placeholder="Enter code here"
              onChange={(ev) => setCode(ev.target.value)}
            />
          </div>
          <div>Current code : {code}</div>
          <br />
          <div className={"inputContainer"}>
            <input
              className={"inputButton"}
              type="button"
              onClick={pickparcel}
              value={"Send"}
            />
          </div>{" "}
        </div>
      )}
      <br />
      <div>{opendoormessage}</div>
      <div>
        {opened ? (
          <div className={"inputContainer"}>
            <input
              className={"inputButton"}
              type="button"
              onClick={updatestatus}
              value={"CLOSE CABINET DOOR"}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Parcel_locker_sim;