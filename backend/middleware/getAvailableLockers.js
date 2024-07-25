import Parcel from "../models/parcelModel.js";

export async function getAvailableLockers(drop_off_location) {
  //find all Parcels from given location with the status of sent or ready
  const parcel = await Parcel.find({
    drop_off_location: drop_off_location,
    parcel_status: { $in: ["sent", "ready"] },
  });

  let taken_lockers = [];
  let locker_info = [];
  let potential_lockers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  // if no parcels found return potential lockers and empty locker info
  if (!parcel) {
    return { available_lockers: potential_lockers, locker_info: locker_info };
  }

  for (let key in parcel) {
    // Push all taken lockers to a array
    taken_lockers.push(parcel[key].parcel_locker);
    // push parcel locker and parcel status into a array called locker info
    if (parcel.length >= 0) {
      locker_info.push({
        locker: parcel[key].parcel_locker,
        status: parcel[key].parcel_status,
      });
    }
  }
  // Compare lockers found from the database to potential lockers
  let available_lockers = potential_lockers.filter(function (el) {
    return !taken_lockers.includes(el);
  });

  return { available_lockers: available_lockers, locker_info: locker_info };
}