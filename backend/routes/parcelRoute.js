import express from "express";
import Parcel from "../models/parcelModel.js";
import passport from "passport";

import { applyPassportStrategybasic } from "../middleware/basicStrategy.js";
import { applyPassportStrategyjwt } from "../middleware/jwtStrategy.js";

const parcelRoute = express.Router();

applyPassportStrategybasic(passport);
applyPassportStrategyjwt(passport);

async function getNumber() {
  let number = Math.floor(Math.random() * 14) + 1;
  const parcel = await Parcel.find({ parcel_locker: number });
  if (parcel){
    getNumber()
  } else{
    return number;
  }
}

function getCode(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

parcelRoute.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // misc
    const user_id = req.body.user_id;
    const drop_off_location = req.body.drop_off_location;
    const parcel_locker = getNumber();
    const code = getCode(4);
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

parcelRoute.post(
    "/openparcelbox",
    async (req, res) => {
    
    const drop_off_location = req.body.drop_off_location
    const parcel_locker = req.body.parcel_locker
    const code = req.body.code
    
    const parcel = await Parcel.findOne({drop_off_location: drop_off_location, parcel_locker : parcel_locker, code: code  });
    if (!parcel){
      res.status(404).send({ message: 'Parcel Not Found' });
       return;
    }
    if (parcel.parcel_status === "ready") {
        res.send({message: `DOOR ${parcel_locker} OPEN FOR PICKUP`, parcel: parcel});
        return;
    } 
    else if (parcel.parcel_status === "sent") {
        res.send({message: `DOOR ${parcel_locker} OPEN FOR DELIVERY`, parcel: parcel});
        return;
    } else {
        res.status(404).send({ message: 'Parcel Not Found' });
        return;
    }  
 }     
)

parcelRoute.put(
    "/updatestatus",
    async (req, res) => {
    const drop_off_location = req.body.drop_off_location
    const parcel_locker = req.body.parcel_locker
    const code = req.body.code
    
    const parcel = await Parcel.findOne({drop_off_location: drop_off_location, parcel_locker : parcel_locker, code: code  });
    if (!parcel){
      res.status(404).send({ message: 'Parcel Not Found' });
      return;
    }
    if (parcel.parcel_status === "ready" ) {
        await parcel.updateOne({ $unset: { code: 1}, parcel_status : 'picked'  }).then(() =>  res.send({message: `Parcel picked`}))
        .catch(err => console.error('Error deleting code field:', err));
        return;
    } 
    if (parcel.parcel_status === "sent") {
        parcel.parcel_status = "ready"
        parcel.code = getCode(4);
        await parcel.save();
        res.send({message: `Parcel delivered`});
        return;
    }
    else {
        res.status(404).send({ message: 'Parcel Not Found' });
        return;
    }
      
 }     
)

export default parcelRoute;