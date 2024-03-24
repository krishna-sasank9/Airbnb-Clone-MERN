/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BookingWidjet from "../BookingWidjet";
import PlaceGallery from "../PlaceGallery";

function PlaceHomePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [showall, setshowall] = useState(false);
  useEffect(() => {
    if (!id) {
      return;
    } else {
      axios.get(`http://localhost:3000/places/${id}`).then((res) => {
        setPlace(res.data);
      });
    }
  }, [id]);
  if (!place) {
    return "";
  }
 

  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="text-3xl">{place.title}</h1>
      <a
        className="my-3 font-semibold underline flex gap-1"
        target="_blank"
        href={"https://maps.google.com/?q=" + place.address}
        rel="noreferrer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
            clipRule="evenodd"
          />
        </svg>

        {place.address}
      </a>
      <PlaceGallery place={place}/>

      <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4 ">
            <h2 className="font-semibold text-2xl">Description</h2>
            {place.description}
          </div>
          Check-in: {place.checkIn}pm
          <br />
          Check-out: {place.checkOut}pm
          <br />
          Max Number of guests: {place.maxGuests}
        </div>
        <div>
          <BookingWidjet place={place} />
        </div>
      </div>
      <div className="bg-white -mx-8 px-8 py-8 border-t">
        <div>
          <h2 className="font-semibold text-2xl">Extra Info</h2>
        </div>
        <div className="mb-4 mt-2 text-gray-700 text-sm leading-5">
          {place.extraInfo}
        </div>
      </div>
    </div>
  );
}

export default PlaceHomePage;
