/* eslint-disable no-unused-vars */
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { data } from "autoprefixer";
export const UserContext = createContext({});

// eslint-disable-next-line react/prop-types
export function UserContextProvider({ children }) {
  const [user, setuser] = useState(null);
  const [ready,setReady]=useState(false)
  useEffect(() => {
    async function fetchUser() {
      try {
        const {data} = await axios.get("http://localhost:3000/profile", {
          withCredentials: true,
        });
        //console.log(data);
        setuser(data);
        setReady(true);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    if (!user) {
      fetchUser();
    }
  }, [user]);
  return (
    <UserContext.Provider value={{ user, setuser,ready,setReady }}>
      {children}
    </UserContext.Provider>
  );
}
