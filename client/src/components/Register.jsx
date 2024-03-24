/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setpwd] = useState("");
  const [redirect,setredirect]=useState(false);
  async function registerUser(e){
    e.preventDefault()
    // axios.get('http://localhost:3000/test');
    try{
      await axios.post('http://localhost:3000/register',{
      name,
      email,
      pwd,
    })
    alert('Registration Succesful. Now you can Login')
    setredirect(true);
    }
    catch(e){
      alert('Registration Unsuccesful. Try again Later')
    }
  }
  if(redirect) return <Navigate to="/login" />
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-32">
        <h1 className="text-center text-4xl mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          <input
            className="w-full border my-2 py-2 px-2 rounded-2xl"
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            onChange={(e) => setpwd(e.target.value)}
          />
          <button className="bg-primary my-2 w-full p-2 text-white rounded-xl">
            Register
          </button>
          <div className="text-center py-2 text-gray-500">
            Already Have an account yet?{" "}
            <Link className="underline text-black" to={"/login"}>
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
