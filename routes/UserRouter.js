const express = require("express");
const Photo = require("../db/photoModel");
const router = express.Router();
const User = require("../db/userModel");
const mongoose = require("mongoose");

router.post("", async (request, response) => {
  const {
    login_name,
    password,
    first_name,
    last_name,
    location,
    description,
    occupation,
  } = request.body;
  if (!login_name || !password || !first_name || !last_name) {
    return response
      .status(400)
      .send("login_name, password, first_name, last_name is not empty");
  }
  try {
    const exist = await User.findOne({ login_name }).lean();
    if (exist) {
      response.status(400).send("login_name already exist");
    }
    const newUser = new User({
      login_name,
      password,
      first_name,
      last_name,
      location: location || "",
      description: description || "",
      occupation: occupation || "",
    });
    await newUser.save();
    return response.status(200).send({
      login_name: newUser.login_name,
      _id: newUser._id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
    });
  } catch (err) {
    console.error("Error in POST /user");
    return response.status(500).send("Internal server error");
  }
});

router.get("/list", async (request, response) => {
  try {
    const users = await User.find({}, "_id first_name last_name").lean();
    response.status(200).send(users);
  } catch (err) {
    console.error("Error in GET /api/user/list:", err);
    response.status(500).send({ message: "Internal server error" });
  }
});

router.get("/:id", async (request, response) => {
  const { id } = request.params;
  try {
    const user = await User.findById(
      id,
      "_id first_name last_name location description occupation"
    ).lean();
    if (!user) {
      return response.status(400).send({ message: "User not found" });
    }
    response.status(200).send(user);
  } catch (err) {
    console.error("Error in GET /api/user/:id:", err);
    response.status(500).send({ message: "Internal server error" });
  }
});
module.exports = router;
