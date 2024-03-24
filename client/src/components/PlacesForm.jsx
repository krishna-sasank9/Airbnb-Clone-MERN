/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Perks from "../Perks";
import axios from "axios";
import PhotosUploader from "../PhotosUploader";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";

function PlacesForm() {


  const {id} = useParams();
  console.log(id);
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [photos, setphotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extrainfo, setextrainfo] = useState("");
  const [checkin, setcheckin] = useState("");
  const [checkout, setcheckout] = useState("");
  const [maxg, setmaxg] = useState(1);
  const [price,setPrice]=useState(1000);
  const [redirect,setredirect]=useState(false);

  useEffect(() => {
    if(id===undefined){
      return;
    }
    else{
      axios.get('http://localhost:3000/places/'+id).then(res=>{
        const {data}=res;
        setTitle(data.title);
        setAddress(data.address)
        setphotos(data.photos);
        setDescription(data.description);
        setPerks(data.perks);
        setextrainfo(data.extraInfo);
        setcheckin(data.checkIn);
        setcheckout(data.checkOut);
        setmaxg(data.maxGuests);
        setPrice(data.price);
      })
    }
  },[id]);


  async function saveplace(e) {
    e.preventDefault();
    const placeData = {
      title,
      address,
      photos,
      description,
      perks,
      extrainfo,
      checkin,
      checkout,
      maxg,
      price,
    };
    if(id){
      await axios.put("http://localhost:3000/places", {id,...placeData});
      setredirect(true);
    }
    else{
      //new place
      await axios.post("http://localhost:3000/places", {...placeData});
      setredirect(true);
    }
    
    
  }
  if(redirect){
    return <Navigate to={'/account/places'}/>
  }


  return (
    <div>
    <AccountNav/>
      <form onSubmit={saveplace}>
        <h2 className="text-2xl mt-4">Title</h2>
        <p className="text-gray-500 text-sm">Title for your place</p>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="title"
        />
        <h2 className="text-2xl mt-4">Address</h2>
        <p className="text-gray-500 text-sm">Adress to this place</p>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="address"
        />
        <h2 className="text-2xl mt-4">Photos</h2>
        <p className="text-gray-500 text-sm">More = Better</p>
        <PhotosUploader photos={photos} onChange={setphotos} />

        <h2 className="text-2xl mt-4">Description</h2>
        <p className="text-gray-500 text-sm">Description of the place</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <h2 className="text-2xl mt-4">Perks</h2>
        <p className="text-gray-500 text-sm">
          Select all the perks of your place
        </p>
        <div className="gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mt-2">
          <Perks selected={perks} onChange={setPerks} />
        </div>
        <h2 className="text-2xl mt-4">Extra Information</h2>
        <p className="text-gray-500 text-sm">House rules.</p>
        <textarea
          value={extrainfo}
          onChange={(e) => setextrainfo(e.target.value)}
        />
        <h2 className="text-2xl mt-4">Check in&out times.</h2>
        <p className="text-gray-500 text-sm">Add check in&out times.</p>
        <div className="gap-2 grid grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 -mb-1">Check-In time</h3>
            <input
              type="text"
              value={checkin}
              onChange={(e) => setcheckin(e.target.value)}
              placeholder="10"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Check-Out time</h3>
            <input
              type="text"
              value={checkout}
              onChange={(e) => setcheckout(e.target.value)}
              placeholder="10"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Max number of Guests</h3>
            <input
              type="number"
              value={maxg}
              onChange={(e) => setmaxg(e.target.value)}
              placeholder="-"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Price Per Night</h3>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="-"
            />
          </div>
        </div>
        <button className="primary my-4">Save</button>
      </form>
    </div>
  );
}

export default PlacesForm;
