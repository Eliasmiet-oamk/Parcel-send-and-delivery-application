import react, {useState} from 'react';

  
  export default function Parcels() {
    const [parcel, setParcel] = useState("");



    const listItems = parcel.results.map(parcel =>
      <li>{parcel.name}</li>
    );
    return <ul>{listItems}</ul>;
  }
  