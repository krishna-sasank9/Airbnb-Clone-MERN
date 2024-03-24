/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import Places from "./Places";
import AccountNav from "../AccountNav";



function Account() {
  const { ready, user, setuser } = useContext(UserContext);
  const [toHomePage, setToHomePage] = useState(null);
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "profile";
  }
  async function logout() {
    await axios.post("http://localhost:3000/logout");
    setToHomePage("/");
    setuser(null);
  }
  if (!ready) {
    return "Loading...";
  }
  if (ready && !user && !toHomePage) {
    return <Navigate to={"/login"} />;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (toHomePage) {
    return <Navigate to={toHomePage} />;
  }
  return (
    <div>
      <AccountNav/>
      {subpage === "profile" && (
        <div className="text-center py-8 max-w-xl mx-auto ">
          <h1>
            Logged in as {user.name} ({user.email})
          </h1>
          <br />
          <button
            onClick={logout}
            className="bg-primary my-2 w-full p-2 max-w-sm text-white rounded-xl"
          >
            Logout
          </button>
        </div>
      )}
      {subpage === "places" && (
        <div>
          <Places />
        </div>
      )}
    </div>
  );
}

export default Account;
