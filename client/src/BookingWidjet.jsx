import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";
/* eslint-disable react/prop-types */
function BookingWidjet({ place }) {
  const [checkIn, setcheckIn] = useState("");
  const [checkOut, setcheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setMobile] = useState("");
  const [redirect, setredirect] = useState('');
  const {user}=useContext(UserContext);

  useEffect(()=>{
    if(user){
      setName(user.name);
    }
  },[user]);

  let numofnights=0;
  if(checkIn && checkOut){
    numofnights=differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  }

  async function bookPlace(){
    const data={place:place._id,checkIn,checkOut,
        guests,name,phone,
        price:numofnights*place.price};
    const response =await axios.post("http://localhost:3000/bookings",data);
    const bookingId=response.data._id;
    setredirect(`/account/bookings/${bookingId}`);
  }

  if(redirect){
    return <Navigate to={redirect} />
  }

  return (
    <div className="bg-white shadow p-4 rounded-xl ">
      <div className="text-2xl text-center">
        Price: Rs-{place.price} / per night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4 ">
            <label>Check In: </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => {
                setcheckIn(e.target.value);
              }}
            />
          </div>
          <div className="py-3 px-4 border-l">
            <label>Check Out: </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => {
                setcheckOut(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="py-3 px-4 border-t">
          <label>Number of Guests: </label>
          <input
            type="number"
            value={guests}
            onChange={(e) => {
              setGuests(e.target.value);
            }}
          />
        </div>
        {checkIn && checkOut && (
          <div className="py-3 px-4 border-t">
            <label>Your Full Name: </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <label>Your Phone Number: </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setMobile(e.target.value);
              }}
            />
          </div>
        )}
      </div>
      <button onClick={bookPlace} className="primary mt-4">
        Reserve
        {checkIn &&
          checkOut &&
          differenceInCalendarDays(new Date(checkOut), new Date(checkIn)) >
            0 && (
            <span>
              Rs-
              {differenceInCalendarDays(new Date(checkOut), new Date(checkIn)) *
                place.price}
            </span>
          )}
      </button>
    </div>
  );
}

export default BookingWidjet;
