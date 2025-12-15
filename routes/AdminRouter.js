const express = require("express");
const User = require("../db/userModel.js");
const mongoose = require("mongoose");
const router = express.Router();

router.post("/login", async (request, response) => {
  const { login_name, password } = request.body;
  if (!login_name || !login_name.trim()) {
    return response.status(400).send("login_name is require");
  }

  try {
    const user = await User.findOne({ login_name }).lean();
    if (!user) {
      return response.status(400).send("Invalid login_name");
    }
    if (!password || !password.trim()) {
      return response.status(400).send("password is require");
    }
    if (password && user.password && password != user.password) {
      return response.status(400).send("Invalid password");
    }
    return response.status(200).send({
      _id: user._id,
      login_name: user.login_name,
      first_name: user.first_name,
      last_name: user.last_name,
    });
  } catch (err) {
    console.log("Error login");
    return response.status(500).send("Internal server error");
  }
});

router.post("/logout", (req, res) => {
  try {
    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).send("Logout failed");
  }
});
module.exports = router;
