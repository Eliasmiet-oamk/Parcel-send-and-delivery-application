import express from "express";
import Parcel from "../models/parcelModel.js";
import passport from "passport";

import { applyPassportStrategybasic } from "../middleware/basicStrategy.js";
import { applyPassportStrategyjwt } from "../middleware/jwtStrategy.js";

const parcelRoute = express.Router();

applyPassportStrategybasic(passport);
applyPassportStrategyjwt(passport);

function getNumber() {
  let number = Math.floor(Math.random() * 15);
  return number;
}

function getCode() {
  let number = Math.floor(Math.random() * 900000) + 100000;
  return number;
}

parcelRoute.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // misc
    const user_id = req.body.user_id;
    const drop_off_location = req.body.drop_off_location;
    const parcel_locker = getNumber();
    const code = getCode();
    // recipient
    const recipient_name = req.body.recipient_name;
    const recipient_address = req.body.recipient_address;
    const recipient_phonenumber = req.body.recipient_phonenumber;
    // sender
    const sender_name = req.body.sender_name;
    const sender_address = req.body.sender_address;
    const sender_phonenumber = req.body.sender_phonenumber;
    // parcel
    const parcel_height = req.body.parcel_height;
    const parcel_width = req.body.parcel_width;
    const parcel_depth = req.body.parcel_depth;
    const parcel_weight = req.body.parcel_weight;
    const parcel_status = req.body.parcel_status;

    const newParcel = new Parcel({
      // misc
      user_id,
      drop_off_location,
      parcel_locker,
      code,
      // recipient
      recipient_name,
      recipient_address,
      recipient_phonenumber,
      // sender
      sender_name,
      sender_address,
      sender_phonenumber,
      // parcel
      parcel_height,
      parcel_width,
      parcel_depth,
      parcel_weight,
      parcel_status,
    });

    try {
      newParcel.save().then(res.status(201).json({ message: "Parcel Sent" }));
    } catch (err) {
      console.log(err);
    }
  },
);

parcelRoute.post(
  "/getUserparcels",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const idU = req.body.user_id;
    const parcel = await Parcel.find({ user_id: idU });
    if (parcel) {
      Parcel.find({ user_id: idU }).then((parcel) => res.json(parcel));
    } else {
      res.status(404).send({ message: "Parcel Not Found" });
    }
  },
);
parcelRoute.post(
  "/getParcelbyrecipient",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const recipient_name = req.user.username;
    const parcel = await Parcel.find({ recipient_name: recipient_name });
    if (parcel) {
      Parcel.find({ recipient_name: recipient_name }).then((parcel) =>
        res.json(parcel),
      );
    } else {
      res.status(404).send({ message: "Parcel Not Found" });
    }
  },
);

export default parcelRoute;