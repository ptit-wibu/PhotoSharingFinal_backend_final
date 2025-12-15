const express = require("express");
const Photo = require("../db/photoModel");
const router = express.Router();
const User = require("../db/userModel");
const mongoose = require("mongoose");

router.post("/", async (request, response) => {});
/*
router.get("/list", async (request, response) => {
  try {
    const users = await User.find({}, "_id first_name last_name").lean();
    response.status(200).send(users);
  } catch (err) {
    console.error("Error in GET /api/user/list:", err);
    response.status(500).send({ message: "Internal server error" });
  }
});
*/

router.get("/photosOfUser/:id", async (request, response) => {
  const id = request.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).send({ message: "Invalid user id format." });
  }

  try {
    const user = await User.findById(id).lean();
    if (!user) {
      return response.status(400).send({ message: "User not found" });
    }
    const photos = await Photo.find(
      { user_id: id },
      "_id user_id comments file_name date_time"
    ).lean();
    //response.send(photos);
    const resultPhotos = [];
    for (const photo of photos) {
      const newComment = [];
      for (const cmt of photo.comments || []) {
        let commenter = null;
        if (cmt.user_id) {
          commenter = await User.findById(
            cmt.user_id,
            "_id first_name last_name"
          ).lean();
        }
        newComment.push({
          _id: cmt._id,
          comment: cmt.comment,
          date_time: cmt.date_time,
          user: commenter
            ? {
                _id: commenter._id,
                first_name: commenter.first_name,
                last_name: commenter.last_name,
              }
            : null,
        });
      }
      resultPhotos.push({
        _id: photo._id,
        user_id: photo.user_id,
        file_name: photo.file_name,
        date_time: photo.date_time,
        comments: newComment,
      });
    }
    response.status(200).send(resultPhotos);
  } catch (err) {
    console.error("Error in GET /api/photo/photosOfUser/:id:", err);
    response.status(500).send({ message: "Internal server error" });
  }
});
module.exports = router;
