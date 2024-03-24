const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User.js");
const Place = require("./models/Place.js");
const Booking = require("./models/Booking.js");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
const imgdownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
require("dotenv").config();

const app = express();
const crypted = bcrypt.genSaltSync(10);
const Secret = "jksdjhdhcabdskjab";

app.use(express.json());
app.use(cookieparser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(express.urlencoded({ extended: true }));
try {
  mongoose.connect(process.env.MONGO_URL);
  console.log("Successfully Connected to the Database!");
} catch {
  console.log("Failed to connect");
}

function getUserdata(req){
  return  new Promise((resolve, reject)=>{
    jwt.verify(req.cookies.token, Secret, {}, async (e, userData) => {
    if(e) throw e;
    resolve(userData);
  });
  });
}



app.get("/test", (req, res) => {
  res.json("Test Ok");
});
// REGISTER USER
app.post("/register", async (req, res) => {
  const { name, email, pwd } = req.body;
  try {
    const userNew = await User.create({
      name,
      email,
      pwd: bcrypt.hashSync(pwd, crypted),
    });
    res.json(userNew);
  } catch (e) {
    res.status(422).json(e);
  }
});

// LOGIN USER
app.post("/login", async (req, res) => {
  const { email, pwd } = req.body;
  const userdoc = await User.findOne({ email });
  if (userdoc) {
    const password = bcrypt.compareSync(pwd, userdoc.pwd);
    if (password) {
      jwt.sign(
        { email: userdoc.email, id: userdoc._id },
        Secret,
        {},
        (error, token) => {
          if (error) throw error;
          else {
            const options = {
              secure: true,
              sameSite: "none",
            };
            res.cookie("token", token, options).json(userdoc);
          }
        }
      );
    } else {
      res.status(422).json("Wrong pass");
    }
  } else {
    res.json("Not Found");
  }
});

// PROFILE
app.get("/profile", async (req, res) => {
  try {
    const { token } = req.cookies;
    if (token) {
      await jwt.verify(token, Secret, {}, async (e, userData) => {
        if (e) throw e;
        else {
          const { name, email, _id } = await User.findById(userData.id);
          res.json({ name, email, _id });
        }
      });
    } else {
      res.json(null);
    }
  } catch (e) {
    res.status(500).json(e);
  }
});

//LOGOUT
app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

//Uploading photo by link
app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imgdownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });
  res.json(newName);
});

//Upload from files
const photosmiddle = multer({ dest: "uploads/" });
app.post("/upload", photosmiddle.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads\\", ""));
  }
  res.json(uploadedFiles);
});

//Posting Places data into database
app.post("/places", (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    photos,
    description,
    perks,
    extrainfo,
    checkin,
    checkout,
    maxg,
  } = req.body;
  jwt.verify(token, Secret, {}, async (e, userData) => {
    if (e) throw e;
    const placeDoc = await Place.create({
      owner: userData.id,
      title,
      address,
      photos,
      description,
      perks,
      extraInfo: extrainfo,
      checkIn: checkin,
      checkOut: checkout,
      maxGuests: maxg,
    });
    res.json(placeDoc);
  });
});
//Update places data in the database
app.put("/places", async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
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
  } = req.body;
  jwt.verify(token, Secret, {}, async (e, userData) => {
    if (e) throw e;
    const placedoc = await Place.findById(id);
    if (userData.id === placedoc.owner.toString()) {
      placedoc.set({
        title,
        address,
        photos,
        description,
        perks,
        extraInfo: extrainfo,
        checkIn: checkin,
        checkOut: checkout,
        maxGuests: maxg,
        price,
      });
      await placedoc.save();
      res.json("Updated!!");
    }
  });
});

//Getting user-places data
app.get("/user-places", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, Secret, {}, async (e, userData) => {
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

//Getting specific place data
app.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
});

//Getting  all places data
app.get("/places", async (req, res) => {
  res.json(await Place.find());
});

//Posting bookings data
app.post("/bookings", async (req, res) => {
  const userData = await getUserdata(req);
  const { place, checkIn, checkOut, guests, name, phone, price, } = req.body;
  const bookingDoc = await Booking.create({
    place,
    user:userData.id,
    checkIn,
    checkOut,
    guests,
    name,
    phone,
    price,
  });
  res.json(bookingDoc);
});
//Getting bookings data
app.get("/bookings",async (req, res) => {
  const userData = await getUserdata(req);
  res.json(await Booking.find({user:userData.id}).populate('place'));
});


app.listen(3000);
