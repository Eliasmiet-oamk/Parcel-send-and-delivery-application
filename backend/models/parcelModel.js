import mongoose from "mongoose";


const parcelSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    recipient_name: { type: String, required: true },
    recipient_address: { type: String, required: true },
    recipient_phonenumber: { type: Number, required: true },
    sender_name: { type: String, required: true },
    sender_address: { type: String, required: true },
    sender_phonenumber: { type: Number, required: true },
    parcel_height: { type: Number, required: true },
    parcel_width: { type: Number, required: true },
    parcel_depth: { type: Number, required: true },
    parcel_weight: { type: Number, required: true },
    parcel_status: { type: String, required: true },
    code: { type: String, required: false },
    drop_off_location: {
      type: String,
      enum: [
        "Location_1",
        "Location_2",
        "Location_3",
        "Location_4",
        "Location_5",
      ],
      required: true,
    },
    parcel_locker: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);



const Parcel = mongoose.model("Parcel", parcelSchema);

export default Parcel;