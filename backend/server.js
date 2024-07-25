import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import usersRoute from "./routes/usersRoute.js";
import parcelRoute from "./routes/parcelRoute.js";
import Parcel from "./models/parcelModel.js";
import User from "./models/userModel.js";
import { getAvailableLockers } from "./middleware/getAvailableLockers.js";
import { getCode } from "./middleware/getCode.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect(process.env.MONGODB_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.on("open", () => console.log("Connected"));

app.use("/api/users", usersRoute);
app.use("/api/parcel", parcelRoute);

app.listen(port, function () {
  console.log("Server running");
});

// Bot that sends parcels and makes deliveries

// function that sends parcels
async function sendParcel() {
  const locations = [
    "Location_1",
    "Location_2",
    "Location_3",
    "Location_4",
    "Location_5",
  ];
  const random_drop_off_location =
    locations[Math.floor(Math.random() * locations.length)];
  const lockers = await getAvailableLockers(random_drop_off_location);
  const users = await User.find({ roles: "user" });
  const random_user_index = Math.floor(Math.random() * users.length);
  const available_lockers = lockers.available_lockers;
  const random_available_lockers_index = Math.floor(
    Math.random() * available_lockers.length,
  );

  // Create Parcels
  // misc
  const drop_off_location = random_drop_off_location;
  const parcel_locker = available_lockers[random_available_lockers_index];

  // if no available parcels_lockers return
  if (parcel_locker == null) {
    return;
  }

  const user_id = users[random_user_index]._id;
  const code = getCode(4);

  // recipient
  const recipient_name =
    users[Math.floor(Math.random() * users.length)].username;
  const recipient_address = getCode(10);
  const recipient_phonenumber = Math.floor(Math.random() * 1000000000);

  // Sender
  const sender_name = users[random_user_index].username;
  const sender_address = getCode(10);
  const sender_phonenumber = Math.floor(Math.random() * 1000000000);

  // Parcel
  const parcel_height = Math.floor(Math.random() * 100) + 1;
  const parcel_width = Math.floor(Math.random() * 100) + 1;
  const parcel_depth = Math.floor(Math.random() * 100) + 1;
  const parcel_weight = Math.floor(Math.random() * 100) + 1;
  const parcel_status = "sent";

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
    newParcel.save();
  } catch (err) {
    console.log(err);
    return;
  }
}

// function that delivers Parcels
async function deliverParcels() {
  const random_number = Math.floor(Math.random() * 3);
  let i = 0;
  while (i < random_number) {
    // find random parcel with status sent
    const sent_parcels = await Parcel.find({ parcel_status: "sent" });
    if (sent_parcels === undefined || sent_parcels.length == 0) {
      return;
    }
    const random_parcel_index = Math.floor(Math.random() * sent_parcels.length);
    const random_parcel = sent_parcels[random_parcel_index];
    // update random parcel
    await random_parcel.updateOne({
      parcel_status: "ready",
      parcel_ready: new Date(),
    });
    i++;
  }
}
// Run every five minutes
setInterval(
  async function () {
    // Send Parcels
    sendParcel();
    // Create Deliveries
    deliverParcels();
  },
  1000 * 60 * 5,
); // 5 * 60 * 1000 milsec
