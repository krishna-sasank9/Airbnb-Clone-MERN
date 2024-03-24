/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";


function Login() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setuser } = useContext(UserContext);

  async function loginUser(e) {
    e.preventDefault();
    try {
      const {data} = await axios.post("http://localhost:3000/login",{email,pwd});
      //console.log(userinfo)&& data.userdoc
      if(data && data.email){
        setuser(data)
        alert("Login Successful.");
        setTimeout(() => {
          setRedirect(true);
        }, 0);}
      else{
        throw new Error ("Invalid Email or Password")
      }
    } catch (e) {
      alert("Login Unsuccessful.");
    }
  }
  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="-mt-32">
        <h1 className="text-center text-4xl mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={loginUser}>
          <input
            className="w-full border my-2 py-2 px-2 rounded-2xl"
            type="email"
            placeholder="your@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full border my-2 py-2 px-2 rounded-2xl"
            type="password"
            placeholder="Password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
          />
          <button className="bg-primary my-2 w-full p-2 text-white rounded-xl">
            Login
          </button>
          <div className="text-center py-2 text-gray-500">
            Don't Have an account yet?{" "}
            <Link className="underline text-black" to={"/register"}>
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
