/* eslint-disable no-unused-vars */
import "./App.css";
import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Index from "./components/Index";
import Login from "./components/Login";
import Layout from "./Layout";
import Register from "./components/Register";
import Profile from "./components/Profile";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import Places from "./components/Places";
import PlacesForm from "./components/PlacesForm";
import PlaceIndex from "./components/PlaceHomePage";
import Bookings from "./components/Bookings";
import Booking from "./components/Booking";
axios.defaults.withCredentials = true;
function App() {
  return (
    <UserContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<Profile />} />
            <Route path="/account/places" element={<Places />} />
            <Route path="/account/places/new" element={<PlacesForm />} />
            <Route path="/account/places/:id" element={<PlacesForm />} />
            <Route path="/place/:id" element={<PlaceIndex />} />
            <Route path="/account/bookings" element={<Bookings />} />
            <Route path="/account/bookings/:id" element={<Booking/>} />
          </Route>
        </Routes>
      </Router>
    </UserContextProvider>
  );
}

export default App;
