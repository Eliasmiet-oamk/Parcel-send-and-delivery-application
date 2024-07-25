import express from "express";
import Parcel from "../models/parcelModel.js";
import passport from "passport";
import { getAvailableLockers } from "../middleware/getAvailableLockers.js";
import { applyPassportStrategybasic } from "../middleware/basicStrategy.js";
import { applyPassportStrategyjwt } from "../middleware/jwtStrategy.js";
import { getCode } from "../middleware/getCode.js";

const parcelRoute = express.Router();

applyPassportStrategybasic(passport);
applyPassportStrategyjwt(passport);

parcelRoute.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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

    // misc
    const user_id = req.body.user_id;
    const drop_off_location = req.body.drop_off_location;

    // Validate data
    if (
      !recipient_name &&
      !recipient_address &&
      !sender_name &&
      !sender_address &&
      !user_id &&
      !drop_off_location &&
      !recipient_phonenumber &&
      !sender_phonenumber &&
      !parcel_height &&
      !parcel_width &&
      !parcel_depth &&
      !parcel_weight
    ) {
      res.status(404).send({ message: "Not all information sent" });
      return;
    }

    // Test wheter there is letters
    var regExp = /[a-zA-Z]/g;
    if (
      regExp.test(recipient_phonenumber) &&
      regExp.test(sender_phonenumber) &&
      regExp.test(parcel_height) &&
      regExp.test(parcel_width) &&
      regExp.test(parcel_depth) &&
      regExp.test(parcel_weight)
    ) {
      res.status(404).send({ message: "Incorrect data" });
      return;
    }

    // Get avalaible lockers
    const available_locker = await getAvailableLockers(drop_off_location);

    // Send error if no lockers available
    if (available_locker.available_lockers.length <= 0) {
      res.status(404).send({ message: "No lockers for location found" });
      return;
    }

    // take avalaible lockers from the object
    const a_l = available_locker.available_lockers;

    // Choose random avalaible locker from given location
    const random = Math.floor(Math.random() * a_l.length);

    let parcel_locker = a_l[random];

    // Get code for opening locker
    const code = getCode(4);

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
      res.status(404).send({ message: "Parcel creation failed" });
      return;
    }
  },
);

parcelRoute.post(
  "/getUserparcels",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const idU = req.body.user_id;
    if (!idU) {
      res.status(404).send({ message: "No user id found" });
      return;
    }
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

    if (!recipient_name) {
      res.status(404).send({ message: "No username found" });
      return;
    }
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

parcelRoute.post("/openparcelbox", async (req, res) => {
  const drop_off_location = req.body.drop_off_location;
  const parcel_locker = req.body.parcel_locker;
  const code = req.body.code;

  if (!drop_off_location && !parcel_locker && !code) {
    res.status(404).send({ message: "Correct infromation not sent" });
    return;
  }

  // find all parcels from correct location with the status of sent & ready
  const parcel = await Parcel.find({
    drop_off_location: drop_off_location,
    parcel_status: { $in: ["sent", "ready"] },
  });

  if (parcel.length <= 0) {
    return;
  }

  // Find if the user inputs locker or code are wrong
  for (let key in parcel) {
    if (parcel[key].parcel_locker != parcel_locker) {
      if (parcel[key].code == code) {
        console.log(parcel[key]);
        console.log("wrong locker");
        res.status(404).send({ message: "wrong locker" });
        return;
      }
    }
    if (parcel[key].code != code) {
      if (parcel[key].parcel_locker == parcel_locker) {
        console.log(parcel[key]);
        console.log("Wrong code");
        res.status(404).send({ message: "Wrong code" });
        return;
      }
    }
  }
  // find the correct parcel
  const parcel2 = await Parcel.find({
    drop_off_location: drop_off_location,
    parcel_locker: parcel_locker,
    code: code,
    parcel_status: { $in: ["sent", "ready"] },
  });
  if (parcel2.length <= 0) {
    res.status(404).send({ message: "No parcel found" });
    return;
  }
  if (parcel2[0].parcel_status === "ready") {
    res.send({
      message: `DOOR ${parcel_locker} OPEN FOR PICKUP`,
    });
    return;
  } else if (parcel2[0].parcel_status === "sent") {
    res.send({
      message: `DOOR ${parcel_locker} OPEN FOR DELIVERY`,
    });
    return;
  } else {
    res.status(404).send({ message: "Parcel Not Found" });
    return;
  }
});

parcelRoute.put("/updatestatus", async (req, res) => {
  const drop_off_location = req.body.drop_off_location;
  const parcel_locker = req.body.parcel_locker;
  const code = req.body.code;

  if (!drop_off_location && !parcel_locker && !code) {
    res.status(404).send({ message: "Correct infromation not sent" });
    return;
  }

  const parcel = await Parcel.findOne({
    drop_off_location: drop_off_location,
    parcel_locker: parcel_locker,
    code: code,
  });
  if (!parcel) {
    res.status(404).send({ message: "Parcel Not Found" });
    return;
  }
  if (parcel.parcel_status === "ready") {
    await parcel
      .updateOne({
        $unset: { code: 1 },
        parcel_status: "picked",
        parcel_picked: new Date(),
      })
      .then(() => res.send({ message: `Parcel picked` }))
      .catch((err) => console.error("Error deleting code field:", err));
    return;
  }
  if (parcel.parcel_status === "sent") {
    parcel.parcel_status = "ready";
    parcel.code = getCode(4);
    await parcel.save();
    res.send({ message: `Parcel delivered` });
    return;
  } else {
    res.status(404).send({ message: "Parcel Not Found" });
    return;
  }
});

parcelRoute.post(
  "/getlockers",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const drop_off_location = req.body.drop_off_location;
    if (!drop_off_location) {
      res.status(404).send({ message: "Correct infromation not sent" });
      return;
    }
    const available_locker = await getAvailableLockers(drop_off_location);
    try {
      res
        .status(201)
        .send({ message: "Success", available_lockers: available_locker });
    } catch (err) {
      console.log(err);
    }
  },
);

parcelRoute.put(
  "/driverParcel",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const drop_off_location = req.body.drop_off_location;
    const parcel_locker = req.body.parcel_locker;
    if (!drop_off_location && !parcel_locker) {
      res.status(404).send({ message: "Correct infromation not sent" });
      return;
    }

    // find parcel
    console.log(drop_off_location, parcel_locker);
    const parcel = await Parcel.findOne({
      drop_off_location: drop_off_location,
      parcel_locker: parcel_locker,
    });
    console.log(parcel);
    if (!parcel) {
      res.status(404).send({ message: "Parcel Not Found" });
      return;
    }
    // confirm status of the parcel
    if (parcel.parcel_status === "sent") {
      await parcel
        .updateOne({
          parcel_status: "Driver_picked",
          drop_off_location: "On_the_way",
        })
        .then(() => res.send({ message: `successsfsadasd` }))
        .catch((err) => console.error("Error ", err));
      return;
    } else {
      res.status(404).send({ message: "Parcel Not Found" });
      return;
    }
  },
);

parcelRoute.get(
  "/drivers",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // find parcel
    const parcel = await Parcel.find({
      drop_off_location: "On_the_way",
      parcel_status: "Driver_picked",
    });
    console.log(parcel);
    if (parcel) {
      Parcel.find({
        drop_off_location: "On_the_way",
        parcel_status: "Driver_picked",
      }).then((parcel) => res.json(parcel));
    } else {
      res.status(404).send({ message: "Parcel Not Found" });
      return;
    }
  },
);

parcelRoute.put(
  "/deliverParcel",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const _id = req.body._id;
    const drop_off_location = req.body.drop_off_location;
    const parcel_locker = req.body.parcel_locker;
    if (!_id && !drop_off_location && !parcel_locker) {
      res.status(404).send({ message: "Correct infromation not sent" });
      return;
    }
    if (parcel_locker <= 0 && _id <= 0 && drop_off_location <= 0) {
      res.status(404).send({ message: "Correct infromation not sent" });
      return;
    }
    const parcel = await Parcel.findOne({ _id: _id });
    if (parcel) {
      console.log(parcel);
      if (parcel.parcel_status === "Driver_picked") {
        await parcel
          .updateOne({
            parcel_status: "ready",
            drop_off_location: drop_off_location,
            parcel_locker: parcel_locker,
            parcel_ready: new Date(),
          })
          .then(() => res.send({ message: `success` }))
          .catch((err) => console.error("Error ", err));
      } else {
        res.status(404).send({ message: "Parcel Not Found" });
      }
    } else {
      res.status(404).send({ message: "Parcel Not Found2" });
    }
  },
);

export default parcelRoute;