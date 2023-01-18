const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");
const contactRoutes = require("./routes/contacts");
require("dotenv").config();

const app = express();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.listen(5000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server Started Successfully.");
  }
});


app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST","DELETE","PUT"],
    credentials: true
  })
);
app.use(cookieParser());

app.use(express.json());
app.use("/api", authRoutes);
app.use("/api", contactRoutes);
